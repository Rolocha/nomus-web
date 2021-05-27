import { css } from '@emotion/react'
import Box from 'src/components/Box'
import TemplateCard from 'src/components/TemplateCard'
import { TemplateID } from 'src/templates'
import { CardTemplateRenderOptions } from 'src/templates/base'

interface Props {
  templateId: TemplateID
  options: CardTemplateRenderOptions
}

const MiniCardBuilder = ({ templateId, options }: Props) => {
  return (
    <Box
      // Give a little bit more room on top/left for the rotated/translated back card.
      // These are pretty wildly guessed values that seem to work pretty well but it
      // might be possible to do some more precise calculation for a stronger guarantee...
      //
      // Percentage-based margins are calculated relative to the width of the container
      // So whereever we have '100%' and `w` (the width of the card) are ~interchangeable
      // The expression we want is:
      //   w•sin(θ) + verticalOffset
      // where
      //   - θ = 8º
      //   - sin(θ) = 0.139...
      //   - verticalOffset = 34% of card height = (34% of card width) * (h:144/w:252)
      //     because the 34% we use in the y-translation is height-based so we need to
      //     convert it to be width-based
      mt="calc(calc(calc(100% * 0.13917310096)) + calc(34% * calc(144/252)))"
      ml="10%"
      position="relative"
    >
      {/* Back card wrapper */}
      <Box
        boxShadow="businessCard"
        borderRadius={2}
        css={css`
          canvas {
            border-radius: inherit;
          }
        `}
        position="absolute"
        top={0}
        left={0}
        zIndex={0}
        transformOrigin="top left"
        transform="translate(-17%, -34%) rotateZ(-8deg)"
      >
        <TemplateCard
          side="back"
          width="100%"
          templateId={templateId}
          options={options}
        />
      </Box>
      {/* Front card wrapper */}
      <Box
        boxShadow="businessCard"
        borderRadius={2}
        position="relative"
        zIndex={1}
        css={css`
          canvas {
            border-radius: inherit;
          }
        `}
      >
        <TemplateCard
          side="front"
          width="100%"
          templateId={templateId}
          options={options}
        />
      </Box>
    </Box>
  )
}

export default MiniCardBuilder
