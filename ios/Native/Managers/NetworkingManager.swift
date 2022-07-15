import Foundation

enum NetworkManagerError: Error {
  case ApiError
  case Auth
}

protocol IManageNetwork {
  func sendPositiveUpdateToServer(nextCheckInMinutes: Int,
                                  completion: @escaping (Result<PositiveUpdatResponse,Error>) -> ())
  func updateLocation(locationUrl: String,
                      completion: @escaping (Result<Void,Error>) -> ())
  func refreshToken(completion: @escaping (String?, Error?) -> ())
}

final class NetworkingManager {
  
  enum Endpoint {
    case sendPositiveInfo
    case sendDelayedEmergency
    case sendTestEmergency
    case updateLocation
    case refreshToken
    
    var path: String {
      switch self {
      case .sendPositiveInfo:
        return "/api/v1/user/positive-info"
      case .sendDelayedEmergency:
        return "/api/v1/message/send/emergency"
      case .sendTestEmergency:
        return "/api/v1/user/message/test"
      case .updateLocation:
        return "/api/v2/user"
      case .refreshToken:
        return "/oauth2/token"
      }
    }
    
    var httpMethod: String {
      switch self {
      case .updateLocation:
        return "PATCH"
      default:
        return "POST"
      }
    }
  }
  
  private let apiUrl: String
  private let awsUrl: String
  private let awsClientID: String
  private lazy var session: URLSession = {
    let session = URLSession.shared
    session.configuration.waitsForConnectivity = true
    session.configuration.timeoutIntervalForResource = 20
    return session
  }()
  private let storageManager: IManagePersistentStorage
  
  init(apiUrl: String,
       awsUrl: String,
       awsClientID: String,
       storageManager: IManagePersistentStorage) {
    self.apiUrl = apiUrl
    self.awsUrl = awsUrl
    self.awsClientID = awsClientID
    self.storageManager = storageManager
  }
  
  private func sendApiRequest(endpoint: Endpoint,
                              token: String,
                              bodyData: Data?,
                              completion: @escaping (Result<Data,Error>) -> ()) {
    guard let url = URL(string: apiUrl+endpoint.path) else {
      completion(.failure(NetworkManagerError.ApiError))
      return
    }
    var request = URLRequest(url: url)
    request.httpMethod = endpoint.httpMethod
    request.httpBody = bodyData
    request.setValue("application/json;charset=UTF-8", forHTTPHeaderField: "Content-Type")
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    
    
    let task = session.dataTask(with: request) { [weak self] data, response, error in
      if let response = response as? HTTPURLResponse,
         response.statusCode == 401 {
        print("🐤 Unauthoraized, refreshing token")
        self?.refreshTokenAndResume(request: request,
                                    completion: completion)
        return
      }
      
      if let error = error {
        completion(.failure(error))
        return
      }
      
      guard let data = data else {
        completion(.failure(NetworkManagerError.ApiError))
        return
      }
      
      completion(.success(data))
    }
    task.resume()
  }
  
  private func parseResponseData<RO: Decodable>(data: Data) throws -> RO {
    return try JSONDecoder().decode(RO.self, from: data)
  }
  
  private func refreshTokenAndResume(request: URLRequest,
                                     completion: @escaping (Result<Data,Error>) -> ()) {
    refreshToken { [weak self] newAuthToken, refreshTokenError in
      if let refreshTokenError = refreshTokenError {
        completion(.failure(refreshTokenError))
        return
      }
      
      guard let newAuthToken = newAuthToken else {
        completion(.failure(NetworkManagerError.Auth))
        return
      }
      
      self?.storeAuthToken(newAuthToken)
      
      var newRequest = request
      newRequest.setValue("Bearer \(newAuthToken)", forHTTPHeaderField: "Authorization")
      
      let task = self?.session.dataTask(with: newRequest) { data, response, error in
        if let error = error {
          completion(.failure(error))
          return
        }
        
        guard let data = data else {
          completion(.failure(NetworkManagerError.ApiError))
          return
        }
        
        completion(.success(data))
      }
      task?.resume()
    }
  }
  
