import type { NextPage } from 'next';
import Expenses from '@components/Expenses';
import { PageLayout } from '@components/PageLayout';
import clientPromise from '@lib/mongodb';
import { Text } from '@mantine/core';
import { useSession } from 'next-auth/react';

export const getServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db('gulden');
    const expenses = await db.collection('expenses').find({}).toArray();

    return {
      props: { expenses: JSON.stringify(expenses) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        expenses: '[]',
      },
    };
  }
};

const Home: NextPage<{ expenses: string }> = ({ expenses }) => {
  const { data: session } = useSession();

  return (
    <PageLayout>
      {session ? <Expenses expenses={expenses} /> : <Text mt="lg">You need to log in first!</Text>}
    </PageLayout>
  );
};

export default Home;
