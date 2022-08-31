import { useState } from 'react';
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
        <Title order={3}>💸 Add Expense</Title>
        <Group position="center" mt="xl">
          <Button variant="outline" onClick={() => console.log('')}>
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
