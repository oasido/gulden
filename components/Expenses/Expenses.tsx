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

const useStyles = createStyles((theme) => ({
  container: {
    [theme.fn.largerThan('md')]: {
      // color: 'skyblue',
    },
  },
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },

  sortable: {
    cursor: 'pointer',
    select: 'none',
  },

  table: {
    [theme.fn.smallerThan('xs')]: {
      color: 'red',
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
  const ref: any = useRef(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return <Checkbox ref={ref} {...rest} />;
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
      // table.getSelectedRowModel().flatRows;
      console.log(table.getSelectedRowModel().flatRows);
    } else {
    }
  };

  return (
    <div className={classes.container}>
      <Group position="apart">
        <Title order={4} className={classes.title}>
          Expenses
        </Title>
        <Group spacing="xs">
          <Button onClick={removeSelected} color="red" leftIcon={<FaTrashAlt />}>
            Remove
          </Button>
          <AddExpenseModal setData={setData} />
        </Group>
      </Group>
      <Input
        placeholder="Search..."
        value={globalFilter || ''}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => setGlobalFilter(evt.target.value)}
      />
      <Table
        className={classes.table}
        highlightOnHover
        verticalSpacing="sm"
        mb={20}
        captionSide="bottom"
      >
        <caption>{new Date().toLocaleString()}</caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => (
                <th
                  className={`${idx === 0 && classes.selectCol} ${idx === 1 && classes.dateCol} ${
                    idx === 2 && classes.nameCol
                  } ${idx === 3 && classes.priceCol}`}
                  key={header.id}
                >
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
                <td key={cell.id} className={classes.cell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {table.getPrePaginationRowModel().rows.length === 0 && globalFilter !== '' && (
        <Text size="lg">Nothing found.</Text>
      )}
      {table.getPrePaginationRowModel().rows.length === 0 && globalFilter === '' && (
        <Text size="lg">Empty table.</Text>
      )}
    </div>
  );
};
