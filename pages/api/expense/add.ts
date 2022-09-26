// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Expense } from 'types/generic';
import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { parseISO } from 'date-fns';

const expenseSchema = z.object({
  user: z.string().trim().email(),
  name: z.string().trim().min(2).max(25),
  date: z.date(),
  price: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === 'POST') {
      const { user, date, name, price }: Expense = req.body;
      const parsedDate = new Date(date);

      if (parsedDate.toISOString() === 'Invalid Date') {
        res.status(400).json('Invalid date, what are you trying to do?');
      }

      const parse = expenseSchema.safeParse({
        user,
        date: parsedDate,
        name,
        price,
      });
      if (parse.success === false) {
        res.status(400).json(parse.error.errors);
        return;
      }

      const client = await clientPromise;
      const db = client.db('gulden');
      const collection = db.collection('expenses');
      const response = await collection.insertOne({
        user,
        date: parseISO(date),
        name,
        price,
      });

      res.status(200).json(response);
    } else {
      res.status(400).json('Error code 400, bad request method.');
    }
    console.log('Session', JSON.stringify(session, null, 2));
  } else {
    res.status(401).json('Unauthorized request.');
  }
};

export default handler;
