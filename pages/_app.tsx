import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>Gulden: Expense Tracking</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark',
          }}
        >
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
