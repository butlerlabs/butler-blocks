import React from 'react';
import { Box } from '@material-ui/core';
import { TruncatableTypography } from 'common/display/TruncatableTypography/TruncatableTypography';

export default {
  component: TruncatableTypography,
  title: 'TruncatableTypography',
  parameters: {
    fileName: __filename,
  },
};

const TEXT_TO_USE =
  'Long text that should be correctly truncated in smaller components!';

export const NotTruncated = () => <TruncatableTypography value={TEXT_TO_USE} />;

export const Truncated = () => (
  <Box
    style={{
      maxWidth: 96,
    }}
  >
    <TruncatableTypography value={TEXT_TO_USE} />
  </Box>
);
