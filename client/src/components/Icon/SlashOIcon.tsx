import { createIcon } from './utils'

export default createIcon({
  displayName: 'SlashO',
  viewBox: '0 0 24 24',
  defaultProps: {
    fill: 'none',
  },
  path: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 16L16 8" stroke="currentColor" strokeWidth="2" />
    </>
  ),
})
