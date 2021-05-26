import { lighten } from 'polished'
import { colors } from 'src/styles'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'

const Velia = new CardTemplate({
  name: 'Velia',
  width: 252,
  height: 144,
  demoImageUrl:
    'https://nomus-assets.s3.amazonaws.com/site-assets/templates/velia.svg',
  colorScheme: {
    background: {
      defaultValue: '#ffffff',
    },
    accent: {
      defaultValue: colors.nomusBlue,
    },
    text: {
      defaultValue: colors.midnightGray,
    },
  },
  contactInfo: {
    name: {
      label: 'Name',
      required: true,
      placeholder: 'John Appleseed',
    },
    headline: {
      label: 'Headline',
      required: true,
      placeholder: 'Businessperson',
    },
    line1: {
      label: 'Line 1',
      required: false,
      placeholder: '(555)-555-5555',
    },
    line2: {
      label: 'Line 2',
      required: false,
      placeholder: 'john@appleseed.com',
    },
    line3: {
      label: 'Line 3',
      required: false,
      placeholder: 'Apple Seed, LLC',
    },
    footer: {
      label: 'Footer',
      required: false,
      placeholder: 'An apple a day keeps the doctor away',
    },
  } as const,
  async renderFront(
    this: CardTemplate,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    const placeholderTextColor = lighten(0.4)(options.colorScheme.text)

    // Draw the background
    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Draw the bottom accent bar
    ctx.fillStyle =
      options.colorScheme.accent ??
      this.colorSchemeSpec.accent.defaultValue ??
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
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.text
      : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      this.proportionalize(20 + 14),
    )

    // Render the headline
    ctx.font = this.proportionalize(8) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.headline
      ? options.colorScheme.text
      : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      options.contactInfo.headline ||
        this.contactInfoSpec.headline.placeholder ||
        '[headline]',
      this.proportionalize(40 + 8),
    )

    // Render the 3 contact info lines, all 8px left from center
    const rightEdgeForLines =
      this.proportionalizedWidth / 2 - this.proportionalize(8)
    ctx.font = this.proportionalize(7) + 'px Rubik'

    if (!options.omittedContactInfoFields.includes('line1')) {
      ctx.fillStyle = options.contactInfo.line1
        ? options.colorScheme.text
        : placeholderTextColor
      const line1Text =
        options.contactInfo.line1 ||
        this.contactInfoSpec.line1.placeholder ||
        ''
      const line1TextMetrics = ctx.measureText(line1Text)
      const line1TextX = rightEdgeForLines - line1TextMetrics.width
      ctx.fillText(line1Text, line1TextX, this.proportionalize(65 + 7))
    }

    if (!options.omittedContactInfoFields.includes('line2')) {
      ctx.fillStyle = options.contactInfo.line2
        ? options.colorScheme.text
        : placeholderTextColor
      const line2Text =
        options.contactInfo.line2 ||
        this.contactInfoSpec.line2.placeholder ||
        ''
      const line2TextMetrics = ctx.measureText(line2Text)
      const line2TextX = rightEdgeForLines - line2TextMetrics.width
      ctx.fillText(line2Text, line2TextX, this.proportionalize(77 + 7))
    }

    if (!options.omittedContactInfoFields.includes('line3')) {
      ctx.fillStyle = options.contactInfo.line3
        ? options.colorScheme.text
        : placeholderTextColor
      const line3Text =
        options.contactInfo.line3 ||
        this.contactInfoSpec.line3.placeholder ||
        ''
      const line3TextMetrics = ctx.measureText(line3Text)
      const line3TextX = rightEdgeForLines - line3TextMetrics.width
      ctx.fillText(line3Text, line3TextX, this.proportionalize(89 + 7))
    }

    if (!options.omittedContactInfoFields.includes('footer')) {
      // Render the footer
      const footerText =
        options.contactInfo.footer ||
        this.contactInfoSpec.footer.placeholder ||
        ''
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.footer
        ? options.colorScheme.text
        : placeholderTextColor
      this.drawTextHorizontallyCenteredAtY(
        ctx,
        footerText,
        this.proportionalize(108),
      )
    }

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(134),
      y: this.proportionalize(65),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: options.colorScheme.background,
      foregroundColor: options.colorScheme.accent,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(170),
      y: this.proportionalize(70),
      size: this.proportionalize(11),
      color: options.colorScheme.accent,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(170),
      y: this.proportionalize(85),
      size: this.proportionalize(11),
      color: options.colorScheme.accent,
    })
  },
  async renderBack(
    this: CardTemplate,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    const ACCENT_BAR_SIZE = 16

    // Draw the main background with accent color
    ctx.fillStyle =
      options.colorScheme.accent ??
      this.colorSchemeSpec.accent.defaultValue ??
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
      options.colorScheme.background ??
      this.contactInfoSpec.name.defaultValue ??
      // Should never have go this far
      '#ffffff'
    ctx.fillRect(
      0,
      this.proportionalizedHeight - 100,
      this.proportionalizedWidth,
      1000,
    )

    // Render user-provided logo if provided
    if (options.graphic?.url) {
      const logoImg = await this.createImage(options.graphic.url)
      const imageHeight =
        (options.graphic.size ?? 1) * this.proportionalize(100)
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
