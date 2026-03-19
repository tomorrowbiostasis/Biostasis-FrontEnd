import Foundation
import CoreBluetooth

@objc(BLEManager)
final class BLEManager: NSObject {

  private var centralManager: CBCentralManager?
  private var isScanning = false

  override init() {
    super.init()
  }

  @objc func startScanning() {
    guard centralManager == nil else { return }
    centralManager = CBCentralManager(delegate: self, queue: nil)
  }

  @objc func stopScanning() {
    centralManager?.stopScan()
    isScanning = false
    centralManager = nil
  }
}

extension BLEManager: CBCentralManagerDelegate {
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    switch central.state {
    case .poweredOn:
      print("[BLEManager] Bluetooth powered on")
    case .poweredOff:
      print("[BLEManager] Bluetooth powered off")
    case .unauthorized:
      print("[BLEManager] Bluetooth unauthorized")
    default:
      print("[BLEManager] Bluetooth state: \(central.state.rawValue)")
    }
  }
}
