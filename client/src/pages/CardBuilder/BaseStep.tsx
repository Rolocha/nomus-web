import { css } from '@emotion/core'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { ExternalLink } from 'src/components/Link'
import SegmentedController, {
  TabActionType,
} from 'src/components/SegmentedController'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { specs } from './copy'
import { CardBuilderAction, CardBuilderState } from './reducer'
import CardBuilderPreviewLegend from './CardBuilderPreviewLegend'

interface Props {
  selectedBaseType: string | undefined
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

const BaseStep = ({ selectedBaseType, updateCardBuilderState }: Props) => {
  return (
    <Box overflowY="scroll" height="100%" p={{ _: '24px', md: '48px' }}>
      {selectedBaseType === 'custom' || selectedBaseType === 'template'
        ? {
            custom: (
              <Box
                pt={4}
                display="grid"
                gridTemplateColumns="1fr 1fr"
                gridColumnGap={3}
                gridRowGap={3}
                pb={4}
              >
                <Box>
                  <Image w="100%" src="https://placehold.it/700x400" />
                </Box>

                <Box>
                  <Text.SectionSubheader mb={2}>
                    First, some specifications
                  </Text.SectionSubheader>
                  <Text.Body2 mb={2}>
                    We want your design to be as beautiful as it’s meant to be.
                    Here are some guidelines to follow:
                  </Text.Body2>
                  <Box
                    display="grid"
                    gridTemplateColumns="1fr 2fr"
                    gridRowGap={2}
                  >
                    {specs.map((specLine) => [
                      <Text.Body2>{specLine[0]}</Text.Body2>,
                      <Text.Body2>{specLine[1]}</Text.Body2>,
                    ])}
                  </Box>
                </Box>

                <CardBuilderPreviewLegend />

                <Text.Body2>
                  Have any questions?{' '}
                  <ExternalLink href="mailto:hi@nomus.me">
                    Just ask
                  </ExternalLink>
                  , and our design team will get back to you as soon as they
                  have the chance.
                </Text.Body2>
              </Box>
            ),
            template: (
              <Box pt={4}>
                <Text.SectionSubheader mb={2}>
                  Pick your favorite template to customize
                </Text.SectionSubheader>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(4, 1fr)"
                  gridColumnGap={3}
                  gridRowGap={3}
                >
                  {Array(8)
                    .fill(null)
                    .map(() => (
                      <Box>
                        <Image w="100%" src="https://placehold.it/700x400" />
                      </Box>
                    ))}
                </Box>
              </Box>
            ),
          }[selectedBaseType]
        : null}
    </Box>
  )
}

export default BaseStep
