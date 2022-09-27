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
import { FC } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { ChartType } from 'types/generic';

export const Chart: FC<{ data: any; error: any; chartType: ChartType }> = ({
  data,
  error,
  chartType,
}): JSX.Element => {
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
        text: 'Expense Report',
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
