import { Center, ActionIcon, Space, Select } from '@mantine/core';
import { useState } from 'react';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';
import { getMonthsNames } from '@mantine/dates';

export const TimeNavigation = () => {
  const MONTH_NAMES = getMonthsNames('en', 'MMMM');
  const currentMonthValue = new Date().getMonth() + 1;

  const [monthSelection, setMonthSelection] = useState(currentMonthValue);

  const handleMonthChange = (options: string | number) => {
    switch (options) {
      case 'next': {
        // monthSelection.value < 12 &&
        // setMonthSelection((previous) => {
        //   const nextMonth = previous.value + 1;
        //   return {
        //     label: MONTH_NAMES[nextMonth],
        //     value: nextMonth,
        //   };
        // });
        console.log(monthSelection);
        break;
      }
      case 'previous': {
        setMonthSelection((previous) => previous - 1);
        // monthSelection.value >= 1 &&
        //   setMonthSelection((previous) => {
        //     const previousMonth = previous.value - 1;
        //     return {
        //       label: MONTH_NAMES[previousMonth],
        //       value: previousMonth,
        //     };
        //   });
        console.log(monthSelection);
        break;
      }
      //   case typeof value === 'string' && Number.parseInt(value): {

      // }
    }
  };

  return (
    <Center>
      <ActionIcon
        onClick={() => handleMonthChange('previous')}
        size="xl"
        variant="filled"
        radius="md"
      >
        <BiFirstPage size={18} />
      </ActionIcon>

      <Select
        value={MONTH_NAMES[monthSelection]}
        onChange={setMonthSelection}
        data={MONTH_NAMES}
        radius="xl"
        mx={10}
      />

      <ActionIcon onClick={() => handleMonthChange('next')} size="xl" variant="filled" radius="md">
        <BiLastPage size={18} />
      </ActionIcon>
    </Center>
  );
};
