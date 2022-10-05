import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const settingsSchema = z.object({
  email: z.string().email(),
  chartType: z.string().refine((value) => value === 'bar' || value === 'area'),
  timePeriod: z
    .string()
    .refine((value) => value === 'week' || value === 'month' || value === 'year'),
});

// eslint-disable-next-line unicorn/prevent-abbreviations
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === 'POST') {
      const { email, chartType, timePeriod } = req.body;

      const parse = settingsSchema.safeParse({
        email,
        chartType,
        timePeriod,
      });

      if (parse.success === false) {
        res.status(400).json(parse.error.errors);
        return;
      }

      const client = await clientPromise;
      const database = client.db('gulden');
      const collection = database.collection('users');
      const saveSettingsDatabaseQueryResult = await collection.updateOne(
        { email },
        { $set: { settings: { chartType, timePeriod } } }
      );

      res.status(200).json(saveSettingsDatabaseQueryResult);
    } else {
      res.status(400).json('Error code 400, bad request method.');
    }
  } else {
    res.status(401).json('Unauthorized request.');
  }
};

export default handler;
