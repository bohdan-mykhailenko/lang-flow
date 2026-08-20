import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from './components/ui/provider.js';
import { App } from './App.js';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <Provider>
        <App />
      </Provider>
    </StrictMode>,
  );
}
