import Foundation
import Intents

@objc(DeviceSignalsManager)
class DeviceSignalsManager: NSObject {

  @objc func isFocusActive(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    if #available(iOS 15.0, *) {
      let center = INFocusStatusCenter.default
      let isFocused = center.focusStatus.isFocused ?? false
      resolve(isFocused)
    } else {
      resolve(false)
    }
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
