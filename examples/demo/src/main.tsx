import './index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { VGSCollectProvider } from '@vgs/collect-js-react';

const container = document.getElementById('root');

if (!container) {
  throw new Error('React root container not found.');
}

createRoot(container).render(
  <VGSCollectProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </VGSCollectProvider>
);
