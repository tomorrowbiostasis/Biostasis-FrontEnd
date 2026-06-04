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
  func collectLatestData(for type: HKSampleType, lookbackMinutes: Int, completionHandler: @escaping (HKQuantitySample?) -> Void)
  func collectTodayStepCount(completionHandler: @escaping (Int?, Date?) -> Void)
  func processNewData(for type:HKSampleType,with sample: HKQuantitySample)
  func processTodayStepCount(_ steps: Int, endDate: Date)
}

protocol IHandleHealthMetrics {
  func updateHealthMetrics(for type: HKSampleType, with sample: HKQuantitySample)
  func updateTodaySteps(_ steps: Int, endDate: Date, appendToHistory: Bool)
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

  func collectLatestData(for type: HKSampleType, lookbackMinutes: Int, completionHandler: @escaping (HKQuantitySample?) -> Void) {
    let endDate = Date()
    let startDate = Calendar.current.date(byAdding: .minute, value: -lookbackMinutes, to: endDate)
    let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictEndDate)
    let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
    let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: 1, sortDescriptors: [sortDescriptor]) { _, samples, error in
      guard let sample = samples?.first as? HKQuantitySample, error == nil else {
        completionHandler(nil)
        return
      }

      completionHandler(sample)
    }

    healthKitStore.execute(query)
  }

  func collectTodayStepCount(completionHandler: @escaping (Int?, Date?) -> Void) {
    guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
      completionHandler(nil, nil)
      return
    }

    let endDate = Date()
    let startDate = Calendar.current.startOfDay(for: endDate)
    let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
    let query = HKStatisticsQuery(
      quantityType: stepType,
      quantitySamplePredicate: predicate,
      options: .cumulativeSum
    ) { _, result, error in
      guard error == nil, let quantity = result?.sumQuantity() else {
        completionHandler(nil, nil)
        return
      }

      completionHandler(Int(quantity.doubleValue(for: HKUnit.count())), endDate)
    }

    healthKitStore.execute(query)
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

  func processTodayStepCount(_ steps: Int, endDate: Date) {
    let timestamp = Date().timeIntervalSince1970
    UserDefaults.standard.set(timestamp, forKey: HealthKitDefaultsKey.lastHealthKitUpdate)
    updateTodaySteps(steps, endDate: endDate, appendToHistory: true)
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

  func updateTodaySteps(_ steps: Int, endDate: Date, appendToHistory: Bool = true) {
    var healthMetrics: HealthMetrics = loadHealthMetricsFromStorage()
    healthMetrics.steps = steps
    healthMetrics.stepsEndDate = endDate
    if appendToHistory {
      saveHealthMetricsToStorage(healthMetrics)
    } else {
      saveLatestHealthMetricsToStorage(healthMetrics)
    }

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
    saveLatestHealthMetricsToStorage(healthMetrics)

    // Append to @AllBioData
    let defaults = UserDefaults.standard
    let encoder = JSONEncoder()
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

  private func saveLatestHealthMetricsToStorage(_ healthMetrics: HealthMetrics) {
    let defaults = UserDefaults.standard
    let encoder = JSONEncoder()

    do {
        let encodedSingle = try encoder.encode(healthMetrics)
        defaults.set(encodedSingle, forKey: "HealthMetrics")
    } catch {
        print("❌ Error saving single healthMetrics:", error)
    }
  }
}
