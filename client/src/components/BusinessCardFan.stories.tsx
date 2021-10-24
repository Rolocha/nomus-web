import React from 'react'
import Box from 'src/components/Box'
import BusinessCardFan from 'src/components/BusinessCardFan'

export default {
  title: 'components/BusinessCardFan',
  component: BusinessCardFan,
  excludeStories: /.*Data$/,
}

export const Primary = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="400px 400px 400px"
      gridColumnGap="16px"
    >
      <BusinessCardFan
        frontImageUrl="https://nomus-assets.s3.amazonaws.com/card-versions/cardv_6153ef94d2b56002265e6a84/front/1632890782277.png"
        backImageUrl="https://nomus-assets.s3.amazonaws.com/card-versions/cardv_6153ef94d2b56002265e6a84/back/1632890783439.png"
      />
      <BusinessCardFan
        frontImageUrl="https://nomus-assets.s3.amazonaws.com/card-versions/cardv_60ae1754821500001c8f7683/front"
        backImageUrl="https://nomus-assets.s3.amazonaws.com/card-versions/cardv_60ae1754821500001c8f7683/back"
      />
      <BusinessCardFan
        frontImageUrl={null}
        backImageUrl={null}
        showPlaceholderIfMissing
      />
    </Box>
  )
}
