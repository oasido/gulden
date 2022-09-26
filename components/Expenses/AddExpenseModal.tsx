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
import { showNotification } from '@mantine/notifications';
import { useForm, zodResolver } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { z } from 'zod';
import { FaEraser, FaCheckCircle, FaCalendar } from 'react-icons/fa';
import { VscError } from 'react-icons/vsc';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Expense } from 'types/generic';
import { useMediaQuery } from '@mantine/hooks';
import { addMinutes } from 'date-fns';

const useStyles = createStyles((theme) => ({
  //,
}));

const expenseSchema = z.object({
  name: z.string().trim().min(2).max(25),
  date: z.date({ invalid_type_error: "That's not a date!" }),
  price: z.number(),
});

export const AddExpenseModal = ({ setData }: { setData: (data: any) => void }) => {
  const { classes, theme } = useStyles();
  const { data: session } = useSession();
  const [opened, setOpened] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 755px)');

  const form = useForm({
    validate: zodResolver(expenseSchema),
    initialValues: {
      name: '',
      date: new Date(),
      price: 0,
    },
    validateInputOnChange: true,
  });

  const addExpense = async () => {
    form.validate();

    // check if there are any parse errors
    if (Object.keys(form.errors).length === 0 && form.isValid() && session) {
      try {
        const calcOffset = () => {
          const date = new Date();
          const currentDayMinutes = date.getMinutes();
          const timeZoneOffset = date.getTimezoneOffset();

          if (timeZoneOffset > 0) {
            return currentDayMinutes + timeZoneOffset;
          } else {
            return currentDayMinutes - timeZoneOffset;
          }
        };

        const result = await axios.post('/api/expense/add', {
          user: session.user?.email,
          ...form.values,
          date: addMinutes(form.values.date, calcOffset()),
        });

        if (result.status === 200) {
          showNotification({
            title: 'Expense added',
            message: '',
            icon: <FaCheckCircle />,
            autoClose: 5000,
          });
          setData((data: Expense[]) => [
            {
              _id: result.data.insertId,
              user: session.user?.email,
              ...form.values,
            },
            ...data,
          ]);
          form.reset();
        } else {
          showNotification({
            title: 'An error occurred',
            message: '',
            icon: <VscError />,
            autoClose: 5000,
            color: 'red',
          });
        }
      } catch (error) {}
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="New Expense">
        <Group position="apart">
          <Title order={3}>💸 Add Expense</Title>
          <ActionIcon variant="default" onClick={() => form.reset()}>
            <FaEraser color={theme.colors.red[7]} />
          </ActionIcon>
        </Group>
        <Container mt="sm" mb="xl">
          <TextInput
            label="Name"
            description="What did you spend money on?"
            placeholder="Spent on..."
            my="xs"
            withAsterisk
            {...form.getInputProps('name')}
            error={form.errors.name && form.errors.name}
          />

          <DatePicker
            label="Date"
            description="When was the transaction?"
            firstDayOfWeek="sunday"
            my="xs"
            dropdownType={isMobile ? 'modal' : 'popover'}
            icon={<FaCalendar size={16} />}
            withAsterisk
            {...form.getInputProps('date')}
            error={form.errors.date && form.errors.date}
          />
          <NumberInput
            label="Price"
            description="How much did you pay?"
            defaultValue={0.0}
            my="xs"
            withAsterisk
            precision={2}
            step={0.05}
            {...form.getInputProps('price')}
            onFocus={(evt) => evt.target.select()}
          />
        </Container>
        <Group position="center">
          <Button variant="outline" onClick={addExpense}>
            Add
          </Button>
          <Button variant="outline" color="red" onClick={() => setOpened(false)}>
            Close
          </Button>
        </Group>
      </Modal>
      <Button onClick={() => setOpened(true)}>Add</Button>
    </>
  );
};
