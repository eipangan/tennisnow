import { act, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';

const App = React.lazy(() => import('../App'));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
    i18n: {
      language: 'en',
      changeLanguage: (lng: string) => { },
    },
  }),
}));

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Suspense fallback="loading...">
        <App />
      </Suspense>,
    );
  });

  expect(screen.getByText('loading...')).toBeInTheDocument();
});
