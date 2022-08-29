import { useState } from 'react';
import { Button, createStyles, Group, Modal, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

const useStyles = createStyles((theme) => ({
  //,
}));

export const AddExpenseModal = () => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
    },
  });

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="New Expense">
        <Title order={3}>💸 Add Expense</Title>
        <Group position="center" mt="xl">
          <Button variant="outline" onClick={() => console.log('')}>
            Add
          </Button>
        </Group>
      </Modal>
      <Button onClick={() => setOpened(true)}>Add</Button>
    </>
  );
};
