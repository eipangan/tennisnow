import { act, render } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { getNewEvent } from '../EventUtils';
import MatchesList from '../MatchesList';
import { Match, MatchStatus } from '../models';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const event = getNewEvent();

DataStore.query = jest.fn().mockImplementation(() => [new Match({
  eventID: event.id,
  status: MatchStatus.NEW,
})]);

DataStore.observe = jest.fn().mockImplementation(() => ({
  subscribe: () => ({
    unsubscribe: () => {},
  }),
}));

test('render MatchesList with EventContext', async () => {
  await act(async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventContext.Provider value={{ event }}>
              <MatchesList />
            </EventContext.Provider>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>,
    );
  });
});

test('render MatchesList without EventContext', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchesList />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );
});
