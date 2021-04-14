import { lighten } from 'polished'
import CardTemplate from 'src/templates/base'
import { colors } from 'src/styles'

export interface VeliaOptions {
  name: string
  headline: string
  line1?: string
  line2?: string
  line3?: string
  footer?: string
  qrUrl: string
  backgroundColor?: string
  accentColor?: string
  textColor: string
  logoUrl?: string
  logoSize?: number
}

const Velia = new CardTemplate<VeliaOptions>({
  name: 'Velia',
  width: 252,
  height: 144,
  demoImageUrl:
    'https://user-images.githubusercontent.com/8083680/112780178-25e20780-8ffd-11eb-96ec-f1eecbe102de.png',
  customizableOptions: {
    name: {
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'John Appleseed',
    },
    headline: {
      type: 'text',
      label: 'Headline',
      required: true,
      placeholder: 'Businessperson',
    },
    line1: {
      label: 'Line 1',
      type: 'text',
      placeholder: '(555)-555-5555',
    },
    line2: {
      label: 'Line 2',
      type: 'text',
      placeholder: 'john@appleseed.com',
    },
    line3: {
      label: 'Line 3',
      type: 'text',
    },
    footer: {
      label: 'Footer',
      type: 'text',
      placeholder: 'An apple a day keeps the doctor away',
    },
    qrUrl: {
      label: 'QR Code URL',
      type: 'qrUrl',
      placeholder: 'https://nomus.me',
      hidden: () => true,
    },
    logoUrl: {
      type: 'logo',
      label: 'Logo',
    },
    logoSize: {
      label: 'Logo Size',
      defaultValue: 1,
      type: 'logoSize',
      hidden: (options: VeliaOptions) =>
        options.logoUrl == null || options.logoUrl.length === 0,
      range: {
        min: 0.1,
        max: 1,
        step: 0.05,
      },
    },
    backgroundColor: {
      label: 'Background color',
      type: 'color',
      defaultValue: colors.white,
    },
    accentColor: {
      label: 'Accent color',
      type: 'color',
      defaultValue: colors.nomusBlue,
    },
    textColor: {
      label: 'Text color',
      type: 'color',
      defaultValue: colors.midnightGray,
    },
  },
  async renderFront(
    this: CardTemplate<VeliaOptions>,
    canvas: HTMLCanvasElement,
    options: VeliaOptions,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    const placeholderTextColor = lighten(0.4)(options.textColor)

    // Draw the background
    ctx.fillStyle =
      options.backgroundColor ??
      this.customizableOptions.backgroundColor.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Draw the bottom accent bar
    ctx.fillStyle =
      options.accentColor ??
      this.customizableOptions.accentColor.defaultValue ??
      // Should never have go this far
      '#000000'
    ctx.fillRect(
      0,
      this.proportionalize(128),
      this.proportionalizedWidth,
      this.proportionalize(16),
    )

    // Render the name
    ctx.font = this.proportionalize(14) + 'px Rubik'
    ctx.fillStyle = options.name ? options.textColor : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      options.name || this.customizableOptions.name.placeholder || '[name]',
      this.proportionalize(20 + 14),
    )

    // Render the headline
    ctx.font = this.proportionalize(8) + 'px Rubik'
    ctx.fillStyle = options.headline ? options.textColor : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      options.headline ||
        this.customizableOptions.headline.placeholder ||
        '[headline]',
      this.proportionalize(40 + 8),
    )

    // Render the 3 contact info lines, all 8px left from center
    const rightEdgeForLines =
      this.proportionalizedWidth / 2 - this.proportionalize(8)
    ctx.font = this.proportionalize(7) + 'px Rubik'

    ctx.fillStyle = options.line1 ? options.textColor : placeholderTextColor
    const line1Text =
      options.line1 || this.customizableOptions.line1.placeholder || ''
    const line1TextMetrics = ctx.measureText(line1Text)
    const line1TextX = rightEdgeForLines - line1TextMetrics.width
    ctx.fillText(line1Text, line1TextX, this.proportionalize(65 + 7))

    ctx.fillStyle = options.line2 ? options.textColor : placeholderTextColor
    const line2Text =
      options.line2 || this.customizableOptions.line2.placeholder || ''
    const line2TextMetrics = ctx.measureText(line2Text)
    const line2TextX = rightEdgeForLines - line2TextMetrics.width
    ctx.fillText(line2Text, line2TextX, this.proportionalize(77 + 7))

    ctx.fillStyle = options.line3 ? options.textColor : placeholderTextColor
    const line3Text =
      options.line3 || this.customizableOptions.line3.placeholder || ''
    const line3TextMetrics = ctx.measureText(line3Text)
    const line3TextX = rightEdgeForLines - line3TextMetrics.width
    ctx.fillText(line3Text, line3TextX, this.proportionalize(89 + 7))

    // Render the footer
    const footerText =
      options.footer || this.customizableOptions.footer.placeholder || ''
    ctx.font = this.proportionalize(7) + 'px Rubik'
    ctx.fillStyle = options.footer ? options.textColor : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      footerText,
      this.proportionalize(108),
    )

    // Render QR code
    await this.drawQRCode(
      ctx,
      options.qrUrl ||
        this.customizableOptions.qrUrl.placeholder ||
        'https://nomus.me',
      {
        x: this.proportionalize(134),
        y: this.proportionalize(65),
        width: this.proportionalize(32),
        height: this.proportionalize(32),
        backgroundColor: options.backgroundColor,
        foregroundColor: options.accentColor,
      },
    )

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(170),
      y: this.proportionalize(70),
      size: this.proportionalize(11),
      color: options.accentColor,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(170),
      y: this.proportionalize(85),
      size: this.proportionalize(11),
      color: options.accentColor,
    })
  },
  async renderBack(
    this: CardTemplate<VeliaOptions>,
    canvas: HTMLCanvasElement,
    options: VeliaOptions,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    const ACCENT_BAR_SIZE = 16

    // Draw the main background with accent color
    ctx.fillStyle =
      options.accentColor ??
      this.customizableOptions.accentColor.defaultValue ??
      // Should never have go this far
      '#000000'
    ctx.fillRect(
      0,
      0,
      this.proportionalizedWidth,
      this.proportionalize(this.height - ACCENT_BAR_SIZE),
    )

    // Draw the bottom bar with background color
    ctx.fillStyle =
      options.backgroundColor ??
      this.customizableOptions.backgroundColor.defaultValue ??
      // Should never have go this far
      '#ffffff'
    ctx.fillRect(
      0,
      this.proportionalizedHeight - 100,
      this.proportionalizedWidth,
      1000,
    )

    // Render user-provided logo if provided
    if (options.logoUrl) {
      const logoImg = await this.createImage(options.logoUrl)
      const imageHeight =
        (options.logoSize ??
          this.customizableOptions.logoSize.defaultValue ??
          1) * this.proportionalize(100)
      const imageWidth =
        (imageHeight * logoImg.naturalWidth) / logoImg.naturalHeight

      // y + imageHeight + y + ACCENT_BAR_SIZE = this.usableHeight
      // y = (this.usableHeight - ACCENT_BAR_SIZE - imageHeight) / 2
      const imageY =
        (this.proportionalizedHeight - ACCENT_BAR_SIZE - imageHeight) / 2
      const imageX = (this.proportionalizedWidth - imageWidth) / 2
      ctx.drawImage(logoImg, imageX, imageY, imageWidth, imageHeight)
    }
  },
})

export default Velia
