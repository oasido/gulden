import type { NextPage } from 'next';
import Expenses from '../components/Expenses';
import { PageLayout } from '../components/PageLayout';

const Home: NextPage = () => {
  return (
    <PageLayout>
      <Expenses />
    </PageLayout>
  );
};

export default Home;
