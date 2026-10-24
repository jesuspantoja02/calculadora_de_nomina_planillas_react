import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthContext';
import { ThemeProvider } from './core/theme/ThemeContext';
import { ToastContainer, ToastProvider } from './core/notifications/ToastContext';
import { router } from './routes';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<div className="panel empty m-4">Cargando…</div>}>
            <RouterProvider router={router} />
          </Suspense>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
