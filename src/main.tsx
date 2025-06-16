import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import * as Sentry from "@sentry/react";

// Sentry.init({
//   dsn: "https://e5fb7034ae7e310489ea7b5cdbacc866@o4507351468736512.ingest.de.sentry.io/4507351472996432",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration(),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["localhost", /^https:\/\/hpi\.sabacloud\.com\.Saba\/api/],
//   // Session Replay
//   replaysSessionSampleRate: 0.01, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const ro = new ResizeObserver((entries) => {
  const workspaceRoot = window.parent.document.querySelector(
    '#workspace'
  ) as HTMLElement;

  if (workspaceRoot) {
    if (entries[0] && entries[0].target instanceof HTMLElement) {
      workspaceRoot.style.height = '100vw';
      
    }
  }
});

ro.observe(document.getElementById('root') as HTMLElement);
