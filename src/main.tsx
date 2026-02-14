import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initAuth } from '@/app/initAuth/initAuth';
import { setupAuth } from '@/app/providers';
import '@/shared/globalStyles/index.scss';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/providers/router.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

setupAuth();
initAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />

    <ToastContainer
      position={"bottom-right"}
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme={"dark"}
    />
  </StrictMode>,
);
