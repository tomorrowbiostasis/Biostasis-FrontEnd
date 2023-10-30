import {
  BatteryOptEnabled,
  RequestDisableOptimization,
} from '@saserinn/react-native-battery-optimization-check';

export default () => {
  BatteryOptEnabled().then((isEnabled: boolean) => {
    if (isEnabled) {
      // if battery optimization is enabled, request to disable it.
      RequestDisableOptimization();
    }
  });
};
