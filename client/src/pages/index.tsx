import LandingPage from 'pages/LandingPage'
import ProfilePage from 'pages/ProfilePage'
import LoginPage from 'pages/LoginPage'
import ContactInfoPage from 'pages/ContactInfoPage'

interface PageType {
  name: string
  path: string
  exact?: boolean // default is false
  component: (...args: any) => JSX.Element | null
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
  {
    name: 'login',
    exact: true,
    path: '/login',
    component: LoginPage,
    requireLogin: false,
  },
  {
    name: 'profile',
    exact: true,
    path: '/profile',
    component: ProfilePage,
    requireLogin: true,
  },
  {
    name: 'contact info',
    path: '/u/:username/:cardNameOrId?',
    component: ContactInfoPage,
    requireLogin: false,
  },
]

export default pages
