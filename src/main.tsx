import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/ui/App.tsx';
import { initAuth } from '@/app/initAuth/initAuth';
import {setupAuth} from "@/app/providers";
import '@/shared/globalStyles/index.scss';

setupAuth();
initAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
