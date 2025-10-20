// import Foundation
// import HealthKit

// enum HealthKitManagerError: Error {
//   case Deallocated
//   case HealthKitNotAvilable
// }

// protocol IManageHealthkit {
//   /// Asks for Authorization and starts observer process
//   func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?)->())
//   /// Starts observer process
//   func startObservers(completion: @escaping (_ error: Error?)->())
//   /// Disables process
//   func disableObservers()
// }

// final class HealthKitManager {
  
//   //Private
//   private let healthKitStore: HKHealthStore = HKHealthStore()
//   private let identifiers: Set<HKSampleType> = Set<HKSampleType>([HKObjectType.quantityType(forIdentifier: .heartRate), HKObjectType.quantityType(forIdentifier: .restingHeartRate), HKObjectType.quantityType(forIdentifier: .stepCount)].compactMap({$0}))
//   private lazy var dataHandler: IHandleHealthKitData = {
//     return HealthKitDataHandler(healthKitStore: healthKitStore, delegate: dataHandlerDelegate)
//   }()
//   private unowned var dataHandlerDelegate: IDelegateHealthKitDataHandler
//   private var queries: [HKSampleType: HKObserverQuery] = [:]
//   private var observersEnabled: Bool {
//     get {
//       return UserDefaults.standard.bool(forKey: "HealthKitManagerEnabled")
//     }
//     set {
//       UserDefaults.standard.set(newValue, forKey: "HealthKitManagerEnabled")
//     }
//   }
  
//   init(dataHandlerDelegate: IDelegateHealthKitDataHandler) {
//     self.dataHandlerDelegate = dataHandlerDelegate
//   }
// }

// extension HealthKitManager: IManageHealthkit {
//   func startObservers(completion: @escaping (Error?) -> ()) {
//     print("Starting observers")
//     let dispatchGroup = DispatchGroup()
//     var backgroundDeliveryError: Error?
    
//     observersEnabled = true
//     for type in identifiers {
//       dispatchGroup.enter()
      
//       if let query = queries[type] {
//         print("Stopping existing query for \(type.identifier)")
//         healthKitStore.stop(query)
//       }
      
//       let observerQuery = HKObserverQuery(sampleType: type, predicate: nil)
//       { [weak self] query, completionHandler, error in
//         guard let self = self else {
//           print("⚠️ HealthKitManager deallocated before handling \(type.identifier)")
//           completionHandler()
//           return
//         }
        
//         guard self.observersEnabled, error == nil else {
//           self.healthKitStore.stop(query)
//           completionHandler()
//           return
//         }
//         // Collect the new data observed
//         dataHandler.collectNewData(for: type) { sample in
//           print("data received observers: \(sample)")
//           if let sample = sample {
//             // Process the collected new data
//             self.dataHandler.processNewData(for: type, with: sample)
//           }
//           completionHandler()
//         }
//       }
//       queries[type] = observerQuery
      
//       healthKitStore.enableBackgroundDelivery(for: type,
//                                               frequency: .immediate,
//                                               withCompletion: {_, error in
//         if let error = error {
//           backgroundDeliveryError = error
//         }
//         dispatchGroup.leave()
//       })
//       healthKitStore.execute(observerQuery)
//     }
    
//     dispatchGroup.notify(queue: DispatchQueue.main) {
//       completion(backgroundDeliveryError)
//     }
//   }
  
//   func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?)->()) {
//     print("THIS IS IN REQ AUTH AND START OBSERVERS")
//     guard HKHealthStore.isHealthDataAvailable() else {
//       completion(HealthKitManagerError.HealthKitNotAvilable)
//       return
//     }
//     healthKitStore.requestAuthorization(toShare: nil,
//                                         read: identifiers)
//     { [weak self] (success, error) in
//       guard success, let self = self else {
//         completion(error)
//         return
//       }
//       self.startObservers(completion: completion)
//     }
//   }
  
