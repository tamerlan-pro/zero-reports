import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LicenseInfo } from '@mui/x-license';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';
import App from './App';

LicenseInfo.setLicenseKey(
  '794a35ce677975ddc05a05f5706d1d3dTz0xMjUyMzgsRT0xODAxNzg1NTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1RMy0yMDI0LEtWPTI=',
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
