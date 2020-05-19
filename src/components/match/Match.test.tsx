import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../AppContext';
import { EventType, getNewEvent } from '../event/Event';
import { theme } from '../utils/Theme';
import Match, { MatchStatus, MatchType } from './Match';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const app: AppContextType = {
  events: {
    add: (event: EventType): boolean => true,
    get: (eventID: string | undefined): EventType | undefined => undefined,
    update: (event: EventType): boolean => true,
    remove: (eventID: string | undefined): boolean => true,
  },
  event: getNewEvent(),
  setEvent: () => { },
  isEventSettingsVisible: false,
  setIsEventSettingsVisible: () => { },
  isUserSettingsVisible: false,
  setIsUserSettingsVisible: () => { },
};

const match: MatchType = {
  matchID: String(0),
  teamIDs: [String(1), String(2)],
  status: MatchStatus.New,
};

test('render new without crashing', async () => {
  match.status = MatchStatus.New;
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <Match
              match={match}
              onUpdate={() => {}}
            />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('1')).toHaveLength(2);
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('vs')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('render draw without crashing', async () => {
  match.status = MatchStatus.Draw;
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <Match
              match={match}
              onUpdate={() => {}}
            />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('1')).toHaveLength(2);
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('draw')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('render team1won without crashing', async () => {
  match.status = MatchStatus.Team1Won;
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <Match
              match={match}
              onUpdate={() => {}}
            />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('1')).toHaveLength(2);
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('draw')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('render team1won without crashing', async () => {
  match.status = MatchStatus.Team2Won;
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <Match
              match={match}
              onUpdate={() => {}}
            />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('1')).toHaveLength(2);
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('draw')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});