  internal func refreshToken(completion: @escaping (String?, Error?) -> ()) {
    storageManager.getRefreshToken { [weak self] token in
      guard let self = self else { return }
      guard let token = token else {
        completion(nil, NetworkManagerError.Auth)
        return
      }
      let endpoint = Endpoint.refreshToken
      guard let url = URL(string: self.awsUrl+endpoint.path) else {
        completion(nil, NetworkManagerError.Auth)
        return
      }
      
      var request = URLRequest(url: url.sanitise)
      request.httpMethod = endpoint.httpMethod
      request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
      
      guard let body = "grant_type=refresh_token&client_id=\(self.awsClientID)&refresh_token=\(token)".data(using: .utf8) else {
        completion(nil, NetworkManagerError.Auth)
        return
      }
      
      request.httpBody = body
      
      let task = self.session.dataTask(with: request) { data, response, error in
        if let error = error {
          completion(nil, error)
          return
        }
        if let data = data,
           let refreshTokenRO = try? JSONDecoder().decode(RefreshTokenRO.self, from: data) {
          completion(refreshTokenRO.access_token, nil)
        } else {
          completion(nil, NetworkManagerError.Auth)
        }
      }
      task.resume()
    }
  }
  
  private func storeAuthToken(_ token: String) {
    storageManager.storeAccessToken(token: token)
  }
}

extension NetworkingManager: IManageNetwork {
  
  func updateLocation(locationUrl: String, completion: @escaping (Result<Void, Error>) -> ()) {
    storageManager.getAccessToken { [weak self] token in
      guard let accessToken = token else {
        completion(.failure(NetworkManagerError.Auth))
        return
      }
      let params = try? JSONEncoder().encode(UserApiParams(location: locationUrl))
      
      self?.sendApiRequest(endpoint: .updateLocation,
                           token: accessToken,
                           bodyData: params,
                           completion: { results in
        switch results {
        case .success:
          completion(.success(()))
        case .failure(let error):
          completion(.failure(error))
        }
      })
    }
  }
  
  func sendPositiveUpdateToServer(nextCheckInMinutes: Int,
                                  completion: @escaping (Result<PositiveUpdatResponse, Error>) -> ()) {
    storageManager.getAccessToken { [weak self] token in
      guard let accessToken = token else {
        completion(.failure(NetworkManagerError.Auth))
        return
      }
      let params = try? JSONEncoder().encode(PositiveUpdateApiParams(minutesToNext: nextCheckInMinutes))
      
      self?.sendApiRequest(endpoint: .sendPositiveInfo,
                           token: accessToken,
                           bodyData: params,
                           completion: { [weak self] result in
        guard let self = self else { return }
        switch result {
        case .success(let data):
          do {
            let responseObject: PositiveUpdatResponse = try self.parseResponseData(data: data)
            completion(.success(responseObject))
          } catch {
            completion(.failure(error))
          }
        case .failure(let error):
          completion(.failure(error))
        }
      })
    }
  }
}

extension URLRequest {
  public func cURL(pretty: Bool = false) -> String {
    let newLine = pretty ? "\\\n" : ""
    let method = (pretty ? "--request " : "-X ") + "\(self.httpMethod ?? "GET") \(newLine)"
    let url: String = (pretty ? "--url " : "") + "\'\(self.url?.absoluteString ?? "")\' \(newLine)"
    
    var cURL = "curl "
    var header = ""
    var data: String = ""
    
    if let httpHeaders = self.allHTTPHeaderFields, httpHeaders.keys.count > 0 {
      for (key,value) in httpHeaders {
        header += (pretty ? "--header " : "-H ") + "\'\(key): \(value)\' \(newLine)"
      }
    }
    
    if let bodyData = self.httpBody, let bodyString = String(data: bodyData, encoding: .utf8),  !bodyString.isEmpty {
      data = "--data '\(bodyString)'"
    }
    
    cURL += method + url + header + data
    
    return cURL
  }
}

private extension URL {
  
  var sanitise: URL {
    if var components = URLComponents(url: self, resolvingAgainstBaseURL: false) {
      if components.scheme == nil {
        components.scheme = "https"
      }
      return components.url ?? self
    }
    return self
  }
}
