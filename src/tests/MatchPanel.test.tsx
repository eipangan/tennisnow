import { act, fireEvent, render, screen } from '@testing-library/react';
import { fail } from 'assert';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { getNewEvent, getNewPlayers, getNextMatch } from '../EventUtils';
import MatchPanel from '../MatchPanel';
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
    unsubscribe: () => { },
  }),
}));

DataStore.save = jest.fn().mockImplementation(() => ({
}));

test('render new without crashing', async () => {
  const players = getNewPlayers(event.id, 6);
  const match = await getNextMatch(event, [], players);

  expect(event).toBeDefined();
  expect(players).toBeDefined();
  expect(match).toBeDefined();

  if (!match) fail('match undefined.');
  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchPanel matchID={match.id} match={match} />
        </Suspense>
      </ThemeProvider>,
    );
  });

  expect(screen.getByTestId('player1')).toBeInTheDocument();
  expect(screen.getByTestId('middle')).toBeInTheDocument();
  expect(screen.getByTestId('player2')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('player1'));
  fireEvent.click(screen.getByTestId('middle'));
  fireEvent.click(screen.getByTestId('player2'));
});
