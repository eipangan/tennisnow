import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../Theme';
import UserSettings from '../UserSettings';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <UserSettings />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('userSettings')).toBeInTheDocument();
  expect(screen.getByText('signout')).toBeInTheDocument();

  fireEvent.click(screen.getByText('signout'));
  expect(screen.getByText('userSettings')).toBeInTheDocument();
  expect(screen.getByText('signoutConfirm')).toBeInTheDocument();
  expect(screen.getAllByText('signout')).toHaveLength(2);
  expect(screen.getByText('cancel')).toBeInTheDocument();

  fireEvent.click(screen.getByText('cancel'));
  expect(screen.getByText('userSettings')).toBeInTheDocument();
  expect(screen.getByText('signoutConfirm')).toBeInTheDocument();
  expect(screen.getAllByText('signout')).toHaveLength(2);
  expect(screen.getByText('cancel')).toBeInTheDocument();
});
