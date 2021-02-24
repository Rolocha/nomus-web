import { createIcon } from './utils'

export default createIcon({
  displayName: 'StackIcon',
  viewBox: '0 0 24 24',
  path: [
    <path d="M20 4V16H22V2H8V4H20Z" fill="currentColor" />,
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8V22H16V8H2ZM14 10H4V20H14V10Z"
      fill="currentColor"
    />,
    <path d="M17 7H5V5H19V19H17V7Z" fill="currentColor" />,
  ],
})
