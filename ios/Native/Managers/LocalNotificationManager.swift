import Foundation
import UIKit

protocol IManageLocalNotification {
  func requestAuthorization(completion: ((_ authorized: Bool, _ error: Error?)->())?)
  func scheduleSingle(notification: LocalNotification, date: Date)
  func clearAllAppNotifications()
}

public enum LocalNotification {
  case EmergencyOffline
  case Custom(title: String, subtitle: String)
  
  var type: String {
    switch self {
    case .EmergencyOffline:
      return "EMERGENCY_OFFLINE"
    case .Custom:
      return "CUSTOM"
    }
  }
}

final class LocalNotificationManager {}

extension LocalNotificationManager: IManageLocalNotification {
  func checkForAuthorization(completion: @escaping (Bool) -> ()) {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      switch settings.authorizationStatus {
      case .notDetermined, .denied, .ephemeral:
        completion(false)
      case .authorized, .provisional:
        completion(true)
      @unknown default:
        completion(false)
      }
    }
  }
  
  func requestAuthorization(completion: ((Bool, Error?) -> ())?) {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert,
                                                                      .sound]) { authorized, error in
                                                                        completion?(authorized, error)
                                                                      }
  }
  
  func scheduleSingle(notification: LocalNotification, date: Date) {
    // clear all notification
    clearAllAppNotifications()
    
    let content = UNMutableNotificationContent()
    switch notification {
    case .EmergencyOffline:
      content.title = "You are offline"
      content.subtitle = "Please connect again to make sure you are OK"
    case .Custom(let title, let subtitle):
      content.title = title
      content.subtitle = subtitle
    }
    content.userInfo = ["type": notification.type]
    content.sound = .default
    
    let components = Calendar.current.dateComponents([.second, .minute, .hour, .day, .weekday], from: date)
    let trigger = UNCalendarNotificationTrigger(dateMatching: components,
                                                repeats: false)
    let uuidString = UUID().uuidString
    let request = UNNotificationRequest(identifier: uuidString,
                                        content: content,
                                        trigger: trigger)
    UNUserNotificationCenter.current().add(request)
  }
  
  func clearAllAppNotifications() {
       UNUserNotificationCenter.current().removeAllDeliveredNotifications()
       UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
   }
}