//   func disableObservers() {
//     observersEnabled = false
//     healthKitStore.disableAllBackgroundDelivery { _, _ in }
//   }
// }

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
    print("🔹 HealthKitManager.dataHandler initialized")
    return HealthKitDataHandler(healthKitStore: healthKitStore, delegate: dataHandlerDelegate)
  }()
  
  private unowned var dataHandlerDelegate: IDelegateHealthKitDataHandler
  private var queries: [HKSampleType: HKObserverQuery] = [:]
  private var observersEnabled: Bool {
    get {
      let enabled = UserDefaults.standard.bool(forKey: "HealthKitManagerEnabled")
      print("🔹 observersEnabled.get -> \(enabled)")
      return enabled
    }
    set {
      print("🔹 observersEnabled.set -> \(newValue)")
      UserDefaults.standard.set(newValue, forKey: "HealthKitManagerEnabled")
    }
  }
  
  init(dataHandlerDelegate: IDelegateHealthKitDataHandler) {
    print("🟢 HealthKitManager.init")
    self.dataHandlerDelegate = dataHandlerDelegate
  }

  private func logToFile(_ message: String) {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS"
    let timestamp = formatter.string(from: Date())
    let logMessage = "[\(timestamp)] \(message)\n"
    
    // Print to console too
    print(logMessage.trimmingCharacters(in: .newlines))
    
    // Write to file
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
    // print("🟢 startObservers() called")
    logToFile("🟢 startObservers() called")
    let dispatchGroup = DispatchGroup()
    var backgroundDeliveryError: Error?
    
    observersEnabled = true
    for type in identifiers {
      // print("🔸 Setting up observer for \(type.identifier)")
      logToFile("🔸 Setting up observer for \(type.identifier)")
      dispatchGroup.enter()
      
      if let query = queries[type] {
        logToFile("⚙️ Stopping existing query for \(type.identifier)")
        // print("⚙️ Stopping existing query for \(type.identifier)")
        healthKitStore.stop(query)
      }
      
      let observerQuery = HKObserverQuery(sampleType: type, predicate: nil) { [weak self] query, completionHandler, error in
        print("🟠 Observer triggered for \(type.identifier)")
        
        guard let self = self else {
          print("⚠️ HealthKitManager deallocated before handling \(type.identifier)")
          completionHandler()
          return
        }
        
        guard self.observersEnabled, error == nil else {
          print("❌ Observer disabled or error for \(type.identifier): \(String(describing: error))")
          self.healthKitStore.stop(query)
          completionHandler()
          return
        }
        
        print("📥 Collecting new data for \(type.identifier)")
        self.dataHandler.collectNewData(for: type) { sample in
          print("📊 Data received for \(type.identifier): \(String(describing: sample))")
          if let sample = sample {
            print("⚙️ Processing new data for \(type.identifier)")
            self.dataHandler.processNewData(for: type, with: sample)
          }
          print("✅ Completed observer handler for \(type.identifier)")
          completionHandler()
        }
      }
      
      queries[type] = observerQuery
      print("🚀 Executing observer query for \(type.identifier)")
      
      healthKitStore.enableBackgroundDelivery(for: type, frequency: .immediate) { _, error in
        print("🔧 enableBackgroundDelivery callback for \(type.identifier): \(String(describing: error))")
        if let error = error {
          backgroundDeliveryError = error
        }
        dispatchGroup.leave()
      }
      
      healthKitStore.execute(observerQuery)
    }
    
    dispatchGroup.notify(queue: DispatchQueue.main) {
      print("🏁 All observers started, notifying completion")
      completion(backgroundDeliveryError)
    }
  }
  
  func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?) -> ()) {
    logToFile("🟢 requestAuthorizationAndStartObservers() called")
    
    guard HKHealthStore.isHealthDataAvailable() else {
      print("❌ HealthKit not available")
      completion(HealthKitManagerError.HealthKitNotAvilable)
      return
    }
    
    print("🔐 Requesting HealthKit authorization")
    healthKitStore.requestAuthorization(toShare: nil, read: identifiers) { [weak self] success, error in
      print("🔓 Authorization callback: success=\(success), error=\(String(describing: error))")
      
      guard success, let self = self else {
        print("❌ Authorization failed")
        completion(error)
        return
      }
      
      print("✅ Authorization succeeded, starting observers")
      self.startObservers(completion: completion)
    }
  }
  
  func disableObservers() {
    print("🔴 disableObservers() called")
    observersEnabled = false
    healthKitStore.disableAllBackgroundDelivery { success, error in
      print("🛑 disableAllBackgroundDelivery callback: success=\(success), error=\(String(describing: error))")
    }
  }
}
