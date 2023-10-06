//
//  UserModel.swift
//  Biostasis
//
//  Created by Paweł Kłosowicz on 25/10/2021.
//

import Foundation

struct UserModel: Codable {
  let positiveInfoPeriod: Int?
  let locationAccess: Bool
  // Set true to either regular or triggered emergency
  let automatedEmergency: Bool
  let regularPushNotification: Bool
  let allowNotifications: Bool
  let pulseBasedTriggerIOSAppleWatchPaired: Bool
}

struct UserModelContainer: Codable {
  let user: UserModel?
  
  enum CodingKeys: String, CodingKey {
      case user
  }
  
  init(from decoder: Decoder) throws {
    guard let container = try? decoder.container(keyedBy: CodingKeys.self),
          let userString = try? container.decode(String.self, forKey: .user),
          let data = userString.data(using: .utf8) else {
            user = nil
            return
          }
    let parsedUser = try? JSONDecoder().decode(UserModel.self, from: data)
    user = parsedUser
  }
}
