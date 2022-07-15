//
//  EmergencySettings.swift
//  Biostasis
//
//  Created by Paweł Kłosowicz on 15/10/2021.
//

import Foundation

struct PausedDate: Codable {
  var id: Int
  var timestamp: Int
}

struct SpecificPausedTime: Codable {
  var id: Int
  var startTime: Int
  var endTime: Int
  var isActive: Bool
  var startDay: [Int]
  var endDay: [Int]
}

struct EmergencySettingsModel: Codable {
  var pausedDate: PausedDate?
  var specificPausedTimes: [SpecificPausedTime]?
  
  enum CodingKeys: String, CodingKey {
      case pausedDate
      case specificPausedTimes
  }

  init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    
    if let stringPausedDate = try? container.decode(String.self, forKey: .pausedDate),
       let data = stringPausedDate.data(using: .utf8),
       let parsed = try? JSONDecoder().decode(PausedDate.self, from: data) {
      pausedDate = parsed
    } else {
      pausedDate = nil
    }
    
    if let stringSpecificPausedTimes = try? container.decode(String.self, forKey: .specificPausedTimes),
       let data = stringSpecificPausedTimes.data(using: .utf8),
       let parsed = try? JSONDecoder().decode([SpecificPausedTime].self, from: data) {
      specificPausedTimes = parsed
    } else {
      specificPausedTimes = nil
    }
  }
}
