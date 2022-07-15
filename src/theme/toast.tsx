import React from 'react';
import {Box} from 'native-base';
import Alert from '~/components/Alert';

export const toastConfig = {
  biostasis_success: ({text1}: {text1: string}) => (
    <Box alignSelf="stretch" m={5}>
      <Alert label={text1} />
    </Box>
  ),
  biostasis_error: ({text1}: {text1: string}) => (
    <Box alignSelf="stretch" m={5}>
      <Alert label={text1} error />
    </Box>
  ),
};
