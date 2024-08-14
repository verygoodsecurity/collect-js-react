import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { VGSCollectProvider } from 'collect-js-react';

ReactDOM.render(
  <VGSCollectProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </VGSCollectProvider>,
  document.getElementById('root')
);
