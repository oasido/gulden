import type { NextPage } from 'next';
import Expenses from '@components/Expenses';
import { PageLayout } from '@components/PageLayout';
import clientPromise from '@lib/mongodb';
import { Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useStore } from '@context/useStore';

export const getServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db('gulden');
    const expenseData = await db.collection('expenses').find({}).toArray();

    return {
      props: { expenseData: JSON.stringify(expenseData) },
    };
  } catch (e) {
    console.error(e);
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
