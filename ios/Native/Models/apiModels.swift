//
//  apiModels.swift
//  Biostasis
//
//  Created by Paweł Kłosowicz on 19/10/2021.
//

import Foundation

struct PositiveUpdateApiParams: Codable {
  let minutesToNext: Int
}

struct NegativeUpdateApiParams: Codable {
  let delayed: Bool
  let messageType: String
}

struct EmergencyTestApiParams: Codable {
}

struct UserApiParams: Codable {
  let location: String
}
struct PositiveUpdatResponse: Codable {
  let success: Bool
}
