import { ChangeEvent, useState } from 'react';
import { createStyles, Title, Table, Input, Group } from '@mantine/core';
import { Expense } from '../../types/generic';
import { AddExpenseModal } from './AddExpenseModal';

const useStyles = createStyles(() => ({
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}));

export const Expenses = ({ expenses }: { expenses: string }) => {
  const { classes } = useStyles();

  const [expenseData, setExpenseData] = useState(JSON.parse(expenses));
  const [searchInput, setSearchInput] = useState<string>('');

  // implement with useMemo
  const handleSearch = (string: string) => {
    setSearchInput(string);
    const filtered = [...expenseData].filter((expense: Expense) =>
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
          <AddExpenseModal setFiltered={setFiltered} />
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
          {expenseData.map((e: Expense, idx: number) => (
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
      <>{expenses}</>
    </div>
  );
};
