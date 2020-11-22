import * as React from 'react'
import Box from 'src/components/Box'
import Spinner from 'src/components/Spinner'

interface Props {
  className?: string
  fullscreen?: boolean
}

export default ({ className, fullscreen }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width={`100${fullscreen ? 'vw' : '%'}`}
      height={`100${fullscreen ? 'vh' : '%'}`}
      className={className}
    >
      <Spinner />
    </Box>
  )
}
