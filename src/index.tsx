import Amplify from 'aws-amplify';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import awsconfig from './aws-exports';
import { theme } from './components/utils/Theme';
import './i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';

const App = React.lazy(() => import('./App'));

// initialize amplify
if (awsconfig.oauth.domain.includes('master')) {
  awsconfig.oauth.domain = 'auth.tennisnow.net';
}
awsconfig.oauth.redirectSignIn = `${window.location.origin}/`;
awsconfig.oauth.redirectSignOut = `${window.location.origin}/`;
Amplify.configure(awsconfig);

// render App
ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Suspense fallback={<div className="loader" />}>
        <App />
      </Suspense>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    interface ServiceWorkerEvent extends Event {
      target: Partial<ServiceWorker> & EventTarget | null;
    }

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener(
        'statechange',
        (event: ServiceWorkerEvent) => {
          if (event.target && event.target.state === 'activated') {
            window.location.reload();
          }
        },
      );
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});
