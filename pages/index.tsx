import type { NextPage } from 'next';
import { PageLayout } from '@components/PageLayout';
import Expenses from '@components/Expenses';
import Statistics from '@components/Statistics';
import clientPromise from '@lib/mongodb';
import { createStyles, Grid, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { Expense } from 'types/generic';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session?.user?.email) {
    const client = await clientPromise;
    const database = client.db('gulden');
    const expenseData = await database
      .collection('expenses')
      .find({ user: session.user.email })
      .sort({ date: -1 })
      .toArray();

    const userData = await database.collection('users').findOne({ email: session.user.email });

    return {
      props: { expenseData: JSON.stringify(expenseData), userData: JSON.stringify(userData) },
    };
  } else {
    return {
      props: {
        expenseData: '[]',
        userData: '[]',
      },
    };
  }
};

const useStyles = createStyles((theme) => ({
  grid: {},
  expenseGrid: {
    backgroundColor: theme.colors.dark[8],
    borderBottomLeftRadius: '10px',
  },
}));

const Home: NextPage<{ expenseData: string; userData: string }> = ({ expenseData, userData }) => {
  const { data: session } = useSession();
  const { classes } = useStyles();

  const parsedExpenses: Expense[] = JSON.parse(expenseData);
  const parsedUserData = JSON.parse(userData);

  return (
    <PageLayout>
      {session ? (
        <Grid className={classes.grid}>
          <Grid.Col md={7}>
            <Statistics user={parsedUserData} />
          </Grid.Col>
          <Grid.Col md={5} className={classes.expenseGrid}>
            <Expenses expenses={parsedExpenses} />
          </Grid.Col>
        </Grid>
      ) : (
        <Text mt="lg">You need to log in first!</Text>
      )}
    </PageLayout>
  );
};

export default Home;
