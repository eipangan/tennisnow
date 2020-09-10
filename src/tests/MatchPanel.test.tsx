import { act, render } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { useEvent } from '../hooks/useEvent';
import MatchPanel from '../MatchPanel';
import { Match, MatchStatus } from '../models';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const { event } = useEvent();

DataStore.query = jest.fn().mockImplementation(() => [new Match({
  eventID: event.id,
  status: MatchStatus.NEW,
})]);

DataStore.observe = jest.fn().mockImplementation(() => ({
  subscribe: () => ({
    unsubscribe: () => { },
  }),
}));

DataStore.save = jest.fn().mockImplementation(() => ({
}));

test('render new without crashing', async () => {
  const players = getNewPlayers(event.id, 6);

  expect(event).toBeDefined();
  expect(players).toBeDefined();

  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchPanel matchID="ABC" />
        </Suspense>
      </ThemeProvider>,
    );
  });
});
