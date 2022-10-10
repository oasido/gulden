import { createStyles, Title, Text, Badge, Button, Card, Group } from '@mantine/core';
import { FC } from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
  },
}));

const sumExpenses = (data: number[]) => data.reduce((a, b) => a + b, 0);

const getNamedTime = (data: number[] | string[]) => {
  if (data.length === 8) return 'Weekly Expenses';
  if (data.length === 31) return 'Monthly Expenses';
  if (data.length === 12) return 'Yearly Expenses';
};

export const Totals = ({ data }: { data: any }): JSX.Element => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Card shadow="sm" p="sm" radius="md" withBorder mb={5}>
        <Group position="apart" mb="xs" align="end">
          <Text size="xl" weight={500}>
            {data && getNamedTime(data?.spendings)}
          </Text>
        </Group>

        <Title order={1} align="center" color="red">
          {data && sumExpenses(data?.spendings)}
        </Title>

        {data?.spendings.length === 8 && (
          <Text size="sm" align="end" weight={500} color="dimmed">
            {data && `${data?.labels[0]} - ${data?.labels[data?.labels.length - 1]}`}
          </Text>
        )}
      </Card>
    </div>
  );
};
