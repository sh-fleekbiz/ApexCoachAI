import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';

import './index.css';

import { AuthProvider } from './contexts/AuthContext.jsx';
import { PersonalityProvider } from './contexts/PersonalityContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Layout from './pages/layout/Layout.jsx';
import Chat from './pages/chat/Chat.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import SettingsPage from './pages/settings/SettingsPage.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import People from './pages/admin/people/People.tsx';
import Programs from './pages/admin/programs/Programs.tsx';
import ProgramDetails from './pages/admin/programs/ProgramDetails.tsx';
import KnowledgeBase from './pages/admin/knowledge-base/KnowledgeBase.tsx';
import MetaPrompts from './pages/admin/meta-prompts/MetaPrompts.tsx';
import Analytics from './pages/admin/analytics/Analytics.tsx';
import WhiteLabel from './pages/admin/white-label/WhiteLabel.tsx';
import ActionLogs from './pages/admin/action-logs/ActionLogs.tsx';
import { AdminRoute } from './components/AdminRoute.tsx';

initializeIcons();

const router = createHashRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'qa',
        lazy: () => import('./pages/oneshot/OneShot.jsx'),
      },
      {
        path: '*',
        lazy: () => import('./pages/NoPage.jsx'),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Analytics />,
      },
      {
        path: 'people',
        element: <People />,
      },
      {
        path: 'programs',
        element: <Programs />,
      },
      {
        path: 'programs/:id',
        element: <ProgramDetails />,
      },
      {
        path: 'knowledge-base',
        element: <KnowledgeBase />,
      },
      {
        path: 'meta-prompts',
        element: <MetaPrompts />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'white-label',
        element: <WhiteLabel />,
      },
      {
        path: 'action-logs',
        element: <ActionLogs />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <PersonalityProvider>
        <RouterProvider router={router} />
      </PersonalityProvider>
    </AuthProvider>
  </React.StrictMode>,
);
