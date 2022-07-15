import {DependencyList, useEffect, useRef} from 'react';

export const useDidUpdateEffect = (
  func: () => unknown,
  deps?: DependencyList,
) => {
  const didMount = useRef(false);

  useEffect(() => {
    didMount.current ? func() : (didMount.current = true);
    /* eslint-disable */
  }, deps);
};
