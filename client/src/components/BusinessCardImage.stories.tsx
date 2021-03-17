import React from 'react'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'

export default {
  title: 'components/BusinessCardImage',
  component: BusinessCardImage,
  excludeStories: /.*Data$/,
}

export const Primary = () => {
  return (
    <Box>
      <BusinessCardImage
        frontImageUrl="https://placehold.it/500x300"
        backImageUrl="https://placehold.it/550x330"
        width="300px"
      />
    </Box>
  )
}
