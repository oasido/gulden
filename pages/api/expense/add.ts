// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Expense } from '../../../types/generic';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';

type Data = {
  name: string;
};

type Request = {};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('gulden');
      const collection = db.collection('expenses');
      const foundExpenses = await collection.find({}).toArray();

      res.status(200).json(foundExpenses);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(400).json({ msg: 'Error code 400, bad request method.' });
  }
};

export default handler;
