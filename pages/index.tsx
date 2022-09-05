import type { NextPage } from 'next';
import Expenses from '../components/Expenses';
import { PageLayout } from '../components/PageLayout';
import clientPromise from '../lib/mongodb';

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

const Home: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { expenses } = props;

  return (
    <PageLayout>
      <Expenses expenses={JSON.parse(expenses)} />
    </PageLayout>
  );
};

export default Home;
