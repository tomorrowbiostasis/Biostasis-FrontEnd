import Foundation

protocol IManageRecommendationSystem {
  func startRecomendationSystem()
  func stopRecommendtionSystem()
}

protocol IManageUserDefaults {
  func getStoredData() -> HealthMetrics?
  func getStartDate() -> TimeInterval
  func getLastUpdatedDate() -> TimeInterval
  func getTimeDifference(date: TimeInterval?) -> TimeInterval
  func getLongestPeriod() -> TimeInterval
  func setStoredData(data: HealthMetrics)
  func setStartDate()
  func setLastUpdatedDate()
  func setLongestPeriod(data: TimeInterval)
}

protocol IManageHealthMetrics {
  func healthMetricsToJSONString(healthMetrics: HealthMetrics) -> String?
  func healthMetricsFromJSONString(jsonString: String) -> HealthMetrics?
}

protocol IManageRecommendationServices {
  func isSameData(preData: HealthMetrics?, newData: HealthMetrics) -> Bool
  func findNearestGreaterValue(longestPeriod: Int) -> Int
  func dateToString(date: Date) -> String
  func recommendationSystem(data: HealthMetrics)
  func stringToDate(date: String) -> Date?
}

class RecommendationService: IManageRecommendationSystem {
  func startRecomendationSystem() {
    // Check if the starting date key doesn't exist in UserDefaults
    if UserDefaults.standard.string(forKey: "@StartingDate") == nil {
      setStartDate()
    }
  }
  
  func stopRecommendtionSystem() {
    UserDefaults.standard.removeObject(forKey: "@StartingDate")
    UserDefaults.standard.removeObject(forKey: "@BioData")
    UserDefaults.standard.removeObject(forKey: "@LastUpdatedDate")
    UserDefaults.standard.removeObject(forKey: "@LongestPeriod")
  }
}

extension RecommendationService : IManageRecommendationServices {
  func isSameData(preData: HealthMetrics?, newData: HealthMetrics) -> Bool {
    guard let preData = preData else {
      return false
    }
    return preData.heartRate == newData.heartRate &&
    preData.restingHeartRate == newData.restingHeartRate &&
    preData.restingHeartRate == newData.restingHeartRate
  }
  
  func getTimeDifference(date: TimeInterval?) -> TimeInterval {
    let currentTime = Date().timeIntervalSince1970
    if let lastUpdatedDate = date {
      return currentTime - lastUpdatedDate
    } else {
      return currentTime
    }
  }
  
  func findNearestGreaterValue(longestPeriod: Int) -> Int {
    // production time intervals [unit: hours]
    let intervalsConfig = [3, 6, 9, 12, 18, 24, 36, 48]
    var nearestValue = intervalsConfig.last ?? 0
    for value in intervalsConfig {
      if value >= longestPeriod {
        nearestValue = value
        break
      }
    }
    return nearestValue
  }
  
  func recommendationSystem(data: HealthMetrics) {
    do {
      let storedData = getStoredData()
      let startingDate = getStartDate()
      let lastUpdatedDate = getLastUpdatedDate()
      var longestPeriod = getLongestPeriod()

      if !isSameData(preData: storedData, newData: data) {
        let timeDifferenceMinutes = (getTimeDifference(date: lastUpdatedDate)) / 60
        if timeDifferenceMinutes > longestPeriod {
          longestPeriod = timeDifferenceMinutes
          setLongestPeriod(data: longestPeriod)
          print("Longest period updated", longestPeriod)
        }
        setLastUpdatedDate()
        setStoredData(data: data)
        
        print("New Bio Data found")
      }
      
      let timeDifferenceDays = getTimeDifference(date: startingDate) / (60 * 60 * 24)
      if timeDifferenceDays > 7 {
        let recommendedPeriod = findNearestGreaterValue(longestPeriod: Int(longestPeriod / 60))
        UserDefaults.standard.set("\(recommendedPeriod)", forKey: "@RecommendedPeriod")
        stopRecommendtionSystem()
        print("Recommended Period updated", recommendedPeriod)
      }
    }
  }
  
  func dateToString (date: Date) -> String {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
    return dateFormatter.string(from: date)
  }
  
  func stringToDate (date: String) -> Date? {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
    return dateFormatter.date(from: date) ?? nil
  }
}

extension RecommendationService: IManageUserDefaults {
  func setStartDate () {
    let now = Date()
    UserDefaults.standard.set("\(dateToString(date: now))", forKey: "@StartingDate")
  }
  
  func getStartDate() -> TimeInterval {
    if let startingDateString = UserDefaults.standard.string(forKey: "@StartingDate") {
      if let startingDate = stringToDate(date: startingDateString) {
        return startingDate.timeIntervalSince1970
      }
    }
    setStartDate()
    return getStartDate()
  }
  
  func setStoredData(data: HealthMetrics) {
    UserDefaults.standard.set("\(healthMetricsToJSONString(healthMetrics: data) ?? "")", forKey: "@BioData")
  }
  
  func getStoredData() -> HealthMetrics? {
    if let storedDataString = UserDefaults.standard.string(forKey: "@BioData") {
      return healthMetricsFromJSONString(jsonString: storedDataString)
    } else {
      return nil
    }
  }
  
  func setLastUpdatedDate() {
    let now = Date()
    UserDefaults.standard.set("\(dateToString(date: now))", forKey: "@LastUpdatedDate")
  }
  
  func getLastUpdatedDate() -> TimeInterval {
    if let lastDateString = UserDefaults.standard.string(forKey: "@LastUpdatedDate") {
      if let lastUpdateDate = stringToDate(date: lastDateString) {
        return lastUpdateDate.timeIntervalSince1970
      }
    }
    setLastUpdatedDate()
    return getLastUpdatedDate()
  }
  
  func setLongestPeriod(data: TimeInterval) {
    UserDefaults.standard.set("\(data)", forKey: "@LongestPeriod")
  }
  
  func getLongestPeriod() -> TimeInterval {
    if let longestPeriodString = UserDefaults.standard.string(forKey: "@LongestPeriod"),
       let longestPeriod = TimeInterval(longestPeriodString) {
      return longestPeriod
    } else {
      UserDefaults.standard.set("0", forKey: "@LongestPeriod")
      return 0
    }
  }
}

extension RecommendationService: IManageHealthMetrics {
  func healthMetricsToJSONString(healthMetrics: HealthMetrics) -> String? {
    let encoder = JSONEncoder()
    encoder.dateEncodingStrategy = .iso8601 // Use ISO 8601 date format
    
    do {
      let jsonData = try encoder.encode(healthMetrics)
      if let jsonString = String(data: jsonData, encoding: .utf8) {
        return jsonString
      } else {
        return nil
      }
    } catch {
      print("Error encoding HealthMetrics: \(error)")
      return nil
    }
  }
  
  func healthMetricsFromJSONString(jsonString: String) -> HealthMetrics? {
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601 // Use ISO 8601 date format
    
    if let jsonData = jsonString.data(using: .utf8) {
      do {
        let healthMetrics = try decoder.decode(HealthMetrics.self, from: jsonData)
        return healthMetrics
      } catch {
        print("Error decoding HealthMetrics: \(error)")
        return nil
      }
    } else {
      return nil
    }
  }
}
