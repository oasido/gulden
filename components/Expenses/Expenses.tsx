import { ChangeEvent, useMemo, useState } from 'react';
import { createStyles, Title, Table, Input, Group, Container } from '@mantine/core';
import { Expense } from 'types/generic';
import { AddExpenseModal } from './AddExpenseModal';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  getFilteredRowModel,
} from '@tanstack/react-table';

const useStyles = createStyles(() => ({
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },

  sortable: {
    cursor: 'pointer',
    select: 'none',
  },
}));

export const Expenses = ({ expenses }: { expenses: string }) => {
  const { classes } = useStyles();

  const [data, setData] = useState(JSON.parse(expenses));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Expense>[]>(
    () => [
      { header: 'Date', accessorKey: 'date' },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Price',
        accessorKey: 'price',
        enableGlobalFilter: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });

  return (
    <div>
      <Container>
        <Group position="apart">
          <Title order={4} className={classes.title}>
            Expenses
          </Title>
          <AddExpenseModal setData={setData} />
        </Group>
        <Input
          placeholder="Search..."
          value={globalFilter || ''}
          onChange={(evt: ChangeEvent<HTMLInputElement>) => setGlobalFilter(evt.target.value)}
        />
        <Table highlightOnHover fontSize="md" verticalSpacing="sm" mb={100}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() ? classes.sortable : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
