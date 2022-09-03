import type { NextPage } from 'next';
import Expenses from '../components/Expenses';
import { PageLayout } from '../components/PageLayout';
import { InferGetServerSidePropsType } from 'next';
import dbConnect from '../lib/dbConnect';
import Expense from '../models/Expense';

export const getServerSideProps = async () => {
  try {
    await dbConnect();
    const data = await Expense.find({});

    return {
      props: { expenses: JSON.stringify(data) },
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

  return (
    <PageLayout>
      <Expenses expenses={JSON.parse(expenses)} />
    </PageLayout>
  );
};

export default Home;
