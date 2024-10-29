import App from './App.tsx'
import Home from './components/Home.tsx'
import About from './components/About.tsx'

const childRoutes = [
  {
    element: <Home/>,
    index: true,
  },
  {
    path: 'about',
    element: <About/>,
  },
]

const routes = [
  {
    path: '/',
    element: <App lang="en"/>,
    children: childRoutes
  },
  {
    path: '/en',
    element: <App lang="en"/>,
    children: childRoutes
  },
  {
    path: '/ru',
    element: <App lang="ru"/>,
    children: childRoutes
  }
]

export default routes
