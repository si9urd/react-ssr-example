// @ts-ignore
import type * as express from 'express'
import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import {createStaticHandler, createStaticRouter, StaticRouterProvider} from 'react-router-dom/server'
import {I18nextProvider} from "react-i18next";
import routes from './routes'

export async function render(req: express.Request, res: express.Response) {
  const { query, dataRoutes } = createStaticHandler(routes)
  const remixRequest = createFetchRequest(req, res)
  const context = await query(remixRequest)

  if (context instanceof Response) {
    throw context
  }

  const router = createStaticRouter(dataRoutes, context)

  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <I18nextProvider i18n={req.i18n}>
        <StaticRouterProvider
          router={router}
          context={context}
          nonce="the-nonce"
        />
      </I18nextProvider>
    </React.StrictMode>
  )
}

export function createFetchRequest(req: express.Request, res: express.Response): Request {
  const origin = `${req.protocol}://${req.get('host')}`
  const url = new URL(req.originalUrl || req.url, origin)

  const controller = new AbortController()
  res.on('close', () => controller.abort())

  const headers = new Headers()

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, JSON.stringify(values))
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body
  }

  return new Request(url.href, init)
}
