import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: 'red',
  },
}));

export const Navbar = () => {
  const { classes } = useStyles();
  return <div className={classes.navbar}>gulden</div>;
};
