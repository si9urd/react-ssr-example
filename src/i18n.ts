import i18n from 'i18next'
import I18nBackend from 'i18next-http-backend'
import {initReactI18next} from 'react-i18next'

const i18nOptions = {
  fallbackLng: 'en',
  debug: false,
}

i18n.use(I18nBackend).use(initReactI18next).init(i18nOptions)

export default i18n
