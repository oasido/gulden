import create from 'zustand';
import { Expense, TimePeriodOptions } from 'types/generic';

interface Store {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  timePeriod: TimePeriodOptions;
  setTimePeriod: (timePeriod: TimePeriodOptions) => void;
}

export const useStore = create<Store>((set) => ({
  expenses: [],
  setExpenses: (expenses: Expense[]) => set(() => ({ expenses: expenses })),
  timePeriod: 'month',
  setTimePeriod: (timePeriod: TimePeriodOptions) => set(() => ({ timePeriod: timePeriod })),
}));
