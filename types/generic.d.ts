export type Expense = {
  _id?: string;
  user: string;
  name: string;
  price: number;
  date: string;
};

export interface User {
  _id?: string;
  name: string;
  email: string;
  image: string;
}

export interface ExpenseSearchQueryResult {
  _id: Date;
  label: string;
  spent?: number;
}

export type TimePeriod = 'week' | 'month' | 'year';

export type ChartType = 'bar' | 'area';

interface IParsedExpense {
  label: string;
  date: Date;
  spent: number;
}
