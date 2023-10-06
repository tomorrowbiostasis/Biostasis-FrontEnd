import Foundation

struct HealthMetrics: Codable {
    var heartRate: Int?
    var heartRateEndDate: Date?
    var restingHeartRate: Int?
    var restingHeartRateEndDate: Date?
    var steps: Int?
    var stepsEndDate: Date?
}
