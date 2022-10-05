import type { NextPage } from 'next';
import { PageLayout } from '@components/PageLayout';
import clientPromise from '@lib/mongodb';
import {
  Box,
  Button,
  Center,
  Container,
  Input,
  SegmentedControl,
  TextInput,
  Title,
} from '@mantine/core';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { AiOutlineBarChart, AiOutlineAreaChart, AiOutlineSave } from 'react-icons/ai';
import { BiArrowBack, BiCalendar, BiCalendarWeek } from 'react-icons/bi';
import { TbCalendarStats } from 'react-icons/tb';
import Link from 'next/link';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { User } from 'types/generic';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { showNotification } from '@mantine/notifications';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session?.user?.email) {
    const client = await clientPromise;
    const database = client.db('gulden');
    const userDocument = await database.collection('users').findOne({ email: session.user.email });

    return {
      props: { user: JSON.stringify(userDocument) },
    };
  } else {
    return {
      props: {
        user: '[]',
      },
    };
  }
};

const settingsSchema = z.object({
  email: z.string().email(),
  chartType: z.string().refine((value) => value === 'bar' || value === 'area'),
  timePeriod: z
    .string()
    .refine((value) => value === 'week' || value === 'month' || value === 'year'),
});

const handleSave = async (settings: z.infer<typeof settingsSchema>) => {
  const saveResponse = await axios.post('/api/settings/save', settings);

  if (saveResponse.status === 200) {
    showNotification({
      title: 'Settings saved',
      message: '',
      icon: <FaCheckCircle />,
      autoClose: 5000,
    });
  } else {
    showNotification({
      title: 'Error',
      message: 'Something went wrong',
      icon: <MdOutlineErrorOutline />,
      color: 'red',
      autoClose: 5000,
    });
  }
};

const Settings: NextPage<{ user: string }> = ({ user }) => {
  const parsedUserDocument: User & { settings: z.infer<typeof settingsSchema> } = JSON.parse(user);

  const form = useForm({
    validate: zodResolver(settingsSchema),
    initialValues: {
      email: parsedUserDocument.email,
      chartType: parsedUserDocument.settings?.chartType,
      timePeriod: parsedUserDocument.settings?.timePeriod,
    },
  });

  return (
    <PageLayout>
      <Container size="sm">
        <Link href="/" passHref>
          <Button
            size="lg"
            compact
            leftIcon={<BiArrowBack />}
            my={15}
            variant="outline"
            color="gray"
          >
            Go back
          </Button>
        </Link>

        <Title order={1}>Settings</Title>

        <TextInput
          label="Email"
          description="The email you've used to log in through Google."
          placeholder="Your Google's Email Address"
          my="md"
          value={parsedUserDocument.email ?? 'Unable to retrieve data'}
          disabled
          size="lg"
        />

        <Input.Wrapper
          label="Chart type"
          description="Change how you view the data in the expense chart."
          my="md"
          size="lg"
        >
          <SegmentedControl
            mt="xs"
            {...form.getInputProps('chartType')}
            data={[
              {
                label: (
                  <Center>
                    <AiOutlineBarChart size={16} />
                    <Box ml={10}>Bar</Box>
                  </Center>
                ),
                value: 'bar',
              },
              {
                label: (
                  <Center>
                    <AiOutlineAreaChart size={16} />
                    <Box ml={10}>Area</Box>
                  </Center>
                ),
                value: 'area',
              },
            ]}
          />
        </Input.Wrapper>

        <Input.Wrapper
          label="Default history"
          description="Default chart view history time period"
          size="lg"
          my="md"
        >
          <SegmentedControl
            mt="xs"
            {...form.getInputProps('timePeriod')}
            data={[
              {
                label: (
                  <Center>
                    <BiCalendarWeek size={16} />
                    <Box ml={10}>Last week</Box>
                  </Center>
                ),
                value: 'week',
              },
              {
                label: (
                  <Center>
                    <BiCalendar size={16} />
                    <Box ml={10}>Month</Box>
                  </Center>
                ),
                value: 'month',
              },
              {
                label: (
                  <Center>
                    <TbCalendarStats size={16} />
                    <Box ml={10}>Year</Box>
                  </Center>
                ),
                value: 'year',
              },
            ]}
          />
        </Input.Wrapper>
        <Center>
          <Button
            onClick={() => handleSave(form.values)}
            size="lg"
            compact
            leftIcon={<AiOutlineSave />}
            my={15}
            color="green"
          >
            Save
          </Button>
        </Center>
      </Container>
    </PageLayout>
  );
};

export default Settings;
