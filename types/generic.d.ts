export type Expense = {
  _id?: string;
  name: string;
  price: number;
  date: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}
