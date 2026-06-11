import Foundation
import React
import Network

protocol IManageNativeComponents {
  func updateDataCollectionStatus()
  func requestLatestHealthData()
  func queryRecentMovement(lookbackMinutes: Int, completion: @escaping (Result<[String: Any], Error>) -> Void)
}

@objc(NativeManager)
final class NativeManager: NSObject {
  private var nativeManager: NativeManagerSingleton
  
  override init() {
    nativeManager = NativeManagerSingleton.shared
    
    super.init()
  }
  
}

extension NativeManager: IManageNativeComponents {
  @objc(updateDataCollectionStatus)
  internal func updateDataCollectionStatus() {
    nativeManager.updateDataCollectionStatus()
  }

  internal func requestLatestHealthData() {
    nativeManager.requestLatestHealthData()
  }

  internal func queryRecentMovement(
    lookbackMinutes: Int,
    completion: @escaping (Result<[String: Any], Error>) -> Void
  ) {
    nativeManager.queryRecentMovement(lookbackMinutes: lookbackMinutes, completion: completion)
  }

  @objc(requestLatestHealthData:rejecter:)
  internal func requestLatestHealthData(
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    nativeManager.requestLatestHealthData { error in
      if let error = error {
        reject("healthkit_request_failed", error.localizedDescription, error)
        return
      }

      resolve(true)
    }
  }

  @objc(queryRecentMovement:resolver:rejecter:)
  internal func queryRecentMovement(
    lookbackMinutes: NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    nativeManager.queryRecentMovement(lookbackMinutes: lookbackMinutes.intValue) { result in
      switch result {
      case .success(let movement):
        resolve(movement)
      case .failure(let error):
        reject("recent_movement_failed", error.localizedDescription, error)
      }
    }
  }
  
}
