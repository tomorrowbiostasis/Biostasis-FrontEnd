import Foundation
import HealthKit
import UIKit

///Informs about proper / unproper values received from healthkit.
///Call completion handler when all background tasks will end.

private enum HealthKitDefaultsKey {
  static let lastHealthKitUpdate = "LastHealthKitUpdateTimestamp"
}

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
    // let timestamp = sample.endDate.timeIntervalSince1970
    // now
    let timestamp = Date().timeIntervalSince1970
    UserDefaults.standard.set(timestamp, forKey: HealthKitDefaultsKey.lastHealthKitUpdate)
    print("Saved HealthKit timestamp:", timestamp)

    let savedTimestamp = UserDefaults.standard.double(forKey: HealthKitDefaultsKey.lastHealthKitUpdate)
    if savedTimestamp > 0 {
        let date = Date(timeIntervalSince1970: savedTimestamp)
        print("Last HealthKit update:", date)
    } else {
        print("No HealthKit update timestamp found")
    }

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
   DispatchQueue.main.async {
        let currentData = self.healthMetricsToDict(healthMetrics)
        NativeManagerEmitter.shared?.sendHealthDataToJS(data: currentData)


        let allMetrics = self.loadAllHealthMetrics()
    let allDataArray = allMetrics.map { self.healthMetricsToDict($0) }
    NativeManagerEmitter.shared?.sendHealthDataToJS(data: ["allHealthData": allDataArray])
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

  func loadAllHealthMetrics() -> [HealthMetrics] {
    let defaults = UserDefaults.standard
    guard let data = defaults.data(forKey: "@AllBioData") else {
        return []
    }
    do {
        return try JSONDecoder().decode([HealthMetrics].self, from: data)
    } catch {
        print("❌ Error decoding all HealthMetrics:", error)
        return []
    }
}


  func healthMetricsToDict(_ metric: HealthMetrics) -> [String: Any] {
    return [
        "heartRate": metric.heartRate ?? 0,
        "restingHeartRate": metric.restingHeartRate ?? 0,
        "steps": metric.steps ?? 0,
        "heartRateEndDate": metric.heartRateEndDate?.timeIntervalSince1970 ?? NSNull(),
        "restingHeartRateEndDate": metric.restingHeartRateEndDate?.timeIntervalSince1970 ?? NSNull(),
        "stepsEndDate": metric.stepsEndDate?.timeIntervalSince1970 ?? NSNull()
    ]
  }

  func saveHealthMetricsToStorage(_ healthMetrics: HealthMetrics) {
    let defaults = UserDefaults.standard
    let encoder = JSONEncoder()
    
    // 1. Save the latest single record
    do {
        let encodedSingle = try encoder.encode(healthMetrics)
        defaults.set(encodedSingle, forKey: "HealthMetrics")
    } catch {
        print("❌ Error saving single healthMetrics:", error)
    }
    
    // 2. Append to @AllBioData
    let allDataKey = "@AllBioData"
    var allRecords: [HealthMetrics] = []

    if let existingData = defaults.data(forKey: allDataKey) {
        do {
            allRecords = try JSONDecoder().decode([HealthMetrics].self, from: existingData)
        } catch {
            print("Failed to decode existing array:", error)
        }
    }

    allRecords.append(healthMetrics)

    do {
        let encodedArray = try encoder.encode(allRecords)
        defaults.set(encodedArray, forKey: allDataKey)
    } catch {
        print("Error saving array:", error)
    }
}
}
