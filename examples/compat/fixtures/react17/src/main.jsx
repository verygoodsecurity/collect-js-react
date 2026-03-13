import React from 'react';
import ReactDOM from 'react-dom';
import { CompatApp } from '../../../shared/App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('React 17 fixture root container not found.');
}

ReactDOM.render(<CompatApp title='React 17 compatibility fixture' />, container);
