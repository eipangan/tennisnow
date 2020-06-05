import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, Player, Team, MatchStatus, Stats } from '../../models';
import { theme } from '../utils/Theme';
import MatchesPanel from './MatchesPanel';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

test('render new without crashing', async () => {
  const matches = [
    new Match({
      teams: [
        new Team({
          players: [
            new Player({
              userid: 'P1',
              name: 'P1',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
            new Player({
              userid: 'P2',
              name: 'P2',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
          ],
          stats: new Stats({
            numDraws: 0,
            numLost: 0,
            numMatches: 0,
            numWon: 0,
          }),
        }),
        new Team({
          players: [
            new Player({
              userid: 'P3',
              name: 'P3',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
            new Player({
              userid: 'P4',
              name: 'P4',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
          ],
          stats: new Stats({
            numDraws: 0,
            numLost: 0,
            numMatches: 0,
            numWon: 0,
          }),
        }),
      ],
      status: MatchStatus.NEW,
    }),
    new Match({
      teams: [
        new Team({
          players: [
            new Player({
              userid: 'P5',
              name: 'P5',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
            new Player({
              userid: 'P6',
              name: 'P6',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
          ],
          stats: new Stats({
            numDraws: 0,
            numLost: 0,
            numMatches: 0,
            numWon: 0,
          }),
        }),
        new Team({
          players: [
            new Player({
              userid: 'P7',
              name: 'P7',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
            new Player({
              userid: 'P8',
              name: 'P8',
              stats: new Stats({
                numDraws: 0,
                numLost: 0,
                numMatches: 0,
                numWon: 0,
              }),
            }),
          ],
          stats: new Stats({
            numDraws: 0,
            numLost: 0,
            numMatches: 0,
            numWon: 0,
          }),
        }),
      ],
      status: MatchStatus.NEW,
    }),
  ];

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchesPanel
            matches={matches}
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

  expect(screen.getByText('P5')).toBeInTheDocument();
  expect(screen.getByText('P6')).toBeInTheDocument();
  expect(screen.getByText('P7')).toBeInTheDocument();
  expect(screen.getByText('P8')).toBeInTheDocument();

  fireEvent.click(screen.getAllByText('vs')[0]);
});
