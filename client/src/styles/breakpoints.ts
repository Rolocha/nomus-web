import * as React from 'react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

// Unfortunately, I couldn't figure out how to type an array that would also allow string indexes so I'm typing it as any for now
const breakpoints: any = ['20em', '38em', '64em', '80em']
const mq: any = breakpoints.map((bp: any) => `@media (min-width: ${bp})`)

const breakpointMap = {
  sm: breakpoints[0],
  md: breakpoints[1],
  lg: breakpoints[2],
  xl: breakpoints[3],
}

// Export Chakra breakpoints too so that our icons accept responsive styles
export const chakraBreakpoints = createBreakpoints(breakpointMap)
;(Object.keys(breakpointMap) as Array<keyof typeof breakpointMap>).forEach(
  (key) => {
    // Create breakpoint aliases for the styled-system theme object
    breakpoints[key] = breakpointMap[key]
    mq[key] = breakpointMap[key]
  },
)

export { mq, breakpoints as default }

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
