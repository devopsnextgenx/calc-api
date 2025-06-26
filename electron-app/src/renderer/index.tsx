import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/dark-theme.css';

const container = document.getElementById('root');
const root = createRoot(container!);

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

renderApp();

// Enable HMR in development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/App', () => {
    renderApp();
  });
}