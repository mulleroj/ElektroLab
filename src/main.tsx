import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { validateAllLessons } from './lib/validateAllLessons';
import './index.css';

validateAllLessons();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
