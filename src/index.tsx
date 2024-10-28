import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './routes'

const router = createBrowserRouter(routes)

hydrateRoot(document.getElementById('root')!,
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
