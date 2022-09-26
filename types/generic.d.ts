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

export type TimePeriod = 'week' | 'month' | 'year' | 'all';

export type ChartType = 'bar' | 'area';
