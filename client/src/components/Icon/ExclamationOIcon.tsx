import { createIcon } from './utils'

export default createIcon({
  displayName: 'ExclamationOIcon',
  viewBox: '0 0 24 24',
  defaultProps: {
    fill: 'none',
  },
  path: [
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />,
    <path d="M12 14.5V6M12 16V18" stroke="currentColor" strokeWidth="2" />,
  ],
})
