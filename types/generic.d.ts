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
