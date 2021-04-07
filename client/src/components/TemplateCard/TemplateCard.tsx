import * as React from 'react'
import templates from 'src/templates'
import {
  TemplateID,
  TemplateOptionsType,
} from 'src/components/TemplateCard/types'
import shadows from 'src/styles/shadows'

interface Props<T extends TemplateID> {
  templateId: T
  side: 'front' | 'back'
  width?: string
  maxWidth?: string
  shadow?: boolean
  showGuides?: boolean
  options: TemplateOptionsType<T>
}

function TemplateCard<T extends TemplateID>({
  templateId,
  side,
  shadow,
  width,
  maxWidth,
  options,
  showGuides,
}: Props<T>) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const updateCard = React.useCallback(
    async (canvas: HTMLCanvasElement) => {
      const template = templates[templateId]

      if (side === 'front') {
        await template.renderFront(canvas, options)
      } else if (side === 'back') {
        await template.renderBack(canvas, options)
      }
      template.drawBorder(canvas.getContext('2d')!)
      if (showGuides) {
        template.drawInnerBleed(canvas.getContext('2d')!)
      }
    },
    [options, side, templateId, showGuides],
  )

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    updateCard(canvas)
  }, [updateCard])

  return (
    <canvas
      style={{
        boxShadow: shadow ? shadows.businessCard : undefined,
        width: width ?? undefined,
        maxWidth: maxWidth ?? undefined,
      }}
      ref={canvasRef}
    />
  )
}

export default TemplateCard
