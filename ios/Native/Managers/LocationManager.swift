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
      DispatchQueue.global().async  {
          let locationManager = CLLocationManager()
          locationManager.delegate = self
          
          // Check the authorization status on a background thread
          let authorizationStatus = CLLocationManager.authorizationStatus()
          
          DispatchQueue.main.async {
              if authorizationStatus == .authorizedAlways || authorizationStatus == .authorizedWhenInUse {
                  // If authorization is already granted, start monitoring
                  locationManager.startMonitoringSignificantLocationChanges()
              } else {
                  // If not authorized, request authorization on the main thread
                  locationManager.requestAlwaysAuthorization()
              }
          }
          
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
