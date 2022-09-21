import { createStyles } from '@mantine/core';
import { getWeekdaysNames, isSameMonth } from '@mantine/dates';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Expense } from 'types/generic';
import dayjs from 'dayjs';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
  chart: {
    position: 'absolute',
  },
}));

export const ExpenseChart = ({ expenses }: { expenses: Expense[] }) => {
  const { classes } = useStyles();

  // const getMonthlyExpenseData = (amount: number): number[] => {
  //   axios.get(`/api/expense/list/${amount}`);
  // };

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };
  const [before, setBefore] = useState<'week' | 'month' | 'year'>('week');

  const [labels, setLabels] = useState(getWeekdaysNames('en', 'sunday'));

  const getRelevantDates = async () => {
    const response = await axios.get('/api/expenses/week');
    console.log(response.data);
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [5, 5, 14, 32, 1, 2, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.55)',
      },
    ],
  };

  return <Bar options={options} data={data} />;
};
