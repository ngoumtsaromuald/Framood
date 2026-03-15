import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';

import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import Studio from '@/pages/Studio';
import Gallery from '@/pages/Gallery';
import Settings from '@/pages/Settings';

const router = createBrowserRouter([
  { path: '/auth', element: <Auth /> },
  { path: '/onboarding', element: <Onboarding /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'studio', element: <Studio /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
