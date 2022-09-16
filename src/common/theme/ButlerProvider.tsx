import React, { ReactNode } from 'react';

// Required to make sure our styles pick up the font
import 'styles/poppins.css';

import { ThemeProvider, StylesProvider } from '@material-ui/core';
import { StylesOptions } from '@material-ui/styles';
import { ButlerTheme } from 'common/theme/theme';

type Props = {
  generateClassName?: StylesOptions['generateClassName'];
  children: ReactNode;
};

/**
 * Component that represents the results of inserting an object into an
 * external app within the context of an AppRun.
 * @param generateClassName Override default behavior of Material UI classname
 *                          generation. Used in testing to provide stable names
 */
export const ButlerProvider: React.FC<Props> = ({
  generateClassName,
  children,
}) => {
  return (
    <ThemeProvider theme={ButlerTheme}>
      {/*
        Tells material ui to inject its default styles first.
        This will change the css priority and enable us to override material
        ui in our scss when needed
        */}
      <StylesProvider generateClassName={generateClassName} injectFirst>
        {children}
      </StylesProvider>
    </ThemeProvider>
  );
};
