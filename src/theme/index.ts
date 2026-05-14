import {extendTheme} from 'native-base';
import components from '~/theme/components';
import colors from '~/theme/colors';
import {fontConfig, fonts} from './fonts';
import {semanticColors} from './tokens';

export const customAppTheme = extendTheme({
  components,
  colors: {
    ...colors,
    ...semanticColors,
  },
  fontConfig,
  fonts,
});
