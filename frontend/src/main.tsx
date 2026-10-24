import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { aplicarTemaDom, leerTema } from './core/theme/themeStorage';
import './styles/index.css';
import './styles/charts.css';
import './styles/theme-toggle.css';
import './styles/theme-transition.css';
import './styles/welcome.css';

aplicarTemaDom(leerTema());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
