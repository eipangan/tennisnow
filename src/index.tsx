import { Amplify } from 'aws-amplify';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import awsconfig from './aws-exports';
import './i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { theme } from './Theme';

const App = React.lazy(() => import('./App'));

// initialize amplify
Amplify.configure(awsconfig);

// render App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Suspense fallback={<div className="loader" />}>
      <App />
    </Suspense>
  </ThemeProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
