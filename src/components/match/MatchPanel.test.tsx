import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, MatchStatus, Player, Team, Stats } from '../../models';
import { theme } from '../utils/Theme';
import MatchPanel from './MatchPanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));


test('render new without crashing', async () => {
  const players = [
    new Player({ index: 0, userid: [], name: 'P1' }),
    new Player({ index: 1, userid: [], name: 'P2' }),
  ];

  const match = new Match({
    playerIndices: [0, 1],
    status: MatchStatus.NEW,
  });

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchPanel
            match={match}
            players={players}
          />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('P1')).toBeInTheDocument();
  expect(screen.getByText('vs')).toBeInTheDocument();
  expect(screen.getByText('P2')).toBeInTheDocument();
});
