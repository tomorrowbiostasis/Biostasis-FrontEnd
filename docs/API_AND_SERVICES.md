# API and Services

## 1. API client

- **Implementation**: Axios instance in [src/services/API.service.ts](src/services/API.service.ts).
- **Base URL**: From [Env.service](src/services/Env.service.ts) (`EnvConfig.API_URL`), typically via `react-native-config` (`.env.*`).
- **Auth**: Request interceptor attaches `Authorization: Bearer <token>` using `getToken()` from [Amazon.service](src/services/Amazon.service.ts) (Cognito).
- **Headers**:  
  - `X-Biostasis-App-Version`: from `DeviceInfo.getVersion()`.  
  - `X-Biostasis-Device-OS`: `Platform.OS` (e.g. `ios` / `android`).

All backend calls from the app go through this client (and thus use the same auth and headers).

---

## 2. Endpoints

Paths are under `/api/v1` or `/api/v2` as indicated.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/user` | Get current user (profile, settings). |
| PATCH | `/api/v2/user` | Update user; body includes `timezone` (derived from `timestampToISOWithOffset()`). |
| DELETE | `/api/v1/user` | Delete user account. |
| PATCH | `/api/v1/user/device` | Update device token (FCM); body: `{ deviceId: string }`. |
| POST | `/api/v1/auth/logout` | Log out. |
| GET | `/api/v1/contact` | List emergency contacts. |
| POST | `/api/v2/contact` | Create emergency contact. |
| PATCH | `/api/v2/contact/:id` | Update emergency contact. |
| DELETE | `/api/v1/contact/:id` | Delete emergency contact. |
| POST | `/api/v1/user/message/test` | Send test message (to emergency contacts). |
| POST | `/api/v1/message/send/emergency` | Start emergency; body: `{ delayed?: boolean, messageType?: EmergencyMessageType }`. |
| DELETE | `/api/v1/message/cancel/emergency` | Cancel active emergency. |
| POST | `/api/v1/user/positive-info` | Send positive info; body: `{ minutesToNext: number }`. |
| GET | `/api/v1/time-slot` | List time slots (pause windows). |
| POST | `/api/v1/time-slot` | Create time slot. |
| PATCH | `/api/v1/time-slot/:id` | Update time slot. |
| DELETE | `/api/v1/time-slot/:id` | Delete time slot. |
| POST | `/api/v1/user/export` | Request GDPR export; body: `{ email: string }`. |
| GET | `/api/v1/file` | List documents (by category). |
| DELETE | `/api/v1/file/:id` | Delete document. |
| POST (multipart) | `/api/v1/file` | Upload document; `react-native-fs` upload with `category` in fields. |

**Types** used in requests/responses are in [src/services/API.types.ts](src/services/API.types.ts) (e.g. `IUser`, `IApiTimeSlot`, `IApiPostTimeSlot`, `IApiPatchTimeSlot`, `IFile`, `GetDocumentsResponseType`, `EmergencyMessageType`, `UploadFileCategoryType`).

---

## 3. API types (summary)

From [src/services/API.types.ts](src/services/API.types.ts):

- **IFile**: `id`, `name`, `mimeType`, `createdAt`.
- **DocumentIdType**: `number`.
- **GetDocumentsResponseType**: array of `{ code: string, files: IFile[] }`.
- **IFileToUpload**: `file` (filename, filepath, filetype), `category: string`.
- **UploadFileCategoryType**: `'medicalDirective' | 'lastWill' | 'other'`.
- **EmergencyMessageType**: `'noConnectionToWatch' | 'heartRateInvalid'`.
- **IApiTimeSlot**: `id`, `active`, `from`, `to` (ISO), `days`, `createdAt`.
- **IApiPostTimeSlot** / **IApiPatchTimeSlot**: same as above without `id`/`createdAt`; optional `timezone`.

User and contact shapes are defined in Redux slices: [user.slice](src/redux/user/user.slice.ts) (`IUser`), [emergencyContacts.slice](src/redux/emergencyContacts/emergencyContacts.slice.ts) (`IEmergencyContact`, `IEmergencyContactResponse`).

---

## 4. Services (by module)

### 4.1 Amazon.service

- **Role**: AWS Cognito integration (auth).
- **Location**: [src/services/Amazon.service.ts](src/services/Amazon.service.ts).
- **Config**: From env (e.g. `AWS_*` via Env.service).
- **Main functions**: `getToken()`, `googleSignIn()`, `appleSignIn()`, `signOut()`, and Cognito init. OAuth redirects use `biostasis://auth/signin/`, `biostasis://auth/signout/`.  
- **Usage**: Login/register, token for API client.

---

### 4.2 Push.service

- **Role**: Firebase Cloud Messaging (FCM) and push token handling.
- **Location**: [src/services/Push.service.ts](src/services/Push.service.ts).
- **Main functions**: Permission checks, get FCM token, listen for token refresh, invoke token callback (e.g. send to backend via `API.updateUserToken`).  
- **Usage**: AuthListener and AutomatedSystemListener use it to register/update device token after login and when enabling automated emergency.

---

### 4.3 Background.service

