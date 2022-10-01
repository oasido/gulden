import { createStyles } from '@mantine/core';
import { FunctionComponent } from 'react';
import { Navbar } from './Navbar';

type Props = {
  children: JSX.Element;
};

const useStyles = createStyles((theme) => ({
  container: {
    padding: '0.5rem 0.5rem',
    overflowX: 'hidden',
  },
}));

export const PageLayout: FunctionComponent<Props> = ({ children }) => {
  const { classes } = useStyles();

  return (
    <>
      <Navbar />
      <div className={classes.container}>{children}</div>
    </>
  );
};
