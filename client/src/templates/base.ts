import QRCode from 'qrcode'
import { specMeasurements } from 'src/pages/CardBuilder/config'
import { colors } from 'src/styles'
import {
  createNFCTapIconSVG,
  createNomusLogoSVG,
  RGBA_REGEX,
  rgb2hex,
} from './utils'

// The scaling factor for how much we increase the resolution
// of the template cards when rendered - might make sense to
// move this to TemplateCard
const RESOLUTION_FACTOR = 5

export interface GenericCustomizableFieldSpec<T> {
  type: 'text' | 'color' | 'image' | 'range'
  label?: string
  placeholder?: string
  required?: boolean
  defaultValue?: any
  hidden?: (options: T) => boolean
}

export interface CustomizableRangeFieldSpec<T>
  extends GenericCustomizableFieldSpec<T> {
  type: 'range'
  range: {
    min: number
    max: number
    step: number
  }
}

export type CustomizableFieldSpec<T> =
  | CustomizableRangeFieldSpec<T>
  | GenericCustomizableFieldSpec<T>

export interface CardTemplateDefinition<T> {
  name: string
  width: number
  height: number
  demoImageUrl: string
  customizableOptions: Record<keyof T, CustomizableFieldSpec<T>>
  renderFront: (canvas: HTMLCanvasElement, options: T) => void | Promise<void>
  renderBack: (canvas: HTMLCanvasElement, options: T) => void | Promise<void>
}

interface RenderResponse {
  isComplete: boolean
}

// Instances of CardTemplate represent specific templates that we offer
// e.g.
// const VeliaTemplate = new CardTemplate(veliaTemplateDefinition)
//
// Using this instance also gives the template definition's render functions
// access to useful utility methods such as drawNomusLogo, drawQRCode, etc.
export default class CardTemplate<T> {
  public name: CardTemplateDefinition<T>['name']
  public customizableOptions: CardTemplateDefinition<T>['customizableOptions']
  public width: CardTemplateDefinition<T>['width']
  public height: CardTemplateDefinition<T>['height']
  public demoImageUrl: CardTemplateDefinition<T>['demoImageUrl']

  private _renderFront: CardTemplateDefinition<T>['renderFront']
  private _renderBack: CardTemplateDefinition<T>['renderBack']
  private userSpecifiedOptions: T | null = null

  constructor(definition: CardTemplateDefinition<T>) {
    this.name = definition.name
    this.width = definition.width
    this.height = definition.height
    this.demoImageUrl = definition.demoImageUrl
    this.customizableOptions = definition.customizableOptions
    this._renderFront = definition.renderFront
    this._renderBack = definition.renderBack
  }

  get usableWidth() {
    return this.proportionalize(this.width)
  }
  get usableHeight() {
    return this.proportionalize(this.height)
  }

  get isComplete(): boolean {
    const customizableFields = Object.keys(
      this.customizableOptions,
    ) as (keyof T)[]
    return customizableFields.every(
      (field) =>
        !this.customizableOptions[field].required ||
        (this.userSpecifiedOptions && this.userSpecifiedOptions[field]),
    )
  }

  get bleed(): { x: number; y: number } {
    const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
    const xBleedPct = xBleed / cardWidth
    const yBleedPct = yBleed / cardHeight

    const actualXBleed = this.usableWidth * xBleedPct
    const actualYBleed = this.usableHeight * yBleedPct
    return { x: actualXBleed, y: actualYBleed }
  }

  get customizableFieldNames(): (keyof CardTemplateDefinition<T>['customizableOptions'])[] {
    return Object.keys(this.customizableOptions) as any[]
  }

