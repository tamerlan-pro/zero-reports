import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LicenseInfo } from '@mui/x-license';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './i18n';
import './index.css';
import App from './App';

const muiLicenseKey = import.meta.env.VITE_MUI_LICENSE_KEY as string | undefined;
if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found. Make sure #root exists in index.html.');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
