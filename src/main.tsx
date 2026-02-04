import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {initAuth} from '@/app/initAuth/initAuth';
import {setupAuth} from "@/app/providers";
import '@/shared/globalStyles/index.scss';
import {RouterProvider} from "react-router-dom";
import {router} from "@/app/providers/router.tsx";

setupAuth();
initAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
