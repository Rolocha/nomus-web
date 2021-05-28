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

  it('only defines contact info fields that the backend will accept', () => {
    // Keep in sync with TemplateContactInfoFields in server/src/models/subschemas.ts
    const allowedFields = [
      'name',
      'line1',
      'line2',
      'line3',
      'line4',
      'headline',
      'footer',
    ]

    expect(
      Object.values(templateLibrary).every((template) =>
        template.contactInfoFieldNames.every((fieldName) =>
          allowedFields.includes(fieldName),
        ),
      ),
    ).toBe(true)
  })
})
