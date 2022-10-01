import type { ExpenseSearchQueryResult, IParsedExpense } from 'types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth } from 'date-fns';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await unstable_getServerSession(request, response, authOptions);

  if (session) {
    if (request.method === 'GET') {
      const client = await clientPromise;
      const database = client.db('gulden');
      const collection = database.collection('expenses');

      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(monthStart);

      console.log(monthStart, monthEnd);

      const databaseQueryResult = await collection
        .aggregate([
          {
            $match: {
              user: {
                $eq: session.user?.email,
              },
              date: {
                $gte: monthStart,
                $lte: monthEnd,
              },
            },
          },
          {
            $group: {
              _id: '$date',
              spent: { $sum: '$price' },
            },
          },
        ])
        .toArray();

      const generateMonthArray = () => {
        const monthStart = startOfMonth(new Date());
        const monthEnd = endOfMonth(monthStart);
        console.log(monthStart, monthEnd);

        const month = eachDayOfInterval({
          start: monthStart,
          end: monthEnd,
        }).map((day) => ({
          label: format(day, 'dd/MM'),
          date: day,
        }));

        return month;
      };

      const expenses = generateMonthArray().map((day) => {
        const { date } = day;

        const parsedMonth: IParsedExpense = databaseQueryResult.find(
          (o: ExpenseSearchQueryResult, index: number) => {
            const isFound = isSameDay(o._id, date);
            if (isFound) {
              databaseQueryResult.splice(index, 1);
              return isFound;
            }
          }
        );

        return parsedMonth === undefined
          ? { ...day, spent: 0 }
          : { ...day, spent: parsedMonth.spent };
      });

      const spendings: number[] = expenses.map((day) => day.spent);

      const labels: string[] = expenses.map((day) => day.label);

      response.status(200).json({ spendings, labels });
    } else {
      response.status(400).json('Error code 400, bad request method.');
    }
  } else {
    response.status(401).json('Unauthorized request.');
  }
};

export default handler;
