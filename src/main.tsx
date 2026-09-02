import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from './App.tsx'

import '@marcomattes/epaper-components';
import '@marcomattes/epaper-components/styles/tokens.css';
import '@marcomattes/epaper-components/styles/base.css';
import '@marcomattes/epaper-components/styles/components.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
