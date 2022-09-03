import { Schema, models, model } from 'mongoose';
import { Expense } from '../types/generic';

const Expense = new Schema<Expense>({
  name: String,
  price: String,
  date: String,
});

export default models.Expense || model('Expense', Expense);
