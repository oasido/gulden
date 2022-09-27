import { createStyles, Title, Text, Badge, Button, Card, Group } from '@mantine/core';
import { FC } from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
}));

export const Totals: FC<{ data: any }> = ({ data }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Card my={0} shadow="sm" p="lg" radius="md" withBorder>
        <Group position="apart" mt="" mb="xs">
          <Text weight={500}>Monthly Expenses</Text>
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        </Group>
        <Text size="xl" color="dimmed">
          1,000$
        </Text>
      </Card>
    </div>
  );
};
