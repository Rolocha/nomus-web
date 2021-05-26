import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Icon from 'src/components/Icon'
import { colors } from 'src/styles'
import { useBreakpoint } from 'src/styles/breakpoints'
import CardBuilderPreviewLegend from './CardBuilderPreviewLegend'

type SideRenderer = (opts: { showGuides: boolean }) => React.ReactNode

interface Props {
  cardOrientation?: 'horizontal' | 'vertical'
  renderFront: SideRenderer | null
  renderBack: SideRenderer | null
}

const CardBuilderPreview = ({
  cardOrientation = 'horizontal',
  renderFront,
  renderBack,
}: Props) => {
  const missingBothImages = renderBack == null && renderFront == null
  const missingAtLeastOneImage = renderBack == null || renderFront == null

  const [showGuides, setShowGuides] = React.useState(false)
  const [showBack, setShowBack] = React.useState(false)
  const [showBothSides, setShowBothSides] = React.useState(true)

  const backSide = renderBack ? renderBack({ showGuides }) : null
  const frontSide = renderFront ? renderFront({ showGuides }) : null
  const isLgBp = useBreakpoint('lg')

  return (
    <Box display="grid" gridTemplateRows="auto 1fr auto">
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr 1fr', lg: '2fr 1fr 3fr 2fr' }}
        gridTemplateAreas={{
          base: `
            "guideToggle whichSideToggle"
            "bothSidesToggle bothSidesToggle"
          `,
          lg: `
            "guideToggle . bothSidesToggle whichSideToggle"
          `,
        }}
        gridTemplateRows="auto"
        gridGap={{ base: '8px', lg: '16px' }}
        mb={3}
      >
        <Button
          gridArea="guideToggle"
          variant="secondary"
          disabled={missingBothImages}
          onClick={() => setShowGuides(!showGuides)}
          leftIcon={
            <Icon
              of="ruler"
              color={colors.nomusBlue}
              mr={{ base: '-0.5rem', lg: 0 }}
            />
          }
          children={
            isLgBp ? `${showGuides ? 'Hide' : 'Show'} guides` : undefined
          }
        />
        <Button
          gridArea="bothSidesToggle"
          variant="secondary"
          disabled={missingAtLeastOneImage}
          onClick={() => setShowBothSides(!showBothSides)}
          leftIcon={<Icon of="switchSides" color={colors.nomusBlue} />}
          children={`${showBothSides ? 'Show one side' : 'Show both sides'}`}
        />
        <Button
          gridArea="whichSideToggle"
          variant="secondary"
          disabled={missingBothImages || showBothSides}
          onClick={() => setShowBack(!showBack)}
          leftIcon={
            <Icon
              of="sync"
              color={colors.nomusBlue}
              mr={{ base: '-0.5rem', lg: 0 }}
            />
          }
          children={isLgBp ? `Show ${showBack ? 'front' : 'back'}` : undefined}
        />
      </Box>

      <Box
        placeSelf="center center"
        width="100%"
        display="grid"
        gridTemplateColumns={
          showBothSides
            ? { vertical: '1fr 1fr', horizontal: '1fr' }[cardOrientation]
            : '1fr'
        }
        gridColumnGap={2}
        gridRowGap={2}
        sx={{
          '& > canvas': {
            placeSelf: 'center',
            width: '100%',
          },
        }}
      >
        {(!showBack || showBothSides) && frontSide}
        {(showBack || showBothSides) && backSide}
      </Box>

      {showGuides ? (
        <Box
          display="grid"
          gridTemplateColumns="1fr 6fr 1fr"
          mt={4}
          width="100%"
          placeSelf="end center"
        >
          <Box gridColumn={{ base: '1/4', lg: '2/3' }}>
            <CardBuilderPreviewLegend />
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

export default CardBuilderPreview
