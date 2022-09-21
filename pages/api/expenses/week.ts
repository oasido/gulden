// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Expense } from 'types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dayjs from 'dayjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  // if (session) {
  if (req.method === 'GET') {
    const { user } = req.body;

    const client = await clientPromise;
    console.log(dayjs().subtract(1, 'week').toISOString());
    const db = client.db('gulden');
    const collection = db.collection('expenses');
    // user,
    const response = await collection
      .aggregate([
        {
          $match: {
            date: {
              $gte: new Date(dayjs().subtract(1, 'week').toISOString()),
              $lte: new Date(),
            },
          },
        },
        { $group: { _id: { $dateToString: { date: '$date' } }, spent: { $sum: '$price' } } },
      ])
      .toArray();
    res.status(200).json(response);
  } else {
    res.status(400).json('Error code 400, bad request method.');
  }
  // } else {
  //   // Not Signed in
  //   res.status(401).json('Unauthorized request.');
  // }
};

export default handler;
