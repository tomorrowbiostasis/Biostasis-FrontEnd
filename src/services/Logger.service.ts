import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import Share from 'react-native-share';
import {v4 as uuidv4} from 'uuid';

enum logType {
  log = 'LOG',
  warn = 'WARN',
  error = 'ERROR',
}

export let oldLog = console.log,
  oldWarn = console.warn,
  oldError = console.error;

const makeString = (item: any) => {
  if (typeof item === 'string') {
    return item;
  }
  if (typeof item === 'number') {
    return `${item}`;
  }
  return JSON.stringify(item);
};

const saveLog = async (type: logType, data: any) => {
  const key = `${AsyncStorageEnum.LoggerData}#${uuidv4()}`;
  const value = `> ${+new Date()} ${type} ${data.map(makeString).join(' ')}`;
  await AsyncStorageService.setItem(key, value, true);
};

function logger(type: logType, ...args: any) {
  if (__DEV__) {
    switch (type) {
      case logType.warn:
        oldWarn(...args);
        break;
      case logType.error:
        oldError(...args);
        break;
      default:
        oldLog(...args);
    }
  }
  saveLog(type, args).catch(e =>
    oldLog('Logger: could not save logger data', e.message),
  );
}

export const startLogger = () => {
  console.log = (...args: any) => logger(logType.log, ...args);
  console.warn = (...args: any) => logger(logType.warn, ...args);
  console.error = (...args: any) => logger(logType.error, ...args);
  console.log('Logger: starting new logger session');
};

export const shareLog = async () => {
  const allKeys = await AsyncStorageService.getAllKeys();
  const loggerKeys = allKeys.filter(i =>
    i.includes(AsyncStorageEnum.LoggerData),
  );
  const loggerDataWithKeys = await AsyncStorageService.multiGet(loggerKeys);
  const loggerData = loggerDataWithKeys.map(item => item[1]).sort();
  const loggerOutput = loggerData.join('\n\n');

  Share.open({message: loggerOutput})
    .then(async status => {
      await AsyncStorageService.multiRemove(loggerKeys);
      console.log('Logger: logger data shared successfully', status);
    })
    .catch(e => console.log('Logger: data not shared', e));
};
