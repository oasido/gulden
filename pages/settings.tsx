import type { NextPage } from 'next';
import { PageLayout } from '@components/PageLayout';
import Expenses from '@components/Expenses';
import Statistics from '@components/Statistics';
import clientPromise from '@lib/mongodb';
import {
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Grid,
  Group,
  Input,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { Expense } from 'types/generic';
import { AiOutlineBarChart, AiOutlineAreaChart } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import Link from 'next/link';

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
    const db = client.db('gulden');
    const expenseData = await db
      .collection('expenses')
      .find({ user: session.user.email })
      .sort({ date: -1 })
      .toArray();

    return {
      props: { expenseData: JSON.stringify(expenseData) },
    };
  } else {
    return {
      props: {
        expenseData: '[]',
      },
    };
  }
};

const useStyles = createStyles((theme) => ({
  grid: {},
  expenseGrid: {
    backgroundColor: theme.colors.dark[8],
    borderBottomLeftRadius: '10px',
  },
}));

const Settings: NextPage<{ expenseData: string }> = ({ expenseData }) => {
  const { data: session } = useSession();
  const { classes } = useStyles();

  const parsedExpenses: Expense[] = JSON.parse(expenseData);

  return (
    <PageLayout>
      {session ? (
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
            value={session.user?.email ?? 'Unable to retrieve data'}
            disabled
            size="lg"
            // {...form.getInputProps('name')}
            // error={form.errors.name && form.errors.name}
          />

          <Input.Wrapper
            label="Chart type"
            description="Change how you view the data in the expense chart."
            my="md"
            size="lg"
          >
            <SegmentedControl
              mt="xs"
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
              data={[
                {
                  label: (
                    <Center>
                      <AiOutlineBarChart size={16} />
                      <Box ml={10}>Last week</Box>
                    </Center>
                  ),
                  value: 'week',
                },
                {
                  label: (
                    <Center>
                      <AiOutlineBarChart size={16} />
                      <Box ml={10}>Month</Box>
                    </Center>
                  ),
                  value: 'month',
                },
                {
                  label: (
                    <Center>
                      <AiOutlineAreaChart size={16} />
                      <Box ml={10}>Year</Box>
                    </Center>
                  ),
                  value: 'year',
                },
              ]}
            />
          </Input.Wrapper>
        </Container>
      ) : (
        <Text mt="lg">You need to log in first!</Text>
      )}
    </PageLayout>
  );
};

export default Settings;
