import React from 'react';
import { createRoot } from 'react-dom/client';
import { CompatApp } from '../../../shared/App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('React 19 fixture root container not found.');
}

createRoot(container).render(<CompatApp title='React 19 compatibility fixture' />);
