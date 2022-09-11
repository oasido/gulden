import { ChangeEvent, useState } from 'react';
import { createStyles, Title, Table, Input, Group, Container } from '@mantine/core';
import { Expense } from 'types/generic';
import { AddExpenseModal } from './AddExpenseModal';

const useStyles = createStyles(() => ({
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}));

export const Expenses = ({ expenses }: { expenses: string }) => {
  const { classes, theme } = useStyles();

  const [expensesArr, setExpensesArr] = useState(JSON.parse(expenses));
  const [filtered, setFiltered] = useState(expensesArr);
  const [searchInput, setSearchInput] = useState<string>('');

  // implement with useMemo
  const handleSearch = (string: string) => {
    setSearchInput(string);
    const search = expensesArr.filter((expense: Expense) =>
      expense.name.toLowerCase().includes(string.toLowerCase())
    );
    setFiltered(search);
  };

  return (
    <div>
      <Container>
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
        <Table highlightOnHover fontSize="md" verticalSpacing="sm" mb={100}>
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.reverse().map((e: Expense, idx: number) => (
              <tr key={idx}>
                <td>X</td>
                <td>{e.date}</td>
                <td>{e.name}</td>
                <td>{e.price}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td></td>
                <td>No results found.</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
