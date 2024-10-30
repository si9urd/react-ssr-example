import {useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";
import './index.scss'

function App({lang}: { lang: string }) {
  const {i18n} = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(lang).then()
  }, [i18n, lang]);

  return (
    <div className="page">
      <header>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <ul>
          <li onClick={() => switchLang('en')}><Link to="/en">EN</Link></li>
          <li onClick={() => switchLang('ru')}><Link to="/ru">RU</Link></li>
        </ul>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  )

  function switchLang(lang: string) {
    i18n.changeLanguage(lang).then()
  }
}

export default App
