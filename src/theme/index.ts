import {extendTheme} from 'native-base';
import components from '~/theme/components';
import colors from '~/theme/colors';
import {fontConfig, fonts} from './fonts';

export const customAppTheme = extendTheme({
  components,
  colors,
  fontConfig,
  fonts,
});
