import { rgba } from 'polished'
import * as React from 'react'
import { specMeasurements } from 'src/pages/CardBuilder/config'
import { colors } from 'src/styles'
import { getImageDimensions } from 'src/utils/image'

interface CardWithGuidesProps {
  showGuides: boolean
  cardImageUrl: string
  className?: string
}

const CardWithGuides = ({
  className,
  showGuides,
  cardImageUrl,
}: CardWithGuidesProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const drawCard = React.useCallback(async () => {
    // Draw the image onto a canvas each time it changes or we toggle showGuides
    const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
    const xBleedPct = xBleed / cardWidth
    const yBleedPct = yBleed / cardHeight

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')!

      const cardDimensions = await getImageDimensions(cardImageUrl)

      const actualXBleed = cardDimensions.width * xBleedPct
      const actualYBleed = cardDimensions.height * yBleedPct

      canvas.width = cardDimensions.width
      canvas.height = cardDimensions.height

      if (showGuides) {
        // Draw outer bleed
        const outerBleedWidth = cardDimensions.width + actualXBleed * 2
        const outerBleedHeight = cardDimensions.height + actualYBleed * 2
        // Update canvas dimensions to include bleed
        canvas.width = outerBleedWidth
        canvas.height = outerBleedHeight

        context.fillStyle = rgba(colors.gold, 0.5)
        context.fillRect(0, 0, outerBleedWidth, outerBleedHeight)
      }

      // Draw the card itself
      const image = document.createElement('img')

      image.src = cardImageUrl
      image.addEventListener('load', () => {
        context.drawImage(
          image,
          showGuides ? actualXBleed : 0,
          showGuides ? actualYBleed : 0,
          cardDimensions.width,
          cardDimensions.height,
        )

        // Draw card border, regardless of guides
        context.strokeStyle = 'black'
        context.lineWidth = 2
        context.strokeRect(
          showGuides ? actualXBleed : 0,
          showGuides ? actualYBleed : 0,
          cardDimensions.width,
          cardDimensions.height,
        )
        // Draw inner bleed; must be done inside this event listener
        //  since it needs to be drawn over the card image
        if (showGuides) {
          const innerBleedWidth = cardDimensions.width - actualXBleed * 2
          const innerBleedHeight = cardDimensions.height - actualYBleed * 2

          context.strokeStyle = colors.brightCoral
          context.setLineDash([6])
          context.strokeRect(
            actualXBleed * 2,
            actualYBleed * 2,
            innerBleedWidth,
            innerBleedHeight,
          )
        }
      })
    }
  }, [cardImageUrl, showGuides])

  React.useEffect(() => {
    drawCard()
  }, [drawCard])

  return (
    <canvas
      className={className}
      ref={canvasRef}
      style={{ height: '100%', maxWidth: '100%' }}
    />
  )
}

export default CardWithGuides
