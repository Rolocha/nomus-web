import LandingPage from 'pages/LandingPage'
import ProfilePage from 'pages/ProfilePage'
import LoginPage from 'pages/LoginPage'

interface PageType {
  name: string
  path: string
  exact?: boolean
  component: () => JSX.Element
  requireLogin?: boolean
}

const pages: Array<PageType> = [
  {
    name: 'landing',
    exact: true,
    path: '/',
    component: LandingPage,
    requireLogin: false,
  },
  { name: 'login', exact: true, path: '/login', component: LoginPage },
  {
    name: 'profile',
    exact: true,
    path: '/profile',
    component: ProfilePage,
    requireLogin: true,
  },
]

export default pages
