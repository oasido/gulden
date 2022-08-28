import { createStyles, Title, Table } from '@mantine/core';
import { Expense } from '../../types/generic';

const useStyles = createStyles((theme) => ({
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}));

export const Expenses = (expenses: Expense[]) => {
  const { classes } = useStyles();

  const elements = [
    { position: 6, price: 12.011, date: '20/11/2022', name: 'Carbon' },
    { position: 7, price: 14.007, date: '20/11/2022', name: 'Nitrogen' },
    { position: 39, price: 88.906, date: '20/11/2022', name: 'Yttrium' },
    { position: 56, price: 137.33, date: '20/11/2022', name: 'Barium' },
    { position: 58, price: 140.12, date: '20/11/2022', name: 'Cerium' },
  ];

  const rows = elements.map((e, idx) => (
    <tr key={idx}>
      <td>{e.position}</td>
      <td>{e.name}</td>
      <td>{e.price}</td>
      <td>{e.date}</td>
    </tr>
  ));

  return (
    <div>
      <Title order={4} className={classes.title}>
        Expenses
      </Title>
      <Table highlightOnHover verticalSpacing="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};
