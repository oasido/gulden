import type { NextPage } from 'next';
import { PageLayout } from '@components/PageLayout';
import Expenses from '@components/Expenses';
import Statistics from '@components/Statistics';
import clientPromise from '@lib/mongodb';
import { Container, Grid, Text } from '@mantine/core';
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
    const db = client.db('gulden');
    const expenseData = await db
      .collection('expenses')
      .find({ user: session.user.email })
      .sort({ date: -1 })
      .toArray();

    return {
      props: { expenseData: JSON.stringify(expenseData) },
    };
  } else {
    return {
      props: {
        expenseData: '[]',
      },
    };
  }
};

const Home: NextPage<{ expenseData: string }> = ({ expenseData }) => {
  const { data: session } = useSession();

  const parsedExpenses: Expense[] = JSON.parse(expenseData);

  return (
    <PageLayout>
      {session ? (
        <Grid>
          <Grid.Col sm={7}>
            <Statistics expenses={parsedExpenses} />
          </Grid.Col>
          <Grid.Col sm={5}>
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
