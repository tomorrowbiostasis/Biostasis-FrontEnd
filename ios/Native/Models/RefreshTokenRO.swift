import Foundation

struct RefreshTokenRO: Codable {
  let id_token: String
  let access_token: String
  let expires_in: Int
}
