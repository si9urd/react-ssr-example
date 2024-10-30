import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './routes'
import {I18nextProvider} from "react-i18next";
import i18n from './i18n.ts'

const router = createBrowserRouter(routes)

hydrateRoot(document.getElementById('root')!,
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </React.StrictMode>
)
