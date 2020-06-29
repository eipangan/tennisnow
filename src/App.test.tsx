import { act, render, screen } from '@testing-library/react';
import Amplify, { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import awsconfig from './aws-exports';
import { getNewEvent } from './components/event/EventUtils';
import { theme } from './components/utils/Theme';
import { Match, MatchStatus } from './models';

Amplify.configure(awsconfig);

jest.mock('react-ga');

jest.mock('');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
    i18n: {
      language: 'en',
      changeLanguage: (lng: string) => { },
    },
  }),
}));

const event = getNewEvent();

DataStore.query = jest.fn().mockImplementation(() => [new Match({
  eventID: event.id,
  status: MatchStatus.NEW,
})]);

DataStore.observe = jest.fn().mockImplementation(() => ({
  subscribe: () => ({
    unsubscribe: () => { },
  }),
}));

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback="loading...">
          <App />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('title.svg')).toBeInTheDocument();
  expect(screen.getByText('signin')).toBeInTheDocument();
  expect(screen.getByText('@tennisnownet')).toBeInTheDocument();
});
