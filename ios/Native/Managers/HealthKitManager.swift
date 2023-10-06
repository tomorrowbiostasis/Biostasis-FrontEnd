import Foundation
import HealthKit

enum HealthKitManagerError: Error {
  case Deallocated
  case HealthKitNotAvilable
}

protocol IManageHealthkit {
  /// Asks for Authorization and starts observer process
  func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?)->())
  /// Starts observer process
  func startObservers(completion: @escaping (_ error: Error?)->())
  /// Disables process
  func disableObservers()
}

final class HealthKitManager {
  
  //Private
  private let healthKitStore: HKHealthStore = HKHealthStore()
  private let identifiers: Set<HKSampleType> = Set<HKSampleType>([HKObjectType.quantityType(forIdentifier: .heartRate), HKObjectType.quantityType(forIdentifier: .restingHeartRate), HKObjectType.quantityType(forIdentifier: .stepCount)].compactMap({$0}))
  private lazy var dataHandler: IHandleHealthKitData = {
    return HealthKitDataHandler(healthKitStore: healthKitStore, delegate: dataHandlerDelegate)
  }()
  private unowned var dataHandlerDelegate: IDelegateHealthKitDataHandler
  private var queries: [HKSampleType: HKObserverQuery] = [:]
  private var observersEnabled: Bool {
    get {
      return UserDefaults.standard.bool(forKey: "HealthKitManagerEnabled")
    }
    set {
      UserDefaults.standard.set(newValue, forKey: "HealthKitManagerEnabled")
    }
  }
  
  init(dataHandlerDelegate: IDelegateHealthKitDataHandler) {
    self.dataHandlerDelegate = dataHandlerDelegate
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
      
      let observerQuery = HKObserverQuery(sampleType: type, predicate: nil)
      { [weak self] query, completionHandler, error in
        guard let self = self else {
          completionHandler()
          return
        }
        
        guard self.observersEnabled, error == nil else {
          self.healthKitStore.stop(query)
          completionHandler()
          return
        }
        // Collect the new data observed
        dataHandler.collectNewData(for: type) { sample in
          if let sample = sample {
            // Process the collected new data
            self.dataHandler.processNewData(for: type, with: sample)
          }
          completionHandler()
        }
      }
      queries[type] = observerQuery
      
      healthKitStore.enableBackgroundDelivery(for: type,
                                              frequency: .immediate,
                                              withCompletion: {_, error in
        if let error = error {
          backgroundDeliveryError = error
        }
        dispatchGroup.leave()
      })
      healthKitStore.execute(observerQuery)
    }
    
    dispatchGroup.notify(queue: DispatchQueue.main) {
      completion(backgroundDeliveryError)
    }
  }
  
  func requestAuthorizationAndStartObservers(completion: @escaping (_ error: Error?)->()) {
    guard HKHealthStore.isHealthDataAvailable() else {
      completion(HealthKitManagerError.HealthKitNotAvilable)
      return
    }
    healthKitStore.requestAuthorization(toShare: nil,
                                        read: identifiers)
    { [weak self] (success, error) in
      guard success, let self = self else {
        completion(error)
        return
      }
      self.startObservers(completion: completion)
    }
  }
  
  func disableObservers() {
    observersEnabled = false
    healthKitStore.disableAllBackgroundDelivery { _, _ in }
  }
}
