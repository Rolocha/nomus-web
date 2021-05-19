import { colors } from 'src/styles'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'

export type RolochaContactFields =
  | 'name'
  | 'headline'
  | 'line1'
  | 'line2'
  | 'line3'
  | 'line4'
  | 'footer'
export type RolochaExtendedColors = never

const Rolocha = new CardTemplate<RolochaContactFields, RolochaExtendedColors>({
  name: 'Rolocha',
  width: 154,
  height: 264,
  demoImageUrl:
    'https://user-images.githubusercontent.com/10100874/118752012-30f42f80-b817-11eb-986f-1fefcbfd8044.png',
  colorScheme: {
    background: {
      defaultValue: colors.nomusBlue, //MAKE THIS BACK TO WHITE JUST TESTING
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
    line4: {
      label: 'Line 4',
      required: false,
      placeholder: '1 Apple Park Road',
    },
    footer: {
      label: 'Footer',
      required: false,
      placeholder: 'An apple a day keeps the doctor away',
    },
  } as const,
  async renderFront(
    this: CardTemplate<RolochaContactFields, RolochaExtendedColors>,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions<
      RolochaContactFields,
      RolochaExtendedColors
    >,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    // const placeholderTextColor = lighten(0.4)(options.colorScheme.text)

    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)
  },
  async renderBack(
    this: CardTemplate<RolochaContactFields, RolochaExtendedColors>,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions<
      RolochaContactFields,
      RolochaExtendedColors
    >,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)
  },
})

export default Rolocha
