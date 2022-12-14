// eslint-disable-next-line unicorn/filename-case
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  createStyles,
  Title,
  Table,
  Input,
  Button,
  Group,
  Text,
  Checkbox,
  CheckboxProps,
} from '@mantine/core';
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
import { FaTrashAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';

const useStyles = createStyles((theme, getReference) => ({
  container: {},
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },

  sortable: {
    cursor: 'pointer',
    select: 'none',
  },

  tableWrap: {
    [theme.fn.largerThan('md')]: {
      maxHeight: 'calc(100vh - 220px)',
      height: 'calc(100vh - 220px)',
      overflow: 'auto',
    },
  },

  cell: {
    wordWrap: 'break-word',
  },

  selectCol: {
    width: '1rem',
  },

  dateCol: {
    width: '7rem',
  },

  nameCol: {
    width: '14rem',
  },

  priceCol: {
    width: '7rem',
  },
}));

const IndeterminateCheckbox = ({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & Partial<CheckboxProps>) => {
  const reference: any = useRef(undefined!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      reference.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [reference, indeterminate]);

  return <Checkbox ref={reference} {...rest} />;
};

export const Expenses = ({ expenses }: { expenses: Expense[] }) => {
  const { classes } = useStyles();

  const [data, setData] = useState(expenses);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Expense>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (info) => {
          const date = new Date(info.row.original.date);
          return format(date, 'dd/MM');
        },
      },
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

  const removeSelected = async () => {
    if (table.getSelectedRowModel().flatRows.length > 0) {
      const rowsToRemove = table.getSelectedRowModel().flatRows.map((row) => row.original);

      const response = await axios.post(
        '/api/expense/remove',
        rowsToRemove.map((row) => row._id)
      );

      if (response.status === 200) {
        setData((previous) => previous.filter((row) => !rowsToRemove.includes(row)));
      } else {
        console.error(response);
      }

      table.toggleAllRowsSelected(false);
    }
  };

  return (
    <div className={classes.container}>
      <Group position="apart">
        <Title order={4} className={classes.title}>
          Expenses
        </Title>
        <Group spacing="xs" mb={5} mx={5}>
          <Button size="lg" compact onClick={removeSelected} color="red" leftIcon={<FaTrashAlt />}>
            Remove
          </Button>
          <AddExpenseModal setData={setData} />
        </Group>
      </Group>
      <Input
        placeholder="Search..."
        value={globalFilter || ''}
        onChange={(event_: ChangeEvent<HTMLInputElement>) => setGlobalFilter(event_.target.value)}
        mb={10}
        mx={5}
        size="lg"
      />

      <div className={classes.tableWrap}>
        {table.getPrePaginationRowModel().flatRows.length > 0 && (
          <Table fontSize="lg" highlightOnHover verticalSpacing="sm" mb={20}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <th
                      className={`${index === 0 && classes.selectCol} ${
                        index === 1 && classes.dateCol
                      } ${index === 2 && classes.nameCol} ${index === 3 && classes.priceCol}`}
                      key={header.id}
                    >
                      {header.isPlaceholder ? undefined : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? classes.sortable : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' ????',
                            desc: ' ????',
                          }[header.column.getIsSorted() as string] ?? undefined}
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
                    <td key={cell.id} className={classes.cell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {table.getPrePaginationRowModel().rows.length === 0 && globalFilter !== '' && (
          <Text size="lg">Nothing found.</Text>
        )}
        {table.getPrePaginationRowModel().rows.length === 0 && globalFilter === '' && (
          <Text size="lg">
            Expense table is empty. Click {`'Add'`} to start tracking your expenses.
          </Text>
        )}
      </div>
    </div>
  );
};
