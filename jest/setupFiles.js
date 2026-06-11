/* global jest */
require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({isConnected: true, isInternetReachable: true, type: 'wifi'}),
  ),
}));
