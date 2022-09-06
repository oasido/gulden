// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';

type Data = {
  name: string;
};

type Request = {};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const client = await clientPromise;
    const db = client.db('gulden');
    const expenses = await db.collection('expenses').find({}).toArray();

    res.status(200).json({ name: 'John Doe' });
  } catch (err) {
    console.error(err);
  }
};

export default handler;
