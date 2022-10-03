import { createStyles, Title, Button, Menu, Text } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { BiLogOutCircle } from 'react-icons/bi';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.dark[8],
    borderBottom: `0.2rem solid ${theme.colors.dark[6]}`,
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
        <Menu
          trigger="hover"
          closeDelay={500}
          withArrow
          shadow="lg"
          transition="scale-y"
          transitionDuration={150}
        >
          <Menu.Target>
            <Button mr={20} variant="outline" color="gray">
              {session.user?.name}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Text size="xs" color="dimmed" my={5} mx={5}>
              {session.user?.email}
            </Text>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item>Settings</Menu.Item>
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
