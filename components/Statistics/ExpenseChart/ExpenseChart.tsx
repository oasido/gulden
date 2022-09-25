import { createStyles } from '@mantine/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { ExpenseSearchQueryResult } from 'types/generic';
import useSWR from 'swr';

const useStyles = createStyles((theme) => ({
  chart: {
    position: 'absolute',
  },
}));

export const ExpenseChart = () => {
  const { classes } = useStyles();

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

  const [labels, setLabels] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<number[]>([]);

  const chartFetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data, error } = useSWR('/api/expenses/week', chartFetcher);

  // const getChartData = async () => {
  //   const response = await axios.get('/api/expenses/week');

  //   if (response.status === 200) {
  //     const getExpensesData: number[] = response.data.map(
  //       (day: ExpenseSearchQueryResult) => day.spent
  //     );

  //     const getExpensesLabels: string[] = response.data.map(
  //       (day: ExpenseSearchQueryResult) => day.label
  //     );
  //     setExpenses(getExpensesData);
  //     setLabels(getExpensesLabels);
  //     console.log(expenses, labels);
  //   }
  // };

  // useMemo(() => getChartData(), []);

  const chartData = {
    labels: data?.labels,
    datasets: [
      {
        label: 'Expenses',
        data: data?.spendings,
        backgroundColor: 'rgba(255, 99, 132, 0.55)',
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
};
