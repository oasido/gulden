import { createStyles, Title, Button, Menu, Text } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { BiLogOutCircle } from 'react-icons/bi';
import { NextLink } from '@mantine/next';

const useStyles = createStyles((theme) => ({
  navbarWrapper: {
    backgroundColor: theme.colors.dark[8],
    borderBottom: `0.2rem solid ${theme.colors.dark[6]}`,
  },

  navbar: {
    padding: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    userSelect: 'none',
  },

  button: {
    [theme.fn.largerThan('md')]: {
      marginRight: '2rem',
    },
  },
}));

export const Navbar = () => {
  const { classes } = useStyles();
  const { data: session } = useSession();

  return (
    <div className={classes.navbar}>
            onClick={() => signIn('google')}
            size="lg"
            compact
            radius="xl"
          >
          Login with Google
        </Button>
      ) : (
        <Menu
          trigger="hover"
          closeDelay={500}
          withArrow
          shadow="lg"
          transition="scale-y"
          transitionDuration={150}
        >
          <Menu.Target>
                compact
                radius="xl"
                size="lg"

          <Menu.Dropdown>
            <Text size="xs" color="dimmed" my={5} mx={5}>
              {session.user?.email}
            </Text>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item component={NextLink} href="/settings">
              Settings
            </Menu.Item>
            <Menu.Item
              rightSection={
                <Text size="xs" color="dimmed">
                  ⌘K
                </Text>
              }
            >
              Search
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>About</Menu.Item>
            <Menu.Item onClick={() => signOut()} icon={<BiLogOutCircle />} color="red">
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
};
