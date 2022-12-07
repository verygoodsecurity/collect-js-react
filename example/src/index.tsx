import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import {VGS} from "collect-js-react";

ReactDOM.render(
  <VGS>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </VGS>,
  document.getElementById('root')
);
