import React from 'react';
import { Card, makeStyles, Slide, Theme } from '@material-ui/core';

type Props = {
  children: React.ReactNode;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    zIndex: 100,
    borderColor: theme.palette.divider,
    borderStyle: 'solid',
    borderWidth: '1px 0px 1px 1px',
    position: 'absolute',
    bottom: theme.spacing(0),
    left: theme.spacing(36),
    width: 'calc(100% - 650px)',
    margin: 'auto',
    overflowX: 'scroll',
  },
}));

/**
 * Container component for the Table Labeler
 * @param Props
 */
export const DocumentLabelerTableContainer: React.FC<Props> = ({
  children,
}) => {
  const classes = useStyles();

  return (
    <Slide direction='up' in>
      <Card className={classes.Root} elevation={4}>
        {children}
      </Card>
    </Slide>
  );
};
