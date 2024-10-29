import express from 'express'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import i18next from 'i18next'
import i18nextMiddleware from 'i18next-http-middleware'
import ts from 'typescript-eslint'

const require = createRequire(import.meta.url)

const serverRender = async (req, res) => {
  const remotesPath = path.join(process.cwd(), `./dist/server/index.js`)

  const importedApp = require(remotesPath)

  const markup = await importedApp.render(req, res)

  const template = fs.readFileSync(`${process.cwd()}/dist/index.html`, 'utf-8')

  const html = template.replace(`<!--app-content-->`, markup)

  res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
}

const port = process.env.PORT || 3000
const renderMiddleware = async (req, res, next) => {
  try {
    const lng = req.language
    const lngs = req.languages
    // await req.i18n.changeLanguage('ru')

    const exists = req.i18n.exists('about')

    console.log('>>>>', lng, lngs, exists)

    serverRender(req, res, next).then()
  } catch (err) {
    console.error('SSR render error, downgrade to CSR...\n', err)
    next()
  }
}

export async function preview () {
  const app = express()

  await i18next.use(i18nextMiddleware.LanguageDetector).init({
    preload: ['en', 'ru'],
  })
  app.use(i18nextMiddleware.handle(i18next, { removeLngFromUrl: false }))

  app.get('/', renderMiddleware)
  app.get('/about', renderMiddleware)
  app.get('/en*', renderMiddleware)
  app.get('/ru*', renderMiddleware)

  app.use(express.static('dist'))

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
}

preview(process.cwd())
