import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

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
  render(
    <BrowserRouter>
      <Suspense fallback="loading...">
        <App />
      </Suspense>
    </BrowserRouter>,
  );

  expect(screen.getByText('loading...')).toBeInTheDocument();
});
