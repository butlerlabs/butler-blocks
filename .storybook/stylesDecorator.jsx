import React from 'react';

import { ButlerProvider } from '../src/common/theme/ButlerProvider';


/**
 * Override behavior of Material UI classname generation for storybook testing.
 *
 * Normal behavior includes an incrementing number so that classnames are
 * globally unique in the application. However, this causes snapshot tests to
 * have non-determism.
 *
 * Generate the classname without the counter number.
 */
const generateStableClassName = (
  rule,
  sheet
) => `${sheet.options.classNamePrefix}-${rule.key}`;

/**
 * This decorator is used to wrap all of our stories with the
 * same material UI theme as our prod deployment. For more details,
 * can see example here:
 * https://medium.com/encode/setting-up-storybook-with-material-ui-and-styled-components-5bdacb6db866
 */
export const StylesDecorator = storyFn => {

  return(
  <ButlerProvider
    generateClassName={
      process.env.STABLE_CLASSNAMES ? generateStableClassName : undefined
    }
  >
    {storyFn()}
  </ButlerProvider>
  )
};
