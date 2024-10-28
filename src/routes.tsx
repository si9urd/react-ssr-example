import App from './App.tsx'
import Home from './components/Home.tsx'
import About from './components/About.tsx'

const routes = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      }
    ]
  }
]

export default routes
