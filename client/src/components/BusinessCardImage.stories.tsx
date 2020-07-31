import React from 'react'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'

export default {
  title: 'BusinessCardImage',
  component: BusinessCardImage,
  excludeStories: /.*Data$/,
}

export const Primary = () => {
  return (
    <Box>
      <BusinessCardImage
        frontImageUrl="https://user-images.githubusercontent.com/8083680/82718034-d8667280-9c54-11ea-8c71-62f6e08abcd6.png"
        backImageUrl="https://user-images.githubusercontent.com/8083680/82718033-d7cddc00-9c54-11ea-87ac-cd336305e37f.png"
        width="300px"
      />
    </Box>
  )
}