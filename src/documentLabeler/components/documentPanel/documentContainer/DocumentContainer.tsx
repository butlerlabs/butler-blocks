import React from 'react';
import clsx from 'clsx';
import { Card, makeStyles } from '@material-ui/core';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const useStyles = makeStyles(() => ({
  PreviewPaneContainer: {
    flex: 1,
    height: '100%',
    padding: 0,
    position: 'relative',
    background: 'transparent',
  },
}));

/**
 * Container component for the document displayer
 *
 * @param props
 */
export const DocumentContainer: React.FC<Props> = ({ children, className }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.PreviewPaneContainer, className)}
      elevation={1}
    >
      {children}
    </Card>
  );
};
