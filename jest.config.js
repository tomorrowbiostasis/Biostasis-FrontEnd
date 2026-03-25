module.exports = {
    preset: 'react-native',
    setupFiles: ['<rootDir>/jest/setupFiles.js'],
    moduleNameMapper: {
        '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
        '^react-native-keyboard-aware-scroll-view$':
            '<rootDir>/__mocks__/keyboardAwareScrollViewMock.js',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-native-vector-icons|@react-navigation|react-native-reanimated|react-native-gesture-handler|react-native-drawer-layout|react-native-screens|react-native-safe-area-context|react-native-device-time-format|react-native-keyboard-aware-scroll-view)/)',
    ],
};