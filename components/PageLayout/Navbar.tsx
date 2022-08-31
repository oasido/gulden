import { createStyles, Title } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  navbar: {
    // backgroundColor: theme.colors.dark[4],
    borderBottom: `0.2rem solid ${theme.colors.dark[5]}`,
    padding: '0.8rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export const Navbar = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.navbar}>
      <Title order={2}>💰 Gulden</Title>
    </div>
  );
};
