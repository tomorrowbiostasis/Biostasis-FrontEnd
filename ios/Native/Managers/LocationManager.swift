import Foundation
import CoreLocation

protocol IDelegateLocationDataHandler: AnyObject
{
  func aquiredNewLocation(locationUrl: String)
  func locationError(error: String)
}

protocol IManageLocation {
  func startCollectingLocation()
  func stopCollectingLocation()
}

final class LocationManager: NSObject {
  private var locationManager: CLLocationManager?
  private unowned var delegate: IDelegateLocationDataHandler
  
  init(delegate: IDelegateLocationDataHandler) {
    self.delegate = delegate
  }
}

extension LocationManager: IManageLocation {
  func startCollectingLocation() {
    DispatchQueue.main.async {
      let locationManager = CLLocationManager()
      locationManager.delegate = self
      locationManager.requestAlwaysAuthorization()
      locationManager.startMonitoringSignificantLocationChanges()
      self.locationManager = locationManager
    }
  }
  
  func stopCollectingLocation() {
    DispatchQueue.main.async {
      self.locationManager?.stopMonitoringSignificantLocationChanges()
    }
  }
  
}

extension LocationManager: CLLocationManagerDelegate {
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    guard let coords = locations.last?.coordinate else { return }
    let googleMapCoordinates = "https://www.google.com/maps/search/?api=1&query=\(coords.latitude)%2C\(coords.longitude)"
    self.delegate.aquiredNewLocation(locationUrl: googleMapCoordinates)
  }
  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    self.delegate.locationError(error: error.localizedDescription)
  }
}

fileprivate struct storableCoordinates: Codable {
  public var latitude: CLLocationDegrees
  public var longitude: CLLocationDegrees
  
  init(coordinate: CLLocationCoordinate2D) {
    self.latitude = coordinate.latitude
    self.longitude = coordinate.longitude
  }
}

fileprivate extension CLLocationCoordinate2D {
  init(coordinate: storableCoordinates) {
    self = CLLocationCoordinate2D(latitude: coordinate.latitude, longitude: coordinate.longitude)
  }
}
