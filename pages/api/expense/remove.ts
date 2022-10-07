import type { Expense } from 'types/generic';
import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await unstable_getServerSession(request, response, authOptions);

  const expensesToRemove = z.array(z.string()).safeParse(request.body);

  !expensesToRemove.success && response.status(400).json({ error: 'Invalid request' });

  if (session) {
    if (request.method === 'POST') {
      const client = await clientPromise;
      const database = client.db('gulden');
      const collection = database.collection('expenses');

      const databaseQuery = await collection.deleteMany({
        _id: { $in: request.body.map((expense: string) => new ObjectId(expense)) },
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
