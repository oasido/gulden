import { createStyles } from '@mantine/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  ChartComponentLike,
} from 'chart.js';
import { FC, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import { ChartType, TimePeriod } from 'types/generic';
import useSWR from 'swr';

const useStyles = createStyles((theme) => ({
  chart: {
    position: 'absolute',
  },
}));

export const Chart: FC<{ timePeriod: TimePeriod; chartType: ChartType }> = ({
  timePeriod,
  chartType,
}): JSX.Element => {
  const { classes } = useStyles();

  const chartFetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data, error } = useSWR(`/api/expenses/${timePeriod}`, chartFetcher, {
    refreshInterval: 5000,
  });

  const registerChart = (chartType: ChartType): ChartComponentLike => {
    switch (chartType) {
      case 'bar':
        return [CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend];
      case 'area':
        return [
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          Title,
          Tooltip,
          Filler,
          Legend,
        ];
      default:
        return [CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend];
    }
  };

  ChartJS.register(registerChart(chartType));

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

  const chartData = {
    labels: data?.labels,
    datasets: [
      {
        fill: true,
        label: 'Expenses',
        data: data?.spendings,
        borderColor: 'rgba(234, 7, 11, 0.9)',
        backgroundColor: 'rgba(234, 7, 11, 0.45)',
      },
      // {
      //   fill: true,
      //   label: 'Income',
      //   data: [500, 33, 0, 555, 0, 0, 0],
      //   backgroundColor: 'rgba(147, 250, 165, 0.55)',
      // },
    ],
  };

  if (error) return <div>Failed to load</div>;

  switch (chartType) {
    case 'bar':
      return <Bar options={options} data={chartData} />;
    case 'area':
      return <Line options={options} data={chartData} />;
    default:
      return <Bar options={options} data={chartData} />;
  }
};
