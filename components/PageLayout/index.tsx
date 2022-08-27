import { Container } from '@mantine/core';
import { FunctionComponent } from 'react';
import { Navbar } from './Navbar';

type Props = {
  children: JSX.Element;
};

export const PageLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container size="xl">{children}</Container>
    </>
  );
};
