import Foundation
import HealthKit

protocol IHandleBackgroundHealthCheck {
    func handleSilentPushNotification(completion: @escaping (Bool) -> Void)
}

final class BackgroundHealthChecker {
    
    private let healthKitStore: HKHealthStore
    private let storageManager: IManagePersistentStorage
    private let timeManager: TimeManager
    private let networkingManager: IManageNetwork
    
    // Health data types to check
    private let identifiers: Set<HKSampleType> = Set<HKSampleType>([
        HKObjectType.quantityType(forIdentifier: .heartRate),
        HKObjectType.quantityType(forIdentifier: .restingHeartRate),
        HKObjectType.quantityType(forIdentifier: .stepCount)
    ].compactMap({$0}))
    
    init(healthKitStore: HKHealthStore,
         storageManager: IManagePersistentStorage,
         timeManager: TimeManager,
         networkingManager: IManageNetwork) {
        self.healthKitStore = healthKitStore
        self.storageManager = storageManager
        self.timeManager = timeManager
        self.networkingManager = networkingManager
    }
}

extension BackgroundHealthChecker: IHandleBackgroundHealthCheck {
    
    func handleSilentPushNotification(completion: @escaping (Bool) -> Void) {
        // Get user settings
        storageManager.getUser { [weak self] user in
            guard let self = self,
                  let user = user,
                  let positiveInfoPeriod = user.positiveInfoPeriod else {
                completion(false)
                return
            }
            
            // Check if currently in paused period
            self.storageManager.getEmergencySettings { [weak self] settings in
                guard let self = self,
                    let emergencySettings = settings else {
                    completion(false)
                    return
                }
                
                let isPaused = self.timeManager.isPausedTime(
                    pausedDate: emergencySettings.pausedDate,
                    specificPausedTimes: emergencySettings.specificPausedTimes ?? []
                )
                
                if isPaused {
                    completion(false)
                    return
                }
                
                // Calculate how many positive updates should have been sent in the last hour
                let expectedUpdatesRaw = self.calculateExpectedUpdates(
                    positiveInfoPeriod: positiveInfoPeriod,
                    hoursElapsed: 1
                )

                // Always attempt at least one check on silent push
                let expectedUpdates = max(1, expectedUpdatesRaw)
                self.checkAndSendPositiveUpdates(
                    positiveInfoPeriod: positiveInfoPeriod,
                    expectedUpdates: expectedUpdates,
                    completion: completion
                )
            }
        }
    }
    
    private func calculateExpectedUpdates(positiveInfoPeriod: Int, hoursElapsed: Int) -> Int {
        let minutesElapsed = hoursElapsed * 60
        return minutesElapsed / positiveInfoPeriod
    }
    
    private func checkAndSendPositiveUpdates(positiveInfoPeriod: Int,
                                           expectedUpdates: Int,
                                           completion: @escaping (Bool) -> Void) {
        
        let dispatchGroup = DispatchGroup()
        var hasRecentData = false
        
        // Check each health data type
        for identifier in identifiers {
            dispatchGroup.enter()
            
            checkHealthDataForType(
                identifier: identifier,
                positiveInfoPeriod: positiveInfoPeriod
            ) { hasData in
                if hasData {
                    hasRecentData = true
                }
                dispatchGroup.leave()
            }
        }
        
        dispatchGroup.notify(queue: .main) {
            if hasRecentData {
                self.sendPositiveUpdateToServer(positiveInfoPeriod: positiveInfoPeriod) { success in
                    completion(success)
                }
            } else {
                completion(false)
            }
        }
    }
    
    private func checkHealthDataForType(identifier: HKSampleType,
                                      positiveInfoPeriod: Int,
                                      completion: @escaping (Bool) -> Void) {
        
        let endDate = Date()
        let startDate = Calendar.current.date(byAdding: .minute, value: -positiveInfoPeriod, to: endDate)
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictEndDate)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        
        let query = HKSampleQuery(
            sampleType: identifier,
            predicate: predicate,
            limit: 1,
            sortDescriptors: [sortDescriptor]
        ) { _, samples, error in
            if let error = error {
                completion(false)
                return
            }
            
            let hasData = samples?.first != nil
            completion(hasData)
        }
        
        healthKitStore.execute(query)
    }
    
    private func sendPositiveUpdateToServer(positiveInfoPeriod: Int,
                                          completion: @escaping (Bool) -> Void) {
        
        networkingManager.sendPositiveUpdateToServer(
            nextCheckInMinutes: positiveInfoPeriod
        ) { result in
            switch result {
            case .success(let response):
                completion(true)
            case .failure(let error):
                completion(false)
            }
        }
    }
}