  // Converts the template's customization options into an object that can be provided
  // to Storybook's argTypes property for rendering UI controls
  // See https://storybook.js.org/docs/react/essentials/controls
  get storybookArgTypes() {
    return this.customizableFieldNames.reduce<any>(
      (acc, customizableFieldName) => {
        acc[customizableFieldName] = {}

        const fieldDetails = this.customizableOptions[customizableFieldName]
        switch (fieldDetails.type) {
          case 'range':
            const rangeFieldDetails = fieldDetails as CustomizableRangeFieldSpec<any>
            acc[customizableFieldName].control = {
              type: 'range',
              min: rangeFieldDetails.range.min,
              max: rangeFieldDetails.range.max,
              step: rangeFieldDetails.range.step,
            }
            break
          // The storybook version we use doesn't have a file selector so
          // just show a basic url text input instead
          case 'image':
            acc[customizableFieldName].control = {
              type: 'text',
            }
            break
          default:
            acc[customizableFieldName] = {
              control: {
                type: fieldDetails.type,
              },
            }
            break
        }
        return acc
      },
      {},
    )
  }

  clearCanvas(canvas: HTMLCanvasElement) {
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  waitForImageToLoad(img: HTMLImageElement): Promise<void> {
    return new Promise((res) => {
      img.addEventListener('load', () => {
        res()
      })
    })
  }

  async renderFront(
    canvas: HTMLCanvasElement,
    options: T,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.usableHeight
    canvas.width = this.usableWidth
    await this._renderFront(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  async renderBack(
    canvas: HTMLCanvasElement,
    options: T,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.usableHeight
    canvas.width = this.usableWidth
    await this._renderBack(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  // Proportionalizes a canvas coordinate value to match the resolution factor
  proportionalize(val: number) {
    return val * RESOLUTION_FACTOR
  }

  // Draws a 2px black border around the entire card
  drawBorder(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, this.usableWidth, this.usableHeight)
  }

  drawInnerBleed(ctx: CanvasRenderingContext2D) {
    // Draw the image onto a canvas each time it changes or we toggle showGuides
    const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
    const xBleedPct = xBleed / cardWidth
    const yBleedPct = yBleed / cardHeight

    const actualXBleed = this.usableWidth * xBleedPct
    const actualYBleed = this.usableHeight * yBleedPct

    const innerBleedWidth = this.usableWidth - actualXBleed * 2
    const innerBleedHeight = this.usableHeight - actualYBleed * 2

    ctx.strokeStyle = colors.brightCoral
    ctx.setLineDash([this.proportionalize(6)])
    ctx.strokeRect(
      actualXBleed,
      actualYBleed,
      innerBleedWidth,
      innerBleedHeight,
    )
  }

  // Writes text vertically centered within the canvas with the top of the text at the specified y value
  drawTextHorizontallyCenteredAtY(
    ctx: CanvasRenderingContext2D,
    text: string,
    y: number,
  ): TextMetrics {
    const textMeasurements = ctx.measureText(text)
    const textX = (this.usableWidth - textMeasurements.width) / 2
    ctx.fillText(text, textX, y)
    return textMeasurements
  }

  async drawNomusLogo(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNomusLogoSVG({ color })
    const img = document.createElement('img')
    img.src = 'data:image/svg+xml,' + svgMarkup
    await this.waitForImageToLoad(img)
    ctx.drawImage(img, x, y, size, size)
  }

  async drawNFCTapIcon(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNFCTapIconSVG({ color })
    const img = document.createElement('img')
    img.src = 'data:image/svg+xml,' + svgMarkup
    await this.waitForImageToLoad(img)
    ctx.drawImage(img, x, y, size, size)
  }

  async drawQRCode(
    ctx: CanvasRenderingContext2D,
    qrUrl: string,
    {
      x,
      y,
      width,
      height,
      foregroundColor = '#000',
      backgroundColor = '#fff',
    }: {
      x: number
      y: number
      width: number
      height: number
      foregroundColor?: string
      backgroundColor?: string
    },
  ): Promise<void> {
    if (!qrUrl) {
      console.warn('qrUrl was empty')
      return
    }
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      margin: 0,
      color: {
        dark: foregroundColor.match(RGBA_REGEX)
          ? rgb2hex(foregroundColor)
          : foregroundColor,
        light: backgroundColor.match(RGBA_REGEX)
          ? rgb2hex(backgroundColor)
          : backgroundColor,
      },
    })
    const qrImg = document.createElement('img')
    qrImg.src = qrDataUrl
    await this.waitForImageToLoad(qrImg)
    ctx.drawImage(qrImg, x, y, width, height)
  }
}
