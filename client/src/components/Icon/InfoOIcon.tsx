import { colors } from 'src/styles'
import { createIcon } from './utils'

export default createIcon({
  displayName: 'InfoO',
  viewBox: '0 0 24 24',
  defaultProps: {
    fill: 'none',
    color: colors.nomusBlue,
  },
  path: [
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />,
    <path
      d="M12 17L12 11H9.5M12 17H14.5M12 17H9.5M12 8L12 6"
      stroke="currentColor"
      strokeWidth="2"
    />,
  ],
})
