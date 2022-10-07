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
  price: z.number().positive(),
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await unstable_getServerSession(request, response, authOptions);

  if (session) {
    if (request.method === 'POST') {
      const { user, date, name, price }: Expense = request.body;
      const parsedDate = new Date(date);

      if (parsedDate.toISOString() === 'Invalid Date') {
        response.status(400).json('Invalid date, what are you trying to do?');
      }

      const parse = expenseSchema.safeParse({
        user,
        date: parsedDate,
        name,
        price,
      });
      if (parse.success === false) {
        response.status(400).json(parse.error.errors);
        return;
      }

      const client = await clientPromise;
      const database = client.db('gulden');
      const collection = database.collection('expenses');
      const databaseQuery = await collection.insertOne({
        user,
        date: parseISO(date),
        name,
        price,
      });

      response.status(200).json(databaseQuery);
    } else {
      response.status(400).json('Error code 400, bad request method.');
    }
  } else {
    response.status(401).json('Unauthorized request.');
  }
};

export default handler;
