import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { router } from './Router/Router.jsx'
import AuthProvider from './provider/AuthProvider.jsx'
import UserInfoProvider from './provider/UserInfoProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserInfoProvider>
          <RouterProvider router={router}></RouterProvider>
        </UserInfoProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
