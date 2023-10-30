import Foundation

final class TimeManager {
  func isPausedTime(pausedDate: PausedDate?, specificPausedTimes: [SpecificPausedTime]) -> Bool {
    let currentTime = Date()
    let timestamp = currentTime.timeIntervalSince1970 * 1000
    if let pausedTimestamp = pausedDate?.timestamp, timestamp < pausedTimestamp {
      return true
    }
    
    let calendar = Calendar.current
    let hour = calendar.component(.hour, from: currentTime)
    
    if hour >= 22 || hour < 6 {
      return true
    }
    for pausedTime in specificPausedTimes {
      let isActive = pausedTime.isActive
      let startTime = pausedTime.startTime
      let endTime = pausedTime.endTime
      let startDay = pausedTime.startDay
      let endDay = pausedTime.endDay
      
      let startingWeekDay = startDay[0]
      let endingWeekDay = endDay[endDay.count - 1]
      let startingHour = pseudoTime(startTime)
      let endingHour = pseudoTime(endTime)
      let givenWeekDay = calendar.component(.weekday, from: currentTime) - 1
      let givenHour = pseudoTime(timestamp)
            
      if isActive {
        var dayMatch = false
        var hourMatch = false
        
        if startDay.count == 7 {
          dayMatch = true
          
          if givenHour >= startingHour && givenHour < endingHour {
            hourMatch = true
          }
        } else if startingWeekDay == endingWeekDay {
          if startingWeekDay == givenWeekDay {
            dayMatch = true
            if givenHour >= startingHour && givenHour < endingHour {
              hourMatch = true
            }
          }
        } else if startingWeekDay < endingWeekDay {
          if givenWeekDay >= startingWeekDay && givenWeekDay <= endingWeekDay {
            dayMatch = true
            
            if givenWeekDay > startingWeekDay && givenWeekDay < endingWeekDay {
              hourMatch = true
            }
            
            if givenWeekDay == startingWeekDay && givenHour >= startingHour {
              hourMatch = true
            }
            
            if givenWeekDay == endingWeekDay && givenHour < endingHour {
              hourMatch = true
            }
          }
        } else {
          if givenWeekDay >= startingWeekDay || givenWeekDay <= endingWeekDay {
            dayMatch = true
            
            if givenWeekDay > startingWeekDay || givenWeekDay < endingWeekDay {
              hourMatch = true
            }
            
            if givenWeekDay == startingWeekDay && givenHour >= startingHour {
              hourMatch = true
            }
            
            if givenWeekDay == endingWeekDay && givenHour < endingHour {
              hourMatch = true
            }
          }
        }
        if dayMatch && hourMatch {
          return true
        }
      }
    }
    
    return false
  }
  
  func pseudoTime(_ time: TimeInterval) -> Int {
      let date = Date(timeIntervalSince1970: time / 1000)
      let calendar = Calendar.current
      let hours = calendar.component(.hour, from: date)
      let minutes = calendar.component(.minute, from: date)
      return hours * 100 + minutes
  }
}
