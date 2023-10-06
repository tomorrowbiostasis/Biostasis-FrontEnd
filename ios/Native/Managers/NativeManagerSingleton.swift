import Foundation
import HealthKit

enum NativeManagerError: Error {
  case deallocated
  case UserNotFound
}

@objc(NativeManagerSingleton)
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
    guard let apiUrl = RNCConfig.env(for: "API_URL"),
          let awsUrl = RNCConfig.env(for: "AWS_OAUTH_DOMAIN"),
          let awsClientID = RNCConfig.env(for: "AWS_POOL_WEB_CLIENT_ID") else {
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
  
  private lazy var timeManager: TimeManager = {
    return TimeManager()
  }()
  private lazy var recommendationService: RecommendationService = {
    return RecommendationService()
  }()
  
  private var debounceWorkItem: DispatchWorkItem?
  
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
        if !user.regularPushNotification && user.pulseBasedTriggerIOSAppleWatchPaired{
          self?.startHealthKitDataCollection()
          self?.startRecommendationSystem()
        } else {
          self?.stopHealthKitDataCollection()
          self?.stopRecommendationSystem()
        }
      } else {
        self?.stopHealthKitDataCollection()
        self?.stopRecommendationSystem()
      }
      if user.locationAccess {
        self?.startLocationDataCollection()
      } else {
        self?.stopLocationDataCollection()
      }
    }
  }
  
  private func startHealthKitDataCollection() {
    print("🐤 Starting health kit data collection")
    healthKitManager.requestAuthorizationAndStartObservers(completion: { _ in })
  }
  
  private func stopHealthKitDataCollection() {
    print("🐤 Stopping health kit data collection")
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
  
  private func startRecommendationSystem() {
    print("🐤 Start recommendation system")
    recommendationService.startRecomendationSystem()
  }
  
  private func stopRecommendationSystem() {
    print("🐤 Stop recommendation system")
    recommendationService.stopRecommendtionSystem()
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
  
  private func handleHealthNotification(title: String, subtitle: String, data: HealthMetrics) {
     let df = DateFormatter()
     df.dateFormat = "HH:mm:ss"
     df.timeZone = .current
     df.calendar = .current
     
     let heartRateString = "💓 Heart Rate: \(data.heartRate != nil ? "\(data.heartRate ?? 0) bpm" : "no data") - 🕑 \(df.string(for: data.heartRateEndDate) ?? "no data")"
     let restingHeartRateString = "🫀 Resting Heart Rate: \(data.restingHeartRate != nil ? "\(data.restingHeartRate ?? 0) bpm" : "no data") - 🕑 \(df.string(for: data.restingHeartRateEndDate) ?? "no data")"
     let movementString = "👟 Movement: \(data.steps != nil ? "\(data.steps ?? 0) steps" : "no data") - 🕑 \(df.string(for: data.stepsEndDate) ?? "no data")"
     
 #if DEBUG
     notificationManager.scheduleSingle(
       notification: .Custom(title: "[Debug] \(title) \(df.string(from: Date()))",
                             subtitle: "\(subtitle) \n\(heartRateString)\n\(restingHeartRateString)\n\(movementString)"),
       date: Date(timeIntervalSinceNow: 1))
 #else
     
     notificationManager.scheduleSingle(
       notification: .Custom(title: "\(title) \(df.string(from: Date()))",
                             subtitle: "\(subtitle) \n\(heartRateString)\n\(restingHeartRateString)\n\(movementString)"),
       date: Date(timeIntervalSinceNow: 1))
     
 #endif
   }  
  private func handleLocationNotification(title: String, subtitle: String) {
#if DEBUG
    let df = DateFormatter()
    df.dateFormat = "HH:mm"
    df.timeZone = .current
    df.calendar = .current
    
    notificationManager.scheduleSingle(notification: .Custom(title: "[Debug] \(title) \(df.string(from: Date()))",
                                                             subtitle: subtitle),
                                       date: Date(timeIntervalSinceNow: 1))
#endif
  }
}

extension NativeManagerSingleton: IDelegateHealthKitDataHandler {  
  internal func aquiredCorrectDataset(data: HealthMetrics) {
    debounceWorkItem?.cancel()
    let workItem = DispatchWorkItem { [weak self] in
      guard let self = self else { return }
      
      self.storageManager.getUser { [weak self] user in
        guard let user = user else { return }
        
        self?.storageManager.getEmergencySettings { [weak self] settings in
          guard let emergencySettings = settings else { return }
          let isPaused = self?.timeManager.isPausedTime(pausedDate: emergencySettings.pausedDate, specificPausedTimes: emergencySettings.specificPausedTimes ?? [])
          if(isPaused ?? true) { return }
          self?.sendPositiveUpdateToServer() { result in
            switch result {
            case .success(let response):
              if !response.success {
                self?.stopHealthKitDataCollection()
                self?.stopLocationDataCollection()
                if user.allowNotifications {
                  self?.handleHealthNotification(title: "Sent last positive value.",
                                                 subtitle: "Positive health info sent",
                                                 data: data)
                }
              } else {
                self?.recommendationService.recommendationSystem(data: data)
                if user.allowNotifications {
                  self?.handleHealthNotification(title: "Automated Bio Check",
                                                 subtitle: "Positive health info sent",
                                                 data: data)
                }
              }
            case .failure(let error):
              self?.handleNetworkingError(error)
            }
          }
        }
      }
    }
    debounceWorkItem = workItem
    // wait 3 second to make sure all the health data have been updated
    DispatchQueue.main.asyncAfter(deadline: .now() + 3, execute: workItem)
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
    
    handleLocationNotification(title: "New Location!", subtitle: locationUrl)
  }
  func locationError(error: String) {
    
    handleLocationNotification(title: "location error!", subtitle: error)
  }
}
