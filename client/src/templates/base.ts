import QRCode from 'qrcode'
import { specMeasurements } from 'src/pages/CardBuilder/config'
import { colors } from 'src/styles'
import {
  createNFCTapIconSVG,
  createNomusLogoSVG,
  rgb2hex,
  RGBA_REGEX,
} from './utils'

// The scaling factor for how much we increase the resolution
// of the template cards when rendered - might make sense to
// move this to TemplateCard
const RESOLUTION_FACTOR = 5

export interface GenericCustomizableFieldSpec<T> {
  type: 'text' | 'color' | 'logo' | 'logoSize' | 'qrUrl'
  label?: string
  placeholder?: string
  required?: boolean
  defaultValue?: any
  hidden?: (options: T) => boolean
}

export interface CustomizableLogoSizeFieldSpec<T>
  extends GenericCustomizableFieldSpec<T> {
  type: 'logoSize'
  range: {
    min: number
    max: number
    step: number
  }
}

export type CustomizableFieldSpec<T> =
  | CustomizableLogoSizeFieldSpec<T>
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
export default class CardTemplate<TemplateOptions extends {}> {
  public name: CardTemplateDefinition<TemplateOptions>['name']
  public width: CardTemplateDefinition<TemplateOptions>['width']
  public height: CardTemplateDefinition<TemplateOptions>['height']
  public demoImageUrl: CardTemplateDefinition<TemplateOptions>['demoImageUrl']
  public customizableOptions: CardTemplateDefinition<TemplateOptions>['customizableOptions']

  private _renderFront: CardTemplateDefinition<TemplateOptions>['renderFront']
  private _renderBack: CardTemplateDefinition<TemplateOptions>['renderBack']
  private userSpecifiedOptions: TemplateOptions | null = null

  constructor(definition: CardTemplateDefinition<TemplateOptions>) {
    this.name = definition.name
    this.width = definition.width
    this.height = definition.height
    this.demoImageUrl = definition.demoImageUrl
    this.customizableOptions = definition.customizableOptions
    this._renderFront = definition.renderFront
    this._renderBack = definition.renderBack
  }

  /**
   * Various useful getters
   */

  public get proportionalizedWidth() {
    return this.proportionalize(this.width)
  }
  public get proportionalizedHeight() {
    return this.proportionalize(this.height)
  }
  public get customizableOptionNames(): (keyof CardTemplateDefinition<TemplateOptions>['customizableOptions'])[] {
    return Object.keys(this.customizableOptions) as any[]
  }

  public get isComplete(): boolean {
    return this.customizableOptionNames.every(
      (field) =>
        !this.customizableOptions[field].required ||
        (this.userSpecifiedOptions && this.userSpecifiedOptions[field]),
    )
  }

  /**
   * Core renderers
   *
   * The core public-facing methods of a template that allow you to render
   * the design onto HTMLCanvasElements
   */

