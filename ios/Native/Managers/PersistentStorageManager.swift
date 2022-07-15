import Foundation

protocol IManagePersistentStorage {
  func getRefreshToken(completion: @escaping ((_ token: String?)->()))
  func getAccessToken(completion: @escaping ((_ token: String?)->()))
  func getEmergencySettings(completion: @escaping ((_ settings: EmergencySettingsModel?)->()))
  func getUser(completion: @escaping ((_ user: UserModel?)->()))
  func storeAccessToken(token: String)
}

final class PersistentStorageManager {
  private enum PersistentDataIDs: String, CaseIterable {
    case access = "accessToken"
    case refresh = "refreshToken"
    case emergency = "automatedEmergency"
    case user = "persist:user"
  }
  
  private var asyncStorage: RNCAsyncStorage {
    return RNCAsyncStorage()
  }
  private var persistentIDs: [String:String] = [:]
  
  private func getIDs(completion: (()->())?) {
    asyncStorage.methodQueue.async { [weak self] in
      self?.asyncStorage.getAllKeys { arrayOfArrays in
        arrayOfArrays?.forEach({ arr in
          guard let arr = arr as? [String] else {
            return
          }
          for id in PersistentDataIDs.allCases {
            if let key = arr.first(where: { fullStringKey in
              fullStringKey.contains(id.rawValue)
            }) {
              self?.persistentIDs[id.rawValue] = key
            }
          }
        })
        completion?()
      }
    }
  }
  
  private func getValue(id: PersistentDataIDs,
                        completion: @escaping ((_ value: Any?)->())) {
    asyncStorage.methodQueue.async { [weak self] in
      guard let self = self else {
        completion(nil)
        return
      }
      
      let handler: ((String?)->()) = { id in
        guard let id = id else {
          completion(nil)
          return
        }
        self.asyncStorage.multiGet([id]) { arr in
          guard let containerArray = arr?.subArrayContaining(id: id),
                let item = containerArray.first(where: { ele in
                  (ele as? String) != id
                }) else {
            completion(nil)
            return
          }
          completion(item)
        }
      }
      
      if let id = self.persistentIDs[id.rawValue] {
        handler(id)
      } else {
        self.getIDs {
          handler(self.persistentIDs[id.rawValue])
        }
      }
    }
  }
}

extension PersistentStorageManager: IManagePersistentStorage {
  func getRefreshToken(completion: @escaping ((_ token: String?)->())) {
    getValue(id: .refresh) { value in
      completion(value as? String)
    }
  }
  
  func getAccessToken(completion: @escaping ((_ token: String?)->())) {
    getValue(id: .access) { value in
      completion(value as? String)
    }
  }
  
  func getEmergencySettings(completion: @escaping ((_ settings: EmergencySettingsModel?)->())) {
    getValue(id: .emergency) { value in
      guard let stringValue = value as? String,
            let data = stringValue.data(using: .utf8) else {
        completion(nil)
        return
      }
      
      let parsedSettings = try? JSONDecoder().decode(EmergencySettingsModel.self, from: data)
      completion(parsedSettings)
    }
  }
  
  func getUser(completion: @escaping ((_ user: UserModel?)->())) {
    getValue(id: .user) { value in
      guard let stringValue = value as? String,
            let data = stringValue.data(using: .utf8) else {
        completion(nil)
        return
      }
      
      let parsedContainer = try? JSONDecoder().decode(UserModelContainer.self, from: data)
      completion(parsedContainer?.user)
    }
  }
  
  func storeAccessToken(token: String) {
    asyncStorage.methodQueue.async { [weak self] in
      guard let self = self else { return }
      let handler: ((String?)->()) = { [weak self] id in
        guard let id = id else {
          return
        }
        self?.asyncStorage.multiSet([[id,token]], callback: { _ in })
      }
      
      if let id = self.persistentIDs[PersistentDataIDs.access.rawValue] {
        handler(id)
      } else {
        self.getIDs {
          handler(self.persistentIDs[PersistentDataIDs.access.rawValue])
        }
      }
    }
  }
}

private extension Array {
  func subArrayContaining(id: String) -> Array? {
    if self.isEmpty {
      return nil
    }
    if self.contains(where: { ele in
      guard let ele = ele as? String else { return false }
      return ele == id
    }) {
      return self
    } else {
      var subArray : Array?
      for ele in self {
        guard let arr = ele as? Array,
              let containerArray = arr.subArrayContaining(id: id) else { continue }
        subArray = containerArray
        break
      }
      return subArray
    }
  }
}
