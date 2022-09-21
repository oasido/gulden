import { FC, useState } from 'react';
import { Tabs } from '@mantine/core';
import ExpenseChart from './ExpenseChart';
import { Expense } from 'types/generic';

const Statistics = ({ expenses }: { expenses: Expense[] }) => {
  const [activeTab, setActiveTab] = useState<string | null>('first');
  console.log(expenses);

  return (
    <Tabs value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="first">First tab</Tabs.Tab>
        <Tabs.Tab value="second">Second tab</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="first">
        <ExpenseChart expenses={expenses} />
      </Tabs.Panel>
      <Tabs.Panel value="second">Second panel</Tabs.Panel>
    </Tabs>
  );
};

export default Statistics;
