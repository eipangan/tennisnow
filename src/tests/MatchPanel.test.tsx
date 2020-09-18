import { act, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import useEvent from '../hooks/useEvent';
import MatchPanel from '../MatchPanel';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

DataStore.save = jest.fn().mockImplementation(() => ({
}));

test('render new without crashing', async () => {
  const { result } = renderHook(() => useEvent());
  const { current } = result;
  const { event } = current;

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
