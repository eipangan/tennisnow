import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import { EventType, getNewEvent } from '../event/Event';
import { CompetitorStats } from '../player/Player';
import { theme } from '../utils/Theme';
import Team, { TeamType } from './Team';

const app: AppContextType = {
  events: {
    add: (event: EventType): boolean => true,
    get: (eventID: string | undefined): EventType | undefined => undefined,
    update: (event: EventType): boolean => true,
    remove: (eventID: string | undefined): boolean => true,
  },
  event: getNewEvent(),
  setEvent: () => { },
  isSettingsVisible: false,
  setIsSettingsVisible: () => { },
};

test('renders without crashing', async () => {
  const team: TeamType = {
    teamID: String(1),
    playerIDs: [String(1), String(2)],
    stats: new CompetitorStats(),
  };

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <Team team={team} />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
});