- **Role**: Background fetch and scheduled tasks (Android).
- **Location**: [src/services/Background.service.ts](src/services/Background.service.ts).
- **Library**: `react-native-background-fetch`.
- **Task IDs** ([Background.types.ts](src/services/Background.types.ts)): `ReactNativeBackgroundFetch`, `EmergencyRetryMechanism`, `AlarmBeforeEmergency`.
- **Main functions**:
  - **startBackgroundFetch**: Configure background fetch; minimum interval 15 min (prod) / 1 min (dev); callbacks run `mainScheduledEvent`.
  - **stopBackgroundFetch**: Stop fetch and foreground notification.
  - **scheduleEvent**: Schedule a one-off task by `taskId` and delay (ms).
  - **mainScheduledEvent**: Dispatches by `taskId`: `ReactNativeBackgroundFetch` → `startBioCheck`; `EmergencyRetryMechanism` → `emergencyRetry` (retry start emergency, reschedule on timeout); `AlarmBeforeEmergency` → `soundNotification` (play alarm).
  - **updateLocation**: Get location (if permission), build Google Maps URL, call `API.updateUser` with `location` and `timezone`.
  - **emergencyRetry**: Call `API.startEmergency`; on success stop background and refresh app state; on failure schedule retry and show notification.
  - **soundNotification**: Read persisted user and play alert via SoundService.
  - **refreshAllScreens**: Reset navigation to Home (e.g. after emergency stopped).

---

### 4.4 BioCheck.service

- **Role**: Bio-based automated emergency: fetch health data, send positive info or trigger “no data” / “Are you OK?” path.
- **Location**: [src/services/BioCheck.service.ts](src/services/BioCheck.service.ts).
- **Main flow**:
  - **startBioCheck**: Load persisted user settings and time settings; if current time is not in a pause window and automated emergency is on, call **checkForBioData**; on error call **handleDisconnection** (notification + navigate to LostConnection).
  - **checkForBioData**: Get **recentBioData** from GoogleFit.service; if present, **handleBioData**; finally **updateLocation**.
  - **handleBioData**: If pulse/resting pulse/movement data is present, **handlePositiveData** (call `API.positiveInfo`, update notification; if backend indicates escalation already done, stop background). If no data, set “no data” notification, set HealthTrigger flag, and navigate to HealthConditionError when app is active/background.
  - **handlePositiveData**: Call `API.positiveInfo(positiveInfoPeriod)`; on non-success stop background; on 201 show notification with bio summary.
  - **handleDisconnection**: Show offline notification and navigate to LostConnection.

Recommendation logic is invoked from `handleBioData` ([Recommendation.service](src/services/Recommendation.service.ts)).

---

### 4.5 Notification.service

- **Role**: Local (Notifee) channels and foreground notification for “monitoring” status.
- **Location**: [src/services/Notification.service.ts](src/services/Notification.service.ts).
- **Main functions**:
  - **createNotificationChannels**: Create Notifee channel group and channels (normal, regular-check, emergency) from [notification.constants](src/constants/notification.constants.ts).
  - **updateNotification**: Build notification by type (title, body, channel) and display/update (e.g. sticky “monitoring” notification).
  - **stopForegroundFetch**: Stop foreground notification (e.g. when automated emergency is off or paused).

Also handles notification events (e.g. open app from “Are you OK?”), and can schedule/trigger background or alarm-related behavior (e.g. via Background.service). Notification types: `NotificationTypesEnum` in the constants file (e.g. emergency, bio check, no data, start automated system).

---

### 4.6 TimeSlot.service

- **Role**: Map between API time-slot format and app/local format (including timezone).
- **Location**: [src/services/TimeSlot.service/](src/services/TimeSlot.service/) — `ApiToLocal.ts`, `LocalToApi.ts`, `index.ts`.
- **Usage**: When loading time slots from API, map to local structure (e.g. for SpecificTimePausedScreen); when saving “pause from now” or specific pause times, map local data to `IApiPostTimeSlot`/`IApiPatchTimeSlot`. `timestampToISOWithOffset()` is used for timezone in user update and time-slot payloads.

---

### 4.7 Env.service

- **Role**: Expose environment/config (e.g. API URL, AWS config, env name).
- **Location**: [src/services/Env.service.ts](src/services/Env.service.ts).
- **Source**: `react-native-config` (e.g. `API_URL`, `AWS_*`, `ENVIRONMENT`, `DEV`, `PROD`).  
- **Usage**: API base URL, Cognito config, and any feature flags or env checks.

---

### 4.8 Other services (brief)

- **Time.service**: [src/services/Time.service.ts](src/services/Time.service.ts) — `getTimeSettings` (fetch time slots and map via ApiToLocal), `isPausedTime` (given date, pausedDate, specificPausedTimes) to decide if “now” is inside a pause.
- **Validation.service**: [src/services/Validation.service.ts](src/services/Validation.service.ts) — Yup schemas for forms (auth, sign-up, emergency contact, profile, etc.).
- **Location.service**: [src/services/Location.service.ts](src/services/Location.service.ts) — Get device location and build Google Maps URL; used by Background.service for `updateLocation`.
- **Toast.service**: [src/services/Toast.service.ts](src/services/Toast.service.ts) — Show toast messages (e.g. errors).
- **Alert.service (SoundService)**: Used by Background.service to play alarm sound in `soundNotification`.
