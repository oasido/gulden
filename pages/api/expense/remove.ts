import type { Expense } from 'types/generic';
import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const removeSchema = z.object({
  user: z.string().trim().email(),
  name: z.string().trim().min(2).max(25),
  date: z.date(),
  price: z.number(),
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await unstable_getServerSession(request, response, authOptions);

  if (session) {
    if (request.method === 'POST') {
      // const parse = removeSchema.safeParse({
      //   user,
      //   date: parsedDate,
      //   name,
      //   price,
      // });
      // if (parse.success === false) {
      //   response.status(400).json(parse.error.errors);
      //   return;
      // }

      const client = await clientPromise;
      const database = client.db('gulden');
      const collection = database.collection('expenses');

      // const databaseQuery = await collection.removeSchema({

      // });

      response.status(200).json('response');
    } else {
      response.status(400).json('Error code 400, bad request method.');
    }
  } else {
    response.status(401).json('Unauthorized request.');
  }
};

export default handler;
