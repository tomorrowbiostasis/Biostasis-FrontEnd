import React, {FC} from 'react';
import {Box, Text} from 'native-base';

interface IDocumentsHeader {
  caption: string;
}

const DocumentsHeader: FC<IDocumentsHeader> = ({caption}) => {
  return (
    <Box flexDirection="row" alignItems="center">
      <Text mt={4} mb={2} opacity={0.4} fontSize="sm">
        {caption}
      </Text>
    </Box>
  );
};

export default DocumentsHeader;
