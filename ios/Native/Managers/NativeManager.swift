import Foundation
import React
import Network

protocol IManageNativeComponents {
  func updateDataCollectionStatus()
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
  
}
