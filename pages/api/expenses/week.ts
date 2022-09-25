// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Expense, ExpenseSearchQueryResult } from 'types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === 'GET') {
      const { user } = req.body;
      // TODO: Show only user specific data

      const client = await clientPromise;
      const db = client.db('gulden');
      const collection = db.collection('expenses');

      const date = new Date(new Date().setHours(0, 0, 0, 0));
      const weekPastNow = subDays(date, 7);

      const dbQueryResult = await collection
        .aggregate([
          {
            $match: {
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

      const getLastWeekArray = () => {
        const date = new Date(new Date().setHours(0, 0, 0, 0));
        const weekPastNow = subDays(date, 7);

        const weekArray = eachDayOfInterval({
          start: weekPastNow,
          end: date,
        }).map((day) => ({
          label: format(day, 'dd/MM'),
          date: day,
        }));

        return weekArray;
      };

      const responseData = getLastWeekArray().map((day) => {
        const { date } = day;

        const parsedObj = dbQueryResult.find((o: ExpenseSearchQueryResult, idx: number) => {
          console.log(o._id);
          const isFound = isSameDay(o._id, date);
          if (isFound) {
            dbQueryResult.splice(idx, 1);
            return isFound;
          }
        });

        if (parsedObj === undefined) {
          return { ...day, spent: 0 };
        } else {
          return { ...day, date: parsedObj._id, spent: parsedObj.spent };
        }
      });

      // const getExpensesDataArr: number[] = responseData.map((day) => day.spent);

      // const getExpensesLabelsArr: string[] = responseData.map((day) => day.label);

      res.status(200).json(responseData);
    } else {
      res.status(400).json('Error code 400, bad request method.');
    }
  } else {
    res.status(401).json('Unauthorized request.');
  }
};

export default handler;
