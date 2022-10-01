import type { ExpenseSearchQueryResult, IParsedExpense } from 'types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { addDays, eachDayOfInterval, endOfDay, format, isSameDay, subDays } from 'date-fns';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await unstable_getServerSession(request, response, authOptions);

  if (session) {
    if (request.method === 'GET') {
      const client = await clientPromise;
      const database = client.db('gulden');
      const collection = database.collection('expenses');

      const today = endOfDay(new Date());
      const weekPastNow = subDays(today, 8);

      const databaseQueryResult = await collection
        .aggregate([
          {
            $match: {
              user: {
                $eq: session.user?.email,
              },
              date: {
                $gte: weekPastNow,
                $lte: today,
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

      const generateLastWeekArray = () => {
        // const date = addDays(new Date(), 1);
        const today = endOfDay(new Date());
        const weekPastNow = subDays(today, 7);

        console.log(weekPastNow, today);

        const lastWeek = eachDayOfInterval({
          start: weekPastNow,
          end: today,
        }).map((day) => ({
          label: format(day, 'dd/MM'),
          date: day,
        }));

        return lastWeek;
      };

      const expenses = generateLastWeekArray().map((day) => {
        const { date } = day;

        const parsedWeek: IParsedExpense = databaseQueryResult.find(
          (o: ExpenseSearchQueryResult, index: number) => {
            const isFound = isSameDay(o._id, date);
            if (isFound) {
              databaseQueryResult.splice(index, 1);
              return isFound;
            }
          }
        );

        return parsedWeek === undefined
          ? { ...day, spent: 0 }
          : { ...day, spent: parsedWeek.spent };
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
