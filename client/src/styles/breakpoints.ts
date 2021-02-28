import * as React from 'react'

// Unfortunately, I couldn't figure out how to type an array that would also allow string indexes so I'm typing it as any for now
// const breakpoints: any = ['20em', '38em', '64em', '80em']
const makeMediaQuery = (bp: string) => `@media (min-width: ${bp})`

export const breakpoints = {
  sm: '20em',
  md: '38em',
  lg: '64em',
  xl: '80em',
}

export const mq = {
  sm: makeMediaQuery(breakpoints.sm),
  md: makeMediaQuery(breakpoints.md),
  lg: makeMediaQuery(breakpoints.lg),
  xl: makeMediaQuery(breakpoints.xl),
}

export const useBreakpoint = (bp: 'sm' | 'md' | 'lg') => {
  const matcher = window.matchMedia(mq[bp].replace('@media ', ''))
  const [matches, setMatches] = React.useState(matcher.matches)
  React.useEffect(() => {
    matcher.addEventListener('change', (e) => {
      if (e.matches) {
        setMatches(true)
      } else {
        setMatches(false)
      }
    })
  }, [matcher])
  return matches
}

export default breakpoints
