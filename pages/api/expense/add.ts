// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Expense } from 'types/generic';
import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';

const expenseSchema = z.object({
  name: z.string().trim().min(2),
  date: z.string().trim().min(1, { message: 'Invalid date' }),
  price: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { date, name, price }: Expense = req.body;
    console.log(req.body);
    console.log(date, name, price);
    const parse = expenseSchema.safeParse({ date, name, price });

    if (parse.success === false) {
      res.status(400).json(parse.error.errors);
      return;
    }

    const client = await clientPromise;
    const db = client.db('gulden');
    const collection = db.collection('expenses');
    const response = await collection.insertOne({ date, name, price });
    res.status(200).json(response);
  } else {
    res.status(400).json('Error code 400, bad request method.');
  }
};

export default handler;
