import {Link, Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";
import './i18n'
import './index.css'

function App() {
  const {i18n} = useTranslation()

  return (
    <div className="page">
      <header>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <ul>
          <li onClick={() => switchLang('en')}><a>EN</a></li>
          <li onClick={() => switchLang('ru')}><a>RU</a></li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )

  function switchLang(lang: string) {
    i18n.changeLanguage(lang)
  }
}

export default App
