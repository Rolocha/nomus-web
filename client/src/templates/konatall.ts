import { lighten } from 'polished'
import { colors } from 'src/styles'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'

const KonaTall = new CardTemplate({
  name: 'Kona Tall',
  width: 154,
  height: 264,
  demoImageUrl:
    'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/cf5e1968-c155-4c81-a259-5e78e179d684/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210526T025604Z&X-Amz-Expires=86400&X-Amz-Signature=d88eed029cbfa674b52bbaf5e667184763f9d43349cbb549d29875fdfc2c83ba&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22',
  colorScheme: {
    background: {
      defaultValue: colors.white,
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
      required: false,
      placeholder: 'Businessperson',
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

    // Render the name
    ctx.font = 'bold ' + this.proportionalize(18) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.text
      : placeholderTextColor
    const { height: nameHeight } = this.wrapTextAnchorTopLeft(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      this.proportionalize(17),
      this.proportionalize(40),
      this.proportionalize(120),
      this.proportionalize(22),
    )

    // Render the headline
    if (!options.omittedContactInfoFields.includes('headline')) {
      ctx.font = this.proportionalize(9) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.headline
        ? options.colorScheme.text
        : placeholderTextColor
      this.wrapTextAnchorTopLeft(
        ctx,
        options.contactInfo.headline ||
          this.contactInfoSpec.headline.placeholder ||
          '[headline]',
        this.proportionalize(17),
        nameHeight + this.proportionalize(36),
        this.proportionalize(120),
        this.proportionalize(12),
      )
    }

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(104),
      y: this.proportionalize(214),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: options.colorScheme.background,
      foregroundColor: options.colorScheme.text,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(73),
      y: this.proportionalize(234),
      size: this.proportionalize(12),
      color: options.colorScheme.text,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(89),
      y: this.proportionalize(234),
      size: this.proportionalize(12),
      color: options.colorScheme.text,
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

    // Draw the background
    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render user-provided logo if provided
    if (options.graphic?.url) {
      const logoImg = await this.createImage(options.graphic.url)
      const imageHeight =
        (options.graphic.size ?? 1) * this.proportionalize(100)
      const imageWidth =
        (imageHeight * logoImg.naturalWidth) / logoImg.naturalHeight

      const imageY = (this.proportionalizedHeight - imageHeight) / 2
      const imageX = (this.proportionalizedWidth - imageWidth) / 2
      ctx.drawImage(logoImg, imageX, imageY, imageWidth, imageHeight)
    }
  },
})

export default KonaTall
