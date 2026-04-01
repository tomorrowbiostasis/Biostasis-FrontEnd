/**
 * Root stack only mounts MainStack / SignUpStack when the user is past auth bootstrap.
 * Resets must target the same route that is actually registered or React Navigation
 * throws "was not handled by any navigator" and can leave a blank screen.
 */
export type ReconnectNavigationState = {
  isLogged: boolean;
  loadingInitData: boolean;
  isInitialized: boolean;
  navigationReady: boolean;
};

export function getReconnectRootResetState(
  state: ReconnectNavigationState,
): {index: number; routes: {name: string}[]} {
  const showAuthenticatedShell =
    state.navigationReady && state.isLogged && !state.loadingInitData;

  if (!showAuthenticatedShell) {
    return {index: 0, routes: [{name: 'AuthStack'}]};
  }
  if (state.isInitialized) {
    return {index: 0, routes: [{name: 'MainStack'}]};
  }
  return {index: 0, routes: [{name: 'SignUpStack'}]};
}
