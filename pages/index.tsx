import type { NextPage } from 'next';
import Expenses from '../components/Expenses';
import { PageLayout } from '../components/PageLayout';
import { InferGetServerSidePropsType } from 'next';
import clientPromise from '../lib/mongodb';

export const getServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = await client.db('gulden');
    const expenses = await db.collection('expenses').find({});

    // console.log(expenses);

    return {
      props: { expenses: 'JSON.stringify()' },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
};

const Home: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { expenses } = props;
  // console.log(expenses);

  return (
    <PageLayout>
      <Expenses />
    </PageLayout>
  );
};

export default Home;
