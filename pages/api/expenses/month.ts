import type { ExpenseSearchQueryResult, IParsedExpense } from 'types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth } from 'date-fns';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === 'GET') {
      const client = await clientPromise;
      const db = client.db('gulden');
      const collection = db.collection('expenses');

      const date = endOfMonth(new Date());
      const weekPastNow = startOfMonth(date);

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

      const generateMonthArray = () => {
        const date = endOfMonth(new Date());
        const weekPastNow = startOfMonth(date);

        const month = eachDayOfInterval({
          start: weekPastNow,
          end: date,
        }).map((day) => ({
          label: format(day, 'dd/MM'),
          date: day,
        }));

        return month;
      };

      const expenses = generateMonthArray().map((day) => {
        const { date } = day;

        const parsedMonth: IParsedExpense = dbQueryResult.find(
          (o: ExpenseSearchQueryResult, idx: number) => {
            const isFound = isSameDay(o._id, date);
            if (isFound) {
              dbQueryResult.splice(idx, 1);
              return isFound;
            }
          }
        );

        if (parsedMonth === undefined) {
          return { ...day, spent: 0 };
        } else {
          return { ...day, spent: parsedMonth.spent };
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
