import { createStyles, Title, Button, Menu } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { BiLogOutCircle } from 'react-icons/bi';

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
  const { data: session } = useSession();

  return (
    <div className={classes.navbar}>
      <Title order={2}>💰 Gulden</Title>
      {!session ? (
        <Button
          leftIcon={<FcGoogle />}
          color="gray"
          variant="subtle"
          onClick={() => signIn('google')}
        >
          Login with Google
        </Button>
      ) : (
        <Button
          leftIcon={<BiLogOutCircle />}
          color="gray"
          variant="subtle"
          onClick={() => signOut()}
        >
          Logout
        </Button>
      )}
    </div>
  );
};
