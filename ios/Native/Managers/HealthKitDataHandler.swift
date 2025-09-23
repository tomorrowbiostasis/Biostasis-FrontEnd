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
      print("⏰ collectNewData called. Using positiveInfoPeriod: \(positiveInfoPeriod) minutes")

      
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
    print("📤 healthMetrics:", healthMetrics)
    saveHealthMetricsToStorage(healthMetrics)
   DispatchQueue.main.async {
        let currentData = self.healthMetricsToDict(healthMetrics)
        NativeManagerEmitter.shared?.sendHealthDataToJS(data: currentData)
        print("📤 Sent current health data to JS:", currentData)


        let allMetrics = self.loadAllHealthMetrics()
    let allDataArray = allMetrics.map { self.healthMetricsToDict($0) }
    NativeManagerEmitter.shared?.sendHealthDataToJS(data: ["allHealthData": allDataArray])
    print("📤 Sent all health data array to JS:", allDataArray)

        // let allMetrics = self.loadAllHealthMetrics()
        // let allDataArray = allMetrics.map { self.healthMetricsToDict($0) }
        // NativeManagerEmitter.shared?.sendHealthDataToJS(data: ["allHealthData": allDataArray])
        // print("📤 Sent all health data array to JS:", allDataArray)
    }
   
  }
  
  // func saveHealthMetricsToStorage(_ healthMetrics: HealthMetrics) {
  //   do {
  //     let encoder = JSONEncoder()
  //     let encodedData = try encoder.encode(healthMetrics)
  //     let defaults = UserDefaults.standard
  //     defaults.set(encodedData, forKey: "HealthMetrics")
  //   } catch {
  //     print("Error encoding healthMetrics: \(error)")
  //   }
  // }

  
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
            print("❌ Failed to decode existing array:", error)
        }
    }

    allRecords.append(healthMetrics)

    do {
        let encodedArray = try encoder.encode(allRecords)
        defaults.set(encodedArray, forKey: allDataKey)
        print("✅ Appended to @AllBioData. Total count:", allRecords.count)
    } catch {
        print("❌ Error saving array:", error)
    }
}

// extension HealthKitDataHandler: IDelegateLocationDataHandler {
//   func aquiredNewLocation(locationUrl: String) {
//     // Parse locationUrl to CLLocationCoordinate2D and update currentLocation
//     if let coordinate = parseCoordinates(from: locationUrl) {
//       currentLocation = coordinate
//     }
//   }

//   func locationError(error: String) {
//     print("Location error: \(error)")
//   }

//   private func parseCoordinates(from url: String) -> CLLocationCoordinate2D? {
//     // Same parsing logic as before
//     guard
//       let queryPart = url.components(separatedBy: "query=").last,
//       let latLonPart = queryPart.components(separatedBy: "&").first
//     else { return nil }

//     let parts = latLonPart.components(separatedBy: "%2C")
//     if parts.count == 2,
//        let lat = Double(parts[0]),
//        let lon = Double(parts[1]) {
//       return CLLocationCoordinate2D(latitude: lat, longitude: lon)
//     }
//     return nil
//   }
// }


}
