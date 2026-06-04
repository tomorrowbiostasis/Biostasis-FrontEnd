import Foundation
import HealthKit
import CoreMotion

enum HealthKitManagerError: Error {
  case Deallocated
  case HealthKitNotAvilable
}

protocol IManageHealthkit {
  /// Asks for Authorization and starts observer process
  func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?) -> ())
  /// Asks for Authorization and fetches the latest available samples once
  func requestAuthorizationAndFetchLatest(completion: @escaping (_ error: Error?) -> ())
  /// Starts observer process
  func startObservers(completion: @escaping (_ error: Error?) -> ())
  /// Disables process
  func disableObservers()
}

final class HealthKitManager {
  
  // Private
  private let healthKitStore: HKHealthStore = HKHealthStore()
  private let pedometer = CMPedometer()
  private let identifiers: Set<HKSampleType> = Set<HKSampleType>([
    HKObjectType.quantityType(forIdentifier: .heartRate),
    HKObjectType.quantityType(forIdentifier: .restingHeartRate),
    HKObjectType.quantityType(forIdentifier: .stepCount)
  ].compactMap({ $0 }))
  
  private lazy var dataHandler: IHandleHealthKitData & IHandleHealthMetrics = {
    return HealthKitDataHandler(healthKitStore: healthKitStore, delegate: dataHandlerDelegate)
  }()
  
  private unowned var dataHandlerDelegate: IDelegateHealthKitDataHandler
  private var queries: [HKSampleType: HKObserverQuery] = [:]
  private var isLiveStepTrackingEnabled = false
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

  private func startLiveStepTracking() {
    guard CMPedometer.isStepCountingAvailable(), !isLiveStepTrackingEnabled else {
      return
    }

    isLiveStepTrackingEnabled = true
    let startOfDay = Calendar.current.startOfDay(for: Date())

    pedometer.queryPedometerData(from: startOfDay, to: Date()) { [weak self] data, _ in
      guard let self = self, let data = data else {
        return
      }

      self.dataHandler.updateTodaySteps(
        data.numberOfSteps.intValue,
        endDate: Date(),
        appendToHistory: false
      )
    }

    pedometer.startUpdates(from: startOfDay) { [weak self] data, error in
      guard let self = self, self.isLiveStepTrackingEnabled, error == nil, let data = data else {
        return
      }

      self.dataHandler.updateTodaySteps(
        data.numberOfSteps.intValue,
        endDate: Date(),
        appendToHistory: false
      )
    }
  }

  private func stopLiveStepTracking() {
    guard isLiveStepTrackingEnabled else {
      return
    }

    isLiveStepTrackingEnabled = false
    pedometer.stopUpdates()
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
        
        if type == HKQuantityType.quantityType(forIdentifier: .stepCount) {
          self.dataHandler.collectTodayStepCount { steps, endDate in
            if let steps = steps, let endDate = endDate {
              self.dataHandler.processTodayStepCount(steps, endDate: endDate)
            }
            completionHandler()
          }
        } else {
          self.dataHandler.collectNewData(for: type) { sample in
            if let sample = sample {
              self.dataHandler.processNewData(for: type, with: sample)
            }
            completionHandler()
          }
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
      self.startLiveStepTracking()
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

  func requestAuthorizationAndFetchLatest(completion: @escaping (_ error: Error?) -> ()) {
    guard HKHealthStore.isHealthDataAvailable() else {
      completion(HealthKitManagerError.HealthKitNotAvilable)
      return
    }

    healthKitStore.requestAuthorization(toShare: nil, read: identifiers) { [weak self] success, error in
      guard success, let self = self else {
        completion(error)
        return
      }

      let dispatchGroup = DispatchGroup()

      for type in self.identifiers {
        dispatchGroup.enter()
        if type == HKQuantityType.quantityType(forIdentifier: .stepCount) {
          self.dataHandler.collectTodayStepCount { steps, endDate in
            if let steps = steps, let endDate = endDate {
              self.dataHandler.processTodayStepCount(steps, endDate: endDate)
            }
            dispatchGroup.leave()
          }
        } else {
          self.dataHandler.collectLatestData(for: type, lookbackMinutes: 1440) { sample in
            if let sample = sample {
              self.dataHandler.processNewData(for: type, with: sample)
            }
            dispatchGroup.leave()
          }
        }
      }

      dispatchGroup.notify(queue: DispatchQueue.main) {
        self.startLiveStepTracking()
        completion(nil)
      }
    }
  }
  
  func disableObservers() {
    observersEnabled = false
    stopLiveStepTracking()
    healthKitStore.disableAllBackgroundDelivery { success, error in
      print("disableAllBackgroundDelivery callback: success=\(success), error=\(String(describing: error))")
    }
  }
}
