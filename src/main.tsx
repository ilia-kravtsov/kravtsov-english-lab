import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { initAuth } from '@/app/initAuth/initAuth';
import {setupAuth} from "@/app/providers";

setupAuth();
initAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
