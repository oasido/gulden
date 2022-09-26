import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Tabs, SegmentedControl, createStyles } from '@mantine/core';
import Chart from './Chart';
import { ChartType, Expense, TimePeriod } from 'types/generic';
import { AiOutlineBarChart, AiOutlineAreaChart } from 'react-icons/ai';

const useStyles = createStyles((theme) => ({
  segmentedControls: {
    [theme.fn.largerThan('sm')]: {
      width: '50%',
      margin: '0 auto',
    },
  },
}));

const Statistics: FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const { classes } = useStyles();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [chartType, setChartType] = useState<ChartType>('bar');

  interface IAvailableCharts {
    label: string;
    type: ChartType;
    icon?: JSX.Element;
  }
  [];

  const AVAILABLE_CHARTS: IAvailableCharts[] = [
    { label: 'Bar Chart', type: 'bar', icon: <AiOutlineBarChart /> },
    { label: 'Area Chart', type: 'area', icon: <AiOutlineAreaChart /> },
  ];

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
            { label: '6 Months', value: 'year' },
            { label: 'Year', value: 'all' },
          ]}
        />
      </div>

      <Tabs value={chartType} onTabChange={setChartType as Dispatch<SetStateAction<string | null>>}>
        <Tabs.List>
          {AVAILABLE_CHARTS.map((chart) => (
            <Tabs.Tab key={chart.type} value={chart.type} icon={chart.icon}>
              {chart.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value={chartType}>
          <Chart chartType={chartType} timePeriod={timePeriod} />
        </Tabs.Panel>

        <Tabs.Panel value="second">Second panel</Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Statistics;
