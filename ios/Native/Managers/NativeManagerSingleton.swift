import Foundation

enum NativeManagerError: Error {
  case deallocated
  case UserNotFound
}

final class NativeManagerSingleton: NSObject {
  
  @objc
  static let shared = NativeManagerSingleton()
  
  private lazy var healthKitManager: IManageHealthkit = {
    return HealthKitManager(dataHandlerDelegate: self)
  }()
  
  private lazy var notificationManager: IManageLocalNotification = {
    return LocalNotificationManager()
  }()
  
  private lazy var networkingManager: IManageNetwork = {
    guard let apiUrl = ReactNativeConfig.env(for: "API_URL"),
          let awsUrl = ReactNativeConfig.env(for: "AWS_OAUTH_DOMAIN"),
    let awsClientID = ReactNativeConfig.env(for: "AWS_POOL_WEB_CLIENT_ID") else {
      fatalError("Cannot load env file")
    }
    return NetworkingManager(apiUrl: apiUrl,
                             awsUrl: awsUrl,
                             awsClientID: awsClientID,
                             storageManager: storageManager)
  }()
  
  private lazy var storageManager: IManagePersistentStorage = {
    return PersistentStorageManager()
  }()
  
  private lazy var locationManager: LocationManager = {
    return LocationManager(delegate: self)
  }()
  
  override init() {
    super.init()
    
    print("🐤 NativeManager started")
    determineAndSetDataCollectionStatus()
  }
  
}

extension NativeManagerSingleton: IManageNativeComponents {
  /// Giving async storage time to sync settings.
  @objc(updateDataCollectionStatus)
  internal func updateDataCollectionStatus() {
    DispatchQueue.main.asyncAfter(deadline: .now()+2.5) {
      self.determineAndSetDataCollectionStatus()
    }
  }
  
}

// MARK: private Methods
extension NativeManagerSingleton {
  
  private func determineAndSetDataCollectionStatus() {
    self.storageManager.getUser { [weak self] user in
      guard let user = user else {
        print("🐤 User Settings: not found?")
        self?.stopHealthKitDataCollection()
        self?.stopLocationDataCollection()
        return
      }
      print("🐤 User Settings: \(user)")
      if user.automatedEmergency {
        if !user.regularPushNotification {
          self?.startHealthKitDataCollection()
        } else {
          self?.stopHealthKitDataCollection()
        }
        
        if user.locationAccess {
          self?.startLocationDataCollection()
        } else {
          self?.stopLocationDataCollection()
        }
        
      } else {
        self?.stopHealthKitDataCollection()
        self?.stopLocationDataCollection()
      }
    }
  }
  
  private func startHealthKitDataCollection() {
    print("🐤 Starting healt kit data collection")
    healthKitManager.requestAuthorizationAndStartObservers(completion: { _ in })
  }
  
  private func stopHealthKitDataCollection() {
    print("🐤 Stopping healt kit data collection")
    healthKitManager.disableObservers()
  }
  
  private func startLocationDataCollection() {
    print("🐤 Starting location data collection")
    locationManager.startCollectingLocation()
  }
  
  private func stopLocationDataCollection() {
    print("🐤 Stopping location data collection")
    locationManager.stopCollectingLocation()
  }
  
  private func sendPositiveUpdateToServer(completion: @escaping (Result<PositiveUpdatResponse,Error>) -> ()) {
    self.minutesToNext { [weak self] minutesToNextResult in
      guard let self = self else {
        completion(.failure(NativeManagerError.deallocated))
        return
      }
      switch minutesToNextResult {
      case .success(let minutesToNext):
        self.networkingManager.sendPositiveUpdateToServer(nextCheckInMinutes: minutesToNext,
                                                          completion: completion )
      case .failure(let error):
        completion(.failure(error))
      }
    }
  }
  
  private func updateLocation(locationUrl: String,
                              completion: @escaping (Result<Void,Error>) -> ()) {
      self.networkingManager.updateLocation(locationUrl: locationUrl,
                                             completion: completion )
  }
  
  private func minutesToNext(completion: @escaping (Result<Int,Error>) -> ()) {
    storageManager.getUser(completion: { user in
      guard let user = user,
            let positiveInfoPeriod = user.positiveInfoPeriod else {
        completion(.failure(NativeManagerError.UserNotFound))
        return
      }
      completion(.success(positiveInfoPeriod))
    })
  }
  
  private func handleNetworkingError(_ error: Error?) {
    //TODO: Handle token errors.
    guard let error = error as? URLError else {
      return
    }
    switch error.code {
    case .notConnectedToInternet,
        .internationalRoamingOff:
      self.notificationManager.scheduleSingle(notification: .EmergencyOffline,
                                              date: Date(timeIntervalSinceNow: TimeInterval(5)))
    default: break
    }
  }
  
  private func debugNotification(title: String, subtitle: String) {
    #if DEBUG
    let df = DateFormatter()
    df.dateFormat = "HH:mm"
    df.timeZone = .current
    df.calendar = .current
    notificationManager.scheduleSingle(notification: .Custom(title: "[Debug] \(df.string(from: Date())) \(title)",
                                                             subtitle: subtitle),
                                       date: Date(timeIntervalSinceNow: 1))
    #endif
  }
  
}

extension NativeManagerSingleton: IDelegateHealthKitDataHandler {
  internal func aquiredCorrectDataset(of type: String, completionHandler: @escaping (() -> Void)) {
    sendPositiveUpdateToServer() { [weak self] result in
      switch result {
      case .success(let response):
        if !response.success {
          self?.stopHealthKitDataCollection()
          self?.stopLocationDataCollection()
          self?.debugNotification(title: "Sent last positive value.",
                                  subtitle: type)
        } else {
          self?.debugNotification(title: "Sent positive value.",
                                  subtitle: type)
        }
      case .failure(let error):
        self?.handleNetworkingError(error)
      }
      completionHandler()
    }
  }
}

extension NativeManagerSingleton: IDelegateLocationDataHandler {
  func aquiredNewLocation(locationUrl: String) {
    updateLocation(locationUrl: locationUrl) { [weak self] result in
      switch result {
      case .failure(let error):
        self?.handleNetworkingError(error)
      default:
        return
      }
    }
    
    debugNotification(title: "New Location!", subtitle: locationUrl)
  }
  func locationError(error: String) {
    
    debugNotification(title: "location error!", subtitle: error)
  }
}
