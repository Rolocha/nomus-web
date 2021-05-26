import { lighten } from 'polished'
import { colors } from 'src/styles'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'

const Nicole = new CardTemplate({
  name: 'Nicole',
  width: 154,
  height: 264,
  demoImageUrl:
    'https://nomus-assets.s3.amazonaws.com/site-assets/templates/nicole.svg',
  colorScheme: {
    background: {
      defaultValue: '#ffffff',
    },
    accent: {
      defaultValue: colors.golden[700],
    },
    accent2: {
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
    line4: {
      label: 'Line 4',
      required: false,
      placeholder: 'Established in CA',
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
      this.colorSchemeSpec.background.defaultValue
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Draw the bottom accent bar
    ctx.fillStyle =
      options.colorScheme.accent ?? this.colorSchemeSpec.accent.defaultValue
    ctx.fillRect(
      0,
      this.proportionalize(242),
      this.proportionalizedWidth,
      this.proportionalize(22),
    )

    // Render the name
    ctx.font = this.proportionalize(14) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.accent2
      : lighten(0.4)(options.colorScheme.accent2)
    this.wrapTextCenteredAnchoredBottom(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      this.proportionalize(60),
      this.proportionalize(120),
      this.proportionalize(17),
    )

    // Render the headline
    ctx.font = this.proportionalize(8) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.headline
      ? options.colorScheme.text
      : placeholderTextColor
    this.wrapTextCenteredAnchoredTop(
      ctx,
      options.contactInfo.headline ||
        this.contactInfoSpec.headline.placeholder ||
        '[headline]',
      this.proportionalize(68 + 8),
    )

    // Render line 1-4, all centered
    if (!options.omittedContactInfoFields.includes('line1')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line1
        ? options.colorScheme.text
        : placeholderTextColor
      const line1Text =
        options.contactInfo.line1 ||
        this.contactInfoSpec.line1.placeholder ||
        ''
      this.wrapTextCenteredAnchoredTop(
        ctx,
        line1Text,
        this.proportionalize(93 + 7),
      )
    }
    if (!options.omittedContactInfoFields.includes('line2')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line2
        ? options.colorScheme.text
        : placeholderTextColor
      const line2Text =
        options.contactInfo.line2 ||
        this.contactInfoSpec.line2.placeholder ||
        ''
      this.wrapTextCenteredAnchoredTop(
        ctx,
        line2Text,
        this.proportionalize(105 + 7),
      )
    }
    if (!options.omittedContactInfoFields.includes('line3')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line3
        ? options.colorScheme.text
        : placeholderTextColor
      const line3Text =
        options.contactInfo.line3 ||
        this.contactInfoSpec.line3.placeholder ||
        ''
      this.wrapTextCenteredAnchoredTop(
        ctx,
        line3Text,
        this.proportionalize(117 + 7),
      )
    }
    if (!options.omittedContactInfoFields.includes('line4')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line4
        ? options.colorScheme.text
        : placeholderTextColor
      const line4Text =
        options.contactInfo.line4 ||
        this.contactInfoSpec.line4.placeholder ||
        ''
      this.wrapTextCenteredAnchoredTop(
        ctx,
        line4Text,
        this.proportionalize(129 + 7),
      )
    }

    // Render footer
    // TODO: Make it wrap to max 2 lines
    if (!options.omittedContactInfoFields.includes('footer')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.footer
        ? options.colorScheme.text
        : placeholderTextColor
      const footerText =
        options.contactInfo.footer ||
        this.contactInfoSpec.footer.placeholder ||
        ''
      this.wrapTextCenteredAnchoredTop(
        ctx,
        footerText,
        this.proportionalize(141 + 7),
      )
    }

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(61),
      y: this.proportionalize(174),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: options.colorScheme.background,
      foregroundColor: options.colorScheme.accent2,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(64),
      y: this.proportionalize(210),
      size: this.proportionalize(12),
      color: options.colorScheme.accent2,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(78),
      y: this.proportionalize(210),
      size: this.proportionalize(12),
      color: options.colorScheme.accent2,
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
      this.colorSchemeSpec.background.defaultValue
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Draw the bottom accent bar
    ctx.fillStyle =
      options.colorScheme.accent ?? this.colorSchemeSpec.accent.defaultValue
    ctx.fillRect(
      0,
      this.proportionalize(242),
      this.proportionalizedWidth,
      this.proportionalize(22),
    )

    // Render user-provided logo if provided
    if (options.graphic?.url) {
      const logoImg = await this.createImage(options.graphic.url)
      const imageHeight =
        (options.graphic.size ?? 1) * this.proportionalize(220)
      const imageWidth =
        (imageHeight * logoImg.naturalWidth) / logoImg.naturalHeight

      // y + imageHeight + y + ACCENT_BAR_SIZE = this.usableHeight
      // y = (this.usableHeight - ACCENT_BAR_SIZE - imageHeight) / 2
      const imageY =
        (this.proportionalizedHeight - this.proportionalize(22) - imageHeight) /
        2
      const imageX = (this.proportionalizedWidth - imageWidth) / 2
      ctx.drawImage(logoImg, imageX, imageY, imageWidth, imageHeight)
    }
  },
})

export default Nicole
