import * as React from 'react'
import templates from 'src/templates'
import { TemplateID, TemplateOptionsType } from 'src/templates'
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
  const isRenderingRef = React.useRef<boolean>(false)

  const updateCard = React.useCallback(
    async (canvas: HTMLCanvasElement) => {
      const template = templates[templateId]

      if (isRenderingRef.current) return

      isRenderingRef.current = true
      if (side === 'front') {
        // TOFIX: This error is a result of a very hairy ts bug
        // https://www.notion.so/nomus/Fix-TS-error-on-card-template-extractGeneric-Union-Types-68c023b182a84873a84d0d1f3421cdea
        // @ts-expect-error
        await template.renderFrontToCanvas(canvas, options)
      } else if (side === 'back') {
        // @ts-expect-error
        await template.renderBackToCanvas(canvas, options)
      }
      isRenderingRef.current = false
      template.drawBorder(canvas.getContext('2d')!)
      if (showGuides) {
        template.drawInnerBleed(canvas.getContext('2d')!)
      }
    },
    [options, side, templateId, showGuides, isRenderingRef],
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
