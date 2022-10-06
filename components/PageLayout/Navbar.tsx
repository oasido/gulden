import { createStyles, Title, Button, Menu, Text } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { BiLogOutCircle } from 'react-icons/bi';
import { NextLink } from '@mantine/next';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { FiGithub, FiSettings } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';

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
    cursor: 'pointer',
  },

  button: {
    transition: 'all 0.2s ease-in-out',

    [theme.fn.largerThan('md')]: {
      marginRight: '2rem',
    },
  },
}));

export const Navbar = () => {
  const { classes } = useStyles();
  const { data: session } = useSession();

  return (
    <div className={classes.navbarWrapper}>
      <div className={classes.navbar}>
        <Link href="/">
          <Title order={1} className={classes.title}>
            💰 Gulden
          </Title>
        </Link>
        {!session ? (
          <Button
            leftIcon={<FcGoogle />}
            color="gray"
            variant="subtle"
            onClick={() => signIn('google')}
            size="lg"
            compact
            radius="xl"
          >
            Login with Google
          </Button>
        ) : (
          <Menu
            closeDelay={500}
            shadow="lg"
            transition="scale-y"
            transitionDuration={150}
            position="bottom-end"
          >
            <Menu.Target>
              <Button
                compact
                radius="xl"
                size="lg"
                variant="outline"
                color="gray"
                leftIcon={<FaUser />}
                className={classes.button}
              >
                {session.user?.name}
              </Button>
            </Menu.Target>

            <Menu.Dropdown mr={20}>
              <Text size="xs" color="dimmed" my={5} mx={5}>
                {session.user?.email}
              </Text>
              <Menu.Item icon={<FiSettings />} component={NextLink} href="/settings">
                Settings
              </Menu.Item>
              <Menu.Item
                icon={<AiOutlineSearch />}
                rightSection={
                  <Text size="xs" color="dimmed">
                    ⌘K
                  </Text>
                }
              >
                Search
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item icon={<FiGithub />}>GitHub</Menu.Item>
              <Menu.Item onClick={() => signOut()} icon={<BiLogOutCircle />} color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </div>
  );
};
