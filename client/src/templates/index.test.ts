import templateLibrary from 'src/templates'

describe('templates', () => {
  it('only defines colors that the backend will accept', () => {
    // Keep in sync with TemplateColorScheme in server/src/models/subschemas.ts
    const allowedColors = [
      'background',
      'text',
      'accent',
      'accent2',
      'accent3',
      'accent4',
    ]

    expect(
      Object.values(templateLibrary).every((template) =>
        template.colorKeys.every((colorKey) =>
          allowedColors.includes(colorKey),
        ),
      ),
    ).toBe(true)
  })
})
