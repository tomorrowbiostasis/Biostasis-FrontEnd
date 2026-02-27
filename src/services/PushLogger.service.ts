import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_LOGS_KEY = 'push_logs';

export async function logPushEvent(event: any) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, event };

  const existing = await AsyncStorage.getItem(PUSH_LOGS_KEY);
  const logs = existing ? JSON.parse(existing) : [];

  logs.unshift(entry);
  await AsyncStorage.setItem(PUSH_LOGS_KEY, JSON.stringify(logs));
}

export async function getPushLogs() {
  const existing = await AsyncStorage.getItem(PUSH_LOGS_KEY);
  return existing ? JSON.parse(existing) : [];
}

export async function clearPushLogs() {
  await AsyncStorage.removeItem(PUSH_LOGS_KEY);
}
