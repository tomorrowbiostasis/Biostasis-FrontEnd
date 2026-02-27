import Foundation
import HealthKit

enum HealthKitManagerError: Error {
  case Deallocated
  case HealthKitNotAvilable
}

protocol IManageHealthkit {
  /// Asks for Authorization and starts observer process
  func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?) -> ())
  /// Starts observer process
  func startObservers(completion: @escaping (_ error: Error?) -> ())
  /// Disables process
  func disableObservers()
}

final class HealthKitManager {
  
  // Private
  private let healthKitStore: HKHealthStore = HKHealthStore()
  private let identifiers: Set<HKSampleType> = Set<HKSampleType>([
    HKObjectType.quantityType(forIdentifier: .heartRate),
    HKObjectType.quantityType(forIdentifier: .restingHeartRate),
    HKObjectType.quantityType(forIdentifier: .stepCount)
  ].compactMap({ $0 }))
  
  private lazy var dataHandler: IHandleHealthKitData = {
    return HealthKitDataHandler(healthKitStore: healthKitStore, delegate: dataHandlerDelegate)
  }()
  
  private unowned var dataHandlerDelegate: IDelegateHealthKitDataHandler
  private var queries: [HKSampleType: HKObserverQuery] = [:]
  private var observersEnabled: Bool {
    get {
      let enabled = UserDefaults.standard.bool(forKey: "HealthKitManagerEnabled")
      return enabled
    }
    set {
      UserDefaults.standard.set(newValue, forKey: "HealthKitManagerEnabled")
    }
  }
  
  init(dataHandlerDelegate: IDelegateHealthKitDataHandler) {
    self.dataHandlerDelegate = dataHandlerDelegate
  }

  private func logToFile(_ message: String) {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS"
    let timestamp = formatter.string(from: Date())
    let logMessage = "[\(timestamp)] \(message)\n"
    
    guard let documentsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else { return }
    let fileURL = documentsDir.appendingPathComponent("healthkit_debug.log")
    
    if let data = logMessage.data(using: .utf8) {
      if FileManager.default.fileExists(atPath: fileURL.path) {
        if let fileHandle = try? FileHandle(forWritingTo: fileURL) {
          fileHandle.seekToEndOfFile()
          fileHandle.write(data)
          fileHandle.closeFile()
        }
      } else {
        try? data.write(to: fileURL, options: .atomic)
      }
    }
  }
}

extension HealthKitManager: IManageHealthkit {
  
  func startObservers(completion: @escaping (Error?) -> ()) {
    let dispatchGroup = DispatchGroup()
    var backgroundDeliveryError: Error?
    
    observersEnabled = true
    for type in identifiers {
      dispatchGroup.enter()
      
      if let query = queries[type] {
        healthKitStore.stop(query)
      }
      
      let observerQuery = HKObserverQuery(sampleType: type, predicate: nil) { [weak self] query, completionHandler, error in
        
        guard let self = self else {
          completionHandler()
          return
        }
        
        guard self.observersEnabled, error == nil else {
          self.healthKitStore.stop(query)
          completionHandler()
          return
        }
        
        self.dataHandler.collectNewData(for: type) { sample in
          if let sample = sample {
            self.dataHandler.processNewData(for: type, with: sample)
          }
          completionHandler()
        }
      }
      
      queries[type] = observerQuery
      
      healthKitStore.enableBackgroundDelivery(for: type, frequency: .immediate) { _, error in
        if let error = error {
          backgroundDeliveryError = error
        }
        dispatchGroup.leave()
      }
      
      healthKitStore.execute(observerQuery)
    }
    
    dispatchGroup.notify(queue: DispatchQueue.main) {
      completion(backgroundDeliveryError)
    }
  }
  
  func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?) -> ()) {
    
    guard HKHealthStore.isHealthDataAvailable() else {
      completion(HealthKitManagerError.HealthKitNotAvilable)
      return
    }
    
    healthKitStore.requestAuthorization(toShare: nil, read: identifiers) { [weak self] success, error in
      
      guard success, let self = self else {
        completion(error)
        return
      }
      
      self.startObservers(completion: completion)
    }
  }
  
  func disableObservers() {
    observersEnabled = false
    healthKitStore.disableAllBackgroundDelivery { success, error in
      print("disableAllBackgroundDelivery callback: success=\(success), error=\(String(describing: error))")
    }
  }
}
