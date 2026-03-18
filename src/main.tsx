import '@/shared/global-styles/index.scss';
import 'react-toastify/dist/ReactToastify.css';

import { Profiler, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { initAuthApp } from '@/app/init-auth/init-auth-app';
import { router } from '@/app/providers/router';
import { appProfilerOnRender } from '@/shared/lib/react-profiler';

initAuthApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Profiler id={'AppRoot'} onRender={appProfilerOnRender}>
      <RouterProvider router={router} />

      <ToastContainer
        position={'bottom-right'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={'dark'}
      />
    </Profiler>
  </StrictMode>,
);
