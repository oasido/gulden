import create from 'zustand';
import { Expense } from 'types/generic';

interface Store {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

/* Warning:
  This is state, meaning local. setExpenses, addExpense, ...
  etc. are only saved client side, you'd have to run the ...
  corresponding database queries to actually save it. */

export const useStore = create<Store>((set) => ({
  expenses: [],
  setExpenses: (expenses: Expense[]) => set(() => ({ expenses: expenses })),
}));
