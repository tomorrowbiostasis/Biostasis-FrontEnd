import Foundation
import HealthKit
import UIKit

///Informs about proper / unproper values received from healthkit.
///Call completion handler when all background tasks will end.

protocol IDelegateHealthKitDataHandler: AnyObject
{
  func aquiredCorrectDataset(data: HealthMetrics)
}

protocol IHandleHealthKitData {
  func collectNewData(for type: HKSampleType, completionHandler: @escaping (HKQuantitySample?) -> Void)
  func processNewData(for type:HKSampleType,with sample: HKQuantitySample)
}

protocol IHandleHealthMetrics {
  func updateHealthMetrics(for type: HKSampleType, with sample: HKQuantitySample)
  func saveHealthMetricsToStorage(_ healthMetrics: HealthMetrics)
  func loadHealthMetricsFromStorage() -> HealthMetrics
//  func clearOldHealthMetricsData() -> Void
}

final class HealthKitDataHandler {
  
  //Private
  private unowned let healthKitStore: HKHealthStore
  private unowned var delegate: IDelegateHealthKitDataHandler
  private lazy var storageManager: IManagePersistentStorage = {
    return PersistentStorageManager()
  }()
  
  init(healthKitStore: HKHealthStore, delegate: IDelegateHealthKitDataHandler) {
    self.healthKitStore = healthKitStore
    self.delegate = delegate
  }
}

extension HealthKitDataHandler: IHandleHealthKitData {
  func collectNewData(for type: HKSampleType, completionHandler: @escaping (HKQuantitySample?) -> Void) {
    storageManager.getUser { [self] user in
      guard let user = user,
            let positiveInfoPeriod = user.positiveInfoPeriod else {
        completionHandler(nil)
        return
      }
      
      let endDate = Date()
      let startDate = Calendar.current.date(byAdding: .minute, value: -positiveInfoPeriod, to: endDate)
      
      let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictEndDate)
      
      let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
      let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: 10, sortDescriptors: [sortDescriptor])
      { query, samples, error in
        guard let sample = samples?.first as? HKQuantitySample, error == nil else {
          completionHandler(nil)
          return
        }
        
        completionHandler(sample)
      }
      
      healthKitStore.execute(query)
    }
  }
  
  func processNewData(for type:HKSampleType,with sample: HKQuantitySample) {
    updateHealthMetrics(for: type, with: sample)
    self.delegate.aquiredCorrectDataset(data: loadHealthMetricsFromStorage())
  }
}

extension HealthKitDataHandler: IHandleHealthMetrics {
  func updateHealthMetrics(for type: HKSampleType, with sample: HKQuantitySample) {
    var healthMetrics: HealthMetrics = loadHealthMetricsFromStorage()
    
    switch type {
    case HKQuantityType.quantityType(forIdentifier: .heartRate):
      let heartRateUnit = HKUnit.count().unitDivided(by: .minute())
      healthMetrics.heartRate = Int(sample.quantity.doubleValue(for: heartRateUnit))
      healthMetrics.heartRateEndDate = sample.endDate
    case HKQuantityType.quantityType(forIdentifier: .restingHeartRate):
      let restingHeartRateUnit = HKUnit.count().unitDivided(by: .minute())
      healthMetrics.restingHeartRate = Int(sample.quantity.doubleValue(for: restingHeartRateUnit))
      healthMetrics.restingHeartRateEndDate = sample.endDate
    case HKQuantityType.quantityType(forIdentifier: .stepCount):
      let stepsUnit = HKUnit.count()
      healthMetrics.steps = Int(sample.quantity.doubleValue(for: stepsUnit))
      healthMetrics.stepsEndDate = sample.endDate
    default:
      break
    }
    saveHealthMetricsToStorage(healthMetrics)
  }
  
  func saveHealthMetricsToStorage(_ healthMetrics: HealthMetrics) {
    do {
      let encoder = JSONEncoder()
      let encodedData = try encoder.encode(healthMetrics)
      let defaults = UserDefaults.standard
      defaults.set(encodedData, forKey: "HealthMetrics")
    } catch {
      print("Error encoding healthMetrics: \(error)")
    }
  }
  
  func loadHealthMetricsFromStorage() -> HealthMetrics {
    let defaults = UserDefaults.standard
    if let encodedData = defaults.data(forKey: "HealthMetrics") {
      do {
        let decoder = JSONDecoder()
        let healthMetrics = try decoder.decode(HealthMetrics.self, from: encodedData)
        return healthMetrics
      } catch {
        print("Error decoding healthMetrics: \(error)")
      }
    }
    return HealthMetrics()
  }
}
