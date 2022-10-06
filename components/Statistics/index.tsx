import { useState } from 'react';
import { SegmentedControl, createStyles, Grid, Title } from '@mantine/core';
import Chart from './Chart';
import { ChartType, Expense, TimePeriod } from 'types/generic';
import axios from 'axios';
import useSWR from 'swr';
import { Totals } from './Totals';

const useStyles = createStyles((theme) => ({
  segmentedControls: {
    [theme.fn.largerThan('sm')]: {
      width: '50%',
      margin: '0 auto',
    },
  },

  chart: {
    [theme.fn.smallerThan('md')]: {
      height: '17rem',
    },
    [theme.fn.largerThan('md')]: {
      height: '25rem',
    },
  },
}));

const Statistics = ({ expenses, user }: { expenses: Expense[]; user: any }): JSX.Element => {
  const { classes } = useStyles();

  const [timePeriod, setTimePeriod] = useState<TimePeriod>(user.settings.timePeriod ?? 'month');
  const chartType: ChartType = user.settings.chartType ?? 'bar';

  const chartFetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data, error } = useSWR(`/api/expenses/${timePeriod}`, chartFetcher, {
    refreshInterval: 5000,
  });

  return (
    <>
      <div className={classes.segmentedControls}>
        <SegmentedControl
          value={timePeriod}
          onChange={setTimePeriod as (value: TimePeriod) => void}
          radius="xl"
          fullWidth
          mt={10}
          my={5}
          data={[
            { label: 'Last week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
          ]}
        />
      </div>

      <div className={classes.chart}>
        <Chart data={data} error={error} chartType={chartType} />
      </div>
    </>
  );
};

export default Statistics;