  // Renders the front side of the card on the provided canvas element
  // using the specified options
  public async renderFrontToCanvas(
    canvas: HTMLCanvasElement,
    options: TemplateOptions,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.proportionalizedHeight
    canvas.width = this.proportionalizedWidth
    await this._renderFront(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  // Renders the back side of the card on the provided canvas element
  // using the specified options
  public async renderBackToCanvas(
    canvas: HTMLCanvasElement,
    options: TemplateOptions,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.proportionalizedHeight
    canvas.width = this.proportionalizedWidth
    await this._renderBack(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  // Renders both the front and back of the cards each to a separate data URL string
  public async renderBothSidesToDataUrls(
    options: TemplateOptions,
  ): Promise<{ front: string; back: string }> {
    const frontCanvas = document.createElement('canvas')
    const backCanvas = document.createElement('canvas')
    await this.renderFrontToCanvas(frontCanvas, options)
    await this.renderBackToCanvas(backCanvas, options)

    return {
      front: frontCanvas.toDataURL('image/png'),
      back: backCanvas.toDataURL('image/png'),
    }
  }

  /**
   * Template customizable field massagers
   *
   * For various use cases, the customizable options that are defined for each template need to
   * be massaged into different shapes for use with other tools like Storybook or Card Builder.
   * These data transformations should be done here to avoid leaking this abstraction.
   */

  // Converts the template's customization options into an object that can be provided
  // to Storybook's argTypes property for rendering UI controls
  // See https://storybook.js.org/docs/react/essentials/controls
  public get storybookArgTypes() {
    return this.customizableOptionNames.reduce<any>(
      (acc, customizableFieldName) => {
        acc[customizableFieldName] = {}

        const fieldDetails = this.customizableOptions[customizableFieldName]
        switch (fieldDetails.type) {
          case 'logoSize':
            const rangeFieldDetails = fieldDetails as CustomizableLogoSizeFieldSpec<any>
            acc[customizableFieldName].control = {
              type: 'range',
              min: rangeFieldDetails.range.min,
              max: rangeFieldDetails.range.max,
              step: rangeFieldDetails.range.step,
            }
            break
          // The storybook version we use doesn't have a file selector so
          // just show a basic url text input instead
          case 'logo':
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

  // The Card Builder form values for templates *generally* map 1:1 to
  // the options we feed into the template renderer but in a few cases
  // we need to do some light massaging along the way. This function
  // lets us handle any such data transformations.
  public createOptionsFromFormFields(formFields: Record<string, any>) {
    return this.customizableOptionNames.reduce((acc, customizationKey) => {
      const customizationDetails = this.customizableOptions[customizationKey]
      switch (customizationDetails.type) {
        // For logo images, the form values use a FileItem which has a `file.url` property
        // The template only needs the url so we extract that out.
        case 'logo':
          if (formFields.hasOwnProperty(customizationKey)) {
            acc[customizationKey] =
              formFields[customizationKey as string]?.url ?? undefined
          }
          break
        default:
          if (formFields.hasOwnProperty(customizationKey)) {
            acc[customizationKey] = formFields[customizationKey as string]
          }
      }
      return acc
    }, {} as TemplateOptions)
  }

  /**
   * Canvas drawing helpers
   *
   * These should ~all be marked as 'protected' since they'll only need to be used
   * by the renderFront/renderBack methods of templates that instatiate this class
   */

  protected get bleed(): { x: number; y: number } {
    const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
    const xBleedPct = xBleed / cardWidth
    const yBleedPct = yBleed / cardHeight

    const actualXBleed = this.proportionalizedWidth * xBleedPct
    const actualYBleed = this.proportionalizedHeight * yBleedPct
    return { x: actualXBleed, y: actualYBleed }
  }

  protected async createImage(src: string): Promise<HTMLImageElement> {
    const img = document.createElement('img')
    img.src = src
    // Needed in order to allow canvas rendering on different origins
    // such as when rendering in Storybook
    img.crossOrigin = 'anonymous'
    await this.waitForImageToLoad(img)
    return img
  }

  protected waitForImageToLoad(img: HTMLImageElement): Promise<void> {
    return new Promise((res) => {
      img.addEventListener('load', () => {
        res()
      })
    })
  }

  // Proportionalizes a canvas coordinate value to match the resolution factor
  protected proportionalize(val: number) {
    return val * RESOLUTION_FACTOR
  }

  protected clearCanvas(canvas: HTMLCanvasElement) {
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Draws a 2px black border around the entire card
  public drawBorder(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(
      0,
      0,
      this.proportionalizedWidth,
      this.proportionalizedHeight,
    )
  }

  public drawInnerBleed(ctx: CanvasRenderingContext2D) {
    const { x: actualXBleed, y: actualYBleed } = this.bleed

    const innerBleedWidth = this.proportionalizedWidth - actualXBleed * 2
    const innerBleedHeight = this.proportionalizedHeight - actualYBleed * 2

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
  protected drawTextHorizontallyCenteredAtY(
    ctx: CanvasRenderingContext2D,
    text: string,
    y: number,
  ): TextMetrics {
    const textMeasurements = ctx.measureText(text)
    const textX = (this.proportionalizedWidth - textMeasurements.width) / 2
    ctx.fillText(text, textX, y)
    return textMeasurements
  }

  protected async drawNomusLogo(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNomusLogoSVG({ color })
    const img = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(img, x, y, size, size)
  }

  protected async drawNFCTapIcon(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNFCTapIconSVG({ color })
    const img = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(img, x, y, size, size)
  }

  protected async drawQRCode(
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
    const qrImg = await this.createImage(qrDataUrl)
    ctx.drawImage(qrImg, x, y, width, height)
  }
}
