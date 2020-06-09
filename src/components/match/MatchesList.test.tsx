import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, MatchStatus, Player } from '../../models';
import { theme } from '../utils/Theme';
import MatchesList from './MatchesList';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

test('render new without crashing', async () => {
  const players = [
    new Player({ index: 0, userIDs: [], name: 'P1' }),
    new Player({ index: 1, userIDs: [], name: 'P2' }),
    new Player({ index: 2, userIDs: [], name: 'P3' }),
    new Player({ index: 3, userIDs: [], name: 'P4' }),
  ];

  const matches = [
    new Match({
      index: 0,
      playerIndices: [0, 1],
      status: MatchStatus.NEW,
    }),
    new Match({
      index: 1,
      playerIndices: [2, 3],
      status: MatchStatus.NEW,
    }),
  ];

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchesList
            matches={matches}
            players={players}
            onUpdate={() => { }}
          />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('vs')).toHaveLength(2);

  expect(screen.getByText('P1')).toBeInTheDocument();
  expect(screen.getByText('P2')).toBeInTheDocument();
  expect(screen.getByText('P3')).toBeInTheDocument();
  expect(screen.getByText('P4')).toBeInTheDocument();

  fireEvent.click(screen.getAllByText('vs')[0]);
});
