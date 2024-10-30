import express from 'express'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import i18next from 'i18next'
import I18nBackend from 'i18next-fs-backend'
import I18nMiddleware from 'i18next-http-middleware'

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

const changeLangMiddleware = (req, res, next) => {
  req.i18n.changeLanguage(req.url.split('/')[1])
  next()
}

const renderMiddleware = async (req, res, next) => {
  try {
    serverRender(req, res, next).then()
  } catch (err) {
    console.error('SSR render error, downgrade to CSR...\n', err)
    next()
  }
}

export async function preview () {
  const app = express()

  await i18next
    .use(I18nBackend)
    .use(I18nMiddleware.LanguageDetector)
    .init({
      backend: {
        loadPath: './public/locales/{{lng}}/{{ns}}.json',
      },
      fallbackLng: 'en',
      load: 'languageOnly',
      saveMissing: true
    })

  app.use(I18nMiddleware.handle(i18next))

  app.get('/', renderMiddleware)
  app.get('/about', renderMiddleware)
  app.get('/en*', changeLangMiddleware, renderMiddleware)
  app.get('/ru*', changeLangMiddleware, renderMiddleware)

  app.use(express.static('dist'))

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
}

preview(process.cwd()).then()
