import {ITheme} from 'native-base';
import {buttonStyles} from './button';
import {
  formControlErrorMessageStyles,
  formControlLabelStyles,
} from './formControl';
import {headingStyles} from './heading';
import {inputStyles} from './input';
import {radioStyles} from './radio';
import {tabsStyles} from './tabs';
import {textStyles} from './text';

const components: ITheme['components'] | Record<string, any> = {
  Heading: headingStyles,
  Text: textStyles,
  Button: buttonStyles,
  Input: inputStyles,
  FormControlErrorMessage: formControlErrorMessageStyles,
  FormControlLabel: formControlLabelStyles,
  Tabs: tabsStyles,
  Radio: radioStyles,
};

export default components;
