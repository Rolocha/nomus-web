import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import templateLibrary, { templateNames } from 'src/templates'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'
import CardBuilderPreviewLegend from './CardBuilderPreviewLegend'
import { specs } from './copy'
import { CardSpecBaseType } from 'src/apollo/types/globalTypes'

interface Props {
  selectedBaseType: CardSpecBaseType | undefined
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

const BaseStep = ({
  selectedBaseType,
  cardBuilderState,
  updateCardBuilderState,
}: Props) => {
  return (
    <Box height="100%">
      {selectedBaseType === CardSpecBaseType.Custom ||
      selectedBaseType === CardSpecBaseType.Template
        ? {
            [CardSpecBaseType.Custom]: (
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
                  <Link to="mailto:hi@nomus.me">Just ask</Link>, and our design
                  team will get back to you as soon as they have the chance.
                </Text.Body2>
              </Box>
            ),
            [CardSpecBaseType.Template]: (
              <Box pt={4}>
                <Text.SectionSubheader mb="24px">
                  Pick your favorite template to customize
                </Text.SectionSubheader>
                <Text.Body2 mb="24px">
                  You can always come back to this step if the template you've
                  chosen isn't your cup of tea.
                </Text.Body2>
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                  }}
                  gridColumnGap={3}
                  gridRowGap={3}
                >
                  {templateNames.map((templateId) => {
                    const templateDetails = templateLibrary[templateId]
                    return (
                      <Box
                        key={templateId}
                        role="button"
                        onClick={() => {
                          updateCardBuilderState({
                            templateId,
                            currentStep: 'build',
                          })
                        }}
                        cursor="pointer"
                        borderRadius="16px"
                        position="relative"
                        border={
                          cardBuilderState.templateId === templateId
                            ? `3px solid ${colors.blue[500]}`
                            : undefined
                        }
                      >
                        <Image
                          w="100%"
                          src={templateDetails.demoImageUrl}
                          borderRadius="inherit"
                        />
                        <Box
                          position="absolute"
                          textAlign="center"
                          bottom={0}
                          left={0}
                          width="100%"
                          px={2}
                          py={1}
                        >
                          <Text.Body2 color={colors.midnightGray}>
                            {templateDetails.name}
                          </Text.Body2>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            ),
          }[selectedBaseType]
        : null}
    </Box>
  )
}

export default BaseStep
