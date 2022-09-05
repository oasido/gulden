import { ChangeEvent, useState } from 'react';
import { createStyles, Title, Table, Input, Group } from '@mantine/core';
import { Expense } from '@types/generic';
import { AddExpenseModal } from './AddExpenseModal';

const useStyles = createStyles(() => ({
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}));

export const Expenses = ({ expenses }: { expenses?: Expense[] }) => {
  const { classes } = useStyles();
  const [expenseData, setExpenseData] = useState<Expense[]>([
    { price: 12.011, date: '20/11/22', name: 'Carbon' },
    { price: 14.007, date: '20/11/22', name: 'Nitrogen' },
    { price: 88.906, date: '20/11/22', name: 'Yttrium' },
    { price: 137.33, date: '20/11/22', name: 'Barium' },
    { price: 140.12, date: '20/11/22', name: 'Cerium' },
  ]);
  const [searchInput, setSearchInput] = useState<string>('');

  const elements = [
    { price: 12.011, date: '20/11/22', name: 'Carbon' },
    { price: 14.007, date: '20/11/22', name: 'Nitrogen' },
    { price: 88.906, date: '20/11/22', name: 'Yttrium' },
    { price: 137.33, date: '20/11/22', name: 'Barium' },
    { price: 140.12, date: '20/11/22', name: 'Cerium' },
  ];

  // implement with useMemo
  const handleSearch = (string: string) => {
    setSearchInput(string);
    const filtered = elements.filter((expense: Expense) =>
      expense.name.toLowerCase().includes(string.toLowerCase())
    );
    console.log(filtered);
    setExpenseData(filtered);
  };

  return (
    <div>
      <Group position="apart">
        <Title order={4} className={classes.title}>
          Expenses
        </Title>
        <AddExpenseModal />
      </Group>
      <Input
        placeholder="Search..."
        value={searchInput}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => handleSearch(evt.target.value)}
      />
      <Table highlightOnHover verticalSpacing="sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {expenseData.map((e, idx) => (
            <tr key={idx}>
              <td>{e.date}</td>
              <td>{e.name}</td>
              <td>{e.price}</td>
            </tr>
          ))}
          {expenseData.length === 0 && (
            <tr>
              <td></td>
              <td>No results found.</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </Table>
      <>{JSON.stringify(expenses)}</>
    </div>
  );
};
