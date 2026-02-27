//
//  NativeManagerEmitter.swift
//  Biostasis
//
//  Created by Metodija Antuleski on 21.7.25.
//

import Foundation
import React

@objc(NativeManagerEmitter)
class NativeManagerEmitter: RCTEventEmitter {
  static var shared: NativeManagerEmitter?

  override init() {
    super.init()
    NativeManagerEmitter.shared = self
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["HealthDataEvent"]
  }

  @objc
  func sendHealthDataToJS(data: [String: Any]) {
    sendEvent(withName: "HealthDataEvent", body: data)
  }
}
