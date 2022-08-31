import { useState } from 'react';
import {
  Button,
  createStyles,
  Group,
  TextInput,
  Modal,
  Title,
  Container,
  ActionIcon,
  NumberInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';

const useStyles = createStyles((theme) => ({
  //,
}));

const expenseSchema = z.object({
  name: z.string().trim().min(2),
  date: z.string().trim().min(1, { message: 'Invalid date' }),
  amount: z.number(),
});

export const AddExpenseModal = () => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState<boolean>(false);

  const form = useForm({
    validate: zodResolver(expenseSchema),
    initialValues: {
      name: '',
      date: '',
      amount: 0,
    },
  });

  const addExpense = () => {
    console.log(form.validate());
    console.log(form.errors);
    console.log(form.values);
  };

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="New Expense">
        <Group position="apart">
          <Title order={3}>💸 Add Expense</Title>
          <ActionIcon variant="default" onClick={() => form.reset()}>
            ❌
          </ActionIcon>
        </Group>
        <Container mt="sm" mb="xl">
          <TextInput
            label="Name"
            description="What did you spend money on?"
            placeholder="Spent on..."
            my="xs"
            {...form.getInputProps('name')}
            error={form.errors.name && form.errors.name}
          />
          <TextInput
            label="Date"
            description="When was the transaction?"
            type="date"
            my="xs"
            {...form.getInputProps('date')}
            error={form.errors.date && form.errors.date}
          />
          <NumberInput
            label="Amount"
            description="How much did you pay?"
            defaultValue={0.0}
            my="xs"
            precision={2}
            step={0.05}
            {...form.getInputProps('amount')}
          />
        </Container>
        <Group position="center">
          <Button variant="outline" onClick={addExpense}>
            Add
          </Button>
          <Button variant="outline" color="red" onClick={() => setOpened(false)}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <Button onClick={() => setOpened(true)}>Add</Button>
    </>
  );
};
