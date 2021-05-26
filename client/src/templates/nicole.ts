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
      defaultValue: colors.cyanProcess,
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

    const palette = {
      background:
        options.colorScheme.background ??
        this.colorSchemeSpec.background.defaultValue,
      text: options.colorScheme.text ?? this.colorSchemeSpec.text.defaultValue,
      accent:
        options.colorScheme.accent ?? this.colorSchemeSpec.accent.defaultValue,
      accent2:
        options.colorScheme.accent2 ??
        this.colorSchemeSpec.accent2.defaultValue,
    }
    const placeholderTextColor = lighten(0.4)(palette.text)

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

    ctx.textAlign = 'center'

    // Render the name
    ctx.font = this.proportionalize(14) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? palette.accent2
      : lighten(0.4)(palette.accent2)
    ctx.textAlign = 'center'
    this.wrapText(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      {
        anchorTo: 'bottom',
        x: this.proportionalizedWidth / 2,
        y: this.proportionalize(60),
        maxWidth: this.proportionalize(120),
        lineHeight: this.proportionalize(17),
      },
    )

    // Render the headline
    ctx.font = this.proportionalize(8) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.headline
      ? palette.text
      : placeholderTextColor
    ctx.fillText(
      options.contactInfo.headline ||
        this.contactInfoSpec.headline.placeholder ||
        '[headline]',
      this.proportionalizedWidth / 2,
      this.proportionalize(68 + 8),
    )

    // Render line 1-4, all centered
    if (!options.omittedContactInfoFields.includes('line1')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line1
        ? palette.text
        : placeholderTextColor
      const line1Text =
        options.contactInfo.line1 ||
        this.contactInfoSpec.line1.placeholder ||
        ''
      ctx.fillText(
        line1Text,
        this.proportionalizedWidth / 2,
        this.proportionalize(93 + 7),
      )
    }
    if (!options.omittedContactInfoFields.includes('line2')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line2
        ? palette.text
        : placeholderTextColor
      const line2Text =
        options.contactInfo.line2 ||
        this.contactInfoSpec.line2.placeholder ||
        ''
      ctx.fillText(
        line2Text,
        this.proportionalizedWidth / 2,
        this.proportionalize(105 + 7),
      )
    }
    if (!options.omittedContactInfoFields.includes('line3')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line3
        ? palette.text
        : placeholderTextColor
      const line3Text =
        options.contactInfo.line3 ||
        this.contactInfoSpec.line3.placeholder ||
        ''
      ctx.fillText(
        line3Text,
        this.proportionalizedWidth / 2,
        this.proportionalize(117 + 7),
      )
    }
    if (!options.omittedContactInfoFields.includes('line4')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line4
        ? palette.text
        : placeholderTextColor
      const line4Text =
        options.contactInfo.line4 ||
        this.contactInfoSpec.line4.placeholder ||
        ''
      ctx.fillText(
        line4Text,
        this.proportionalizedWidth / 2,
        this.proportionalize(129 + 7),
      )
    }

    // Render footer
    // TODO: Make it wrap to max 2 lines
    if (!options.omittedContactInfoFields.includes('footer')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.footer
        ? palette.text
        : placeholderTextColor
      const footerText =
        options.contactInfo.footer ||
        this.contactInfoSpec.footer.placeholder ||
        ''
      ctx.fillText(
        footerText,
        this.proportionalizedWidth / 2,
        this.proportionalize(141 + 7),
      )
    }

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(61),
      y: this.proportionalize(174),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: palette.background,
      foregroundColor: palette.accent2,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(64),
      y: this.proportionalize(210),
      size: this.proportionalize(12),
      color: palette.accent2,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(78),
      y: this.proportionalize(210),
      size: this.proportionalize(12),
      color: palette.accent2,
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

    const palette = {
      background:
        options.colorScheme.background ??
        this.colorSchemeSpec.background.defaultValue,
      text: options.colorScheme.text ?? this.colorSchemeSpec.text.defaultValue,
      accent:
        options.colorScheme.accent ?? this.colorSchemeSpec.accent.defaultValue,
      accent2:
        options.colorScheme.accent2 ??
        this.colorSchemeSpec.accent2.defaultValue,
    }

    // Draw the background
    ctx.fillStyle = palette.background
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Draw the bottom accent bar
    ctx.fillStyle = palette.accent
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
