/**
 * Full App render pulls navigation, Amplify, NetInfo, Reanimated, and other
 * native-linked modules that are not practical to wire in Jest without a long
 * chain of mocks. Coverage for emergency/deadman logic lives in
 * src/services/__tests__/*. Use E2E or manual QA for full-app smoke tests.
 */
describe('App (Jest sanity)', () => {
  it('test runner is configured', () => {
    expect(true).toBe(true);
  });
});
