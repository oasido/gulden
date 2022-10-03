import type { ExpenseSearchQueryResult, IParsedExpense } from 'types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { eachMonthOfInterval, endOfYear, format, isSameMonth, startOfYear } from 'date-fns';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await unstable_getServerSession(request, response, authOptions);

  if (session) {
    if (request.method === 'GET') {
      const client = await clientPromise;
      const database = client.db('gulden');
      const collection = database.collection('expenses');

      const yearStart = startOfYear(new Date());
      const yearEnd = endOfYear(yearStart);

      const databaseQueryResult = await collection
        .aggregate([
          {
            $match: {
              user: {
                $eq: session.user?.email,
              },
              date: {
                $gte: yearStart,
                $lte: yearEnd,
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  date: '$date',
                  format: '%m-1-%Y',
                },
              },
              spent: { $sum: '$price' },
            },
          },
        ])
        .toArray();

      const generateYearByMonthArray = () => {
        const yearStart = startOfYear(new Date());
        const yearEnd = endOfYear(yearStart);

        const month = eachMonthOfInterval({
          start: yearStart,
          end: yearEnd,
        }).map((day) => ({
          label: format(day, 'MMMM'),
          date: day,
        }));

        return month;
      };

      const expenses = generateYearByMonthArray().map((day) => {
        const { date } = day;

        const parsedYearMonths: IParsedExpense = databaseQueryResult.find(
          (o: ExpenseSearchQueryResult, index: number) => {
            const isFound = isSameMonth(new Date(o._id), date);
            if (isFound) {
              databaseQueryResult.splice(index, 1);
              return isFound;
            }
          }
        );

        return parsedYearMonths === undefined
          ? { ...day, spent: 0 }
          : { ...day, spent: parsedYearMonths.spent };
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
