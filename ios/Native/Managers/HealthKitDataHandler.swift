import Foundation
import HealthKit
import UIKit

///Informs about proper / unproper values received from healthkit.
///Call completion handler when all background tasks will end.
protocol IDelegateHealthKitDataHandler: AnyObject
{
  func aquiredCorrectDataset(of type: String, completionHandler: @escaping (()->Void))
}

protocol IHandleHealthKitData {
  func handleNewData(for type: HKSampleType, completionHandler: @escaping (()->Void))
}

final class HealthKitDataHandler {
  
  //Private
  private unowned let healthKitStore: HKHealthStore
  private unowned var delegate: IDelegateHealthKitDataHandler
  
  init(healthKitStore: HKHealthStore, delegate: IDelegateHealthKitDataHandler) {
    self.healthKitStore = healthKitStore
    self.delegate = delegate
  }
  
  private func getData(of type: HKSampleType,
                       completionHandler: @escaping (_ results: [HKSample])->Void) {
    let oldAnchor = anchor(for: type)
    let predicate = oldAnchor == nil ? HKAnchoredObjectQuery.predicateForSamples(withStart: Date(),
                                                                              end: nil,
                                                                              options: .strictStartDate) : nil
    
    let query = HKAnchoredObjectQuery(type: type,
                                      predicate: predicate,
                                      anchor: oldAnchor,
                                      limit: HKObjectQueryNoLimit)
    { [weak self] (query: HKAnchoredObjectQuery,
                   results: [HKSample]?,
                   _,
                   anchor: HKQueryAnchor?,
                   error: Error?) in
      self?.save(anchor: anchor, for: type)
      completionHandler(results ?? [])
    }
    healthKitStore.execute(query)
  }
  
  private func anchor(for type: HKSampleType) -> HKQueryAnchor? {
    guard let anchorData = UserDefaults.standard.object(forKey: type.identifier) as? Data else {
      return nil
    }
    return try? NSKeyedUnarchiver.unarchivedObject(ofClass: HKQueryAnchor.self, from: anchorData)
  }
  
  private func save(anchor: HKQueryAnchor?, for type: HKSampleType) {
    guard let newAnchor = anchor else { return }
    UserDefaults.standard.setValue(try? NSKeyedArchiver.archivedData(withRootObject: newAnchor, requiringSecureCoding: false), forKey: type.identifier)
  }
  
  private func handleData(of type: HKSampleType,
                          data: [HKSample],
                          completionHandler: @escaping ()->Void) {
    guard !data.isEmpty else {
      completionHandler()
      return
    }
    let typeName = type.identifier
    switch type {
    case HKObjectType.quantityType(forIdentifier: .heartRate):
      delegate.aquiredCorrectDataset(of: typeName, completionHandler: completionHandler)
    default:
      completionHandler()
    }
  }
}

extension HealthKitDataHandler: IHandleHealthKitData {
  func handleNewData(for type: HKSampleType, completionHandler: @escaping (() -> Void)) {
    let dispatchGroup = DispatchGroup()
    dispatchGroup.enter()
    
    getData(of: type) {[weak self] results in
      guard let self = self else {
        dispatchGroup.leave()
        return
      }
      self.handleData(of: type, data: results) {
        dispatchGroup.leave()
      }
    }
    
    dispatchGroup.notify(queue: DispatchQueue.main) {
      completionHandler()
    }
  }
}
