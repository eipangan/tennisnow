import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, MatchStatus, Player, Stats, Team } from '../../models';
import { theme } from '../utils/Theme';
import MatchesList from './MatchesList';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

test('render new without crashing', async () => {
  const matches = [
    new Match({
      players: [
        new Player({
          index: 0,
          userid: ['P1'],
        }),
        new Player({
          index: 1,
          userid: ['P2'],
        }),
      ],
      status: MatchStatus.NEW,
    }),
    new Match({
      players: [
        new Player({
          index: 2,
          userid: ['P3'],
        }),
        new Player({
          index: 3,
          userid: ['P4'],
        }),
      ],
      status: MatchStatus.NEW,
    }),
  ];

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchesList
            matches={matches}
            onUpdate={() => { }}
          />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('vs')).toHaveLength(2);

  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('4')).toBeInTheDocument();

  fireEvent.click(screen.getAllByText('vs')[0]);
});
