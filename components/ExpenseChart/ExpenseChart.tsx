import { useMemo } from 'react';
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  chart: {
    // backgroundColor: 'white',
    position: 'absolute',
  },
}));

export const ExpenseChart = () => {
  const { classes } = useStyles();

  // return <Chart className={classes.chart} options={{ data, primaryAxis, secondaryAxes }} />;
  return <div>chart</div>;
};
