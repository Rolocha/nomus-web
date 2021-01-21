import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import Accordion from 'src/components/Accordion'

const AccordionDemo = () => {
  return (
    <Box container mt={5}>
      <Accordion title="How does Nomus work?">
        <Text.Body2>
          Build up your public profile and create your business card right on
          the Nomus Card Builder. After you've placed your order, we'll send you
          your pack of custom business cards, each with an NFC chip embedded
          inside. When you open up your package, you'll see instructions on how
          to set up your cards, or you can find set-up instructions right on the
          site. As soon as you link your card to your digital profile, you're
          ready to start tapping away, sharing your profile and adding contacts
          to Nomus.
        </Text.Body2>
        <Text.Body2>
          Learn more about managing your contacts and tracking engagement on our
          Products page. Or learn more about Nomus and our story on our About
          page.
        </Text.Body2>
      </Accordion>
    </Box>
  )
}

export default AccordionDemo
