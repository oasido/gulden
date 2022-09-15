import type { NextPage } from 'next';
import Expenses from '@components/Expenses';
import { PageLayout } from '@components/PageLayout';
import clientPromise from '@lib/mongodb';
import { Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useStore } from '@context/useStore';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log(session?.user?.email);
  if (session?.user?.email) {
    const client = await clientPromise;
    const db = client.db('gulden');
    const expenseData = await db
      .collection('expenses')
      .find({ user: session.user.email })
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

  return (
    <PageLayout>
      {session ? (
        <Expenses expenses={expenseData} />
      ) : (
        <Text mt="lg">You need to log in first!</Text>
      )}
    </PageLayout>
  );
};

export default Home;
