import type { ExpenseSearchQueryResult, IParsedExpense } from 'types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { addDays, eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === 'GET') {
      const client = await clientPromise;
      const db = client.db('gulden');
      const collection = db.collection('expenses');

      const date = addDays(new Date(), 1);
      const weekPastNow = subDays(date, 7);

      const dbQueryResult = await collection
        .aggregate([
          {
            $match: {
              user: {
                $eq: session.user?.email,
              },
              date: {
                $gte: weekPastNow,
                $lte: date,
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
        const date = addDays(new Date(), 1);
        const weekPastNow = subDays(date, 7);

        const lastWeek = eachDayOfInterval({
          start: weekPastNow,
          end: date,
        }).map((day) => ({
          label: format(day, 'dd/MM'),
          date: day,
        }));

        return lastWeek;
      };

      const expenses = generateLastWeekArray().map((day) => {
        const { date } = day;

        const parsedWeek: IParsedExpense = dbQueryResult.find(
          (o: ExpenseSearchQueryResult, idx: number) => {
            const isFound = isSameDay(o._id, date);
            if (isFound) {
              dbQueryResult.splice(idx, 1);
              return isFound;
            }
          }
        );

        if (parsedWeek === undefined) {
          return { ...day, spent: 0 };
        } else {
          return { ...day, spent: parsedWeek.spent };
        }
      });

      const spendings: number[] = expenses.map((day) => day.spent);

      const labels: string[] = expenses.map((day) => day.label);

      res.status(200).json({ spendings, labels });
    } else {
      res.status(400).json('Error code 400, bad request method.');
    }
  } else {
    res.status(401).json('Unauthorized request.');
  }
};

export default handler;
