import * as React from 'react'
import BusinessCardFan from 'src/components/BusinessCardFan'
import templateLibrary from 'src/templates'
import { TemplateID } from 'src/templates/types'

interface Props {
  templateId: TemplateID
}

const SampleTemplateCard = ({ templateId }: Props) => {
  const template = templateLibrary[templateId]
  const [images, setImages] = React.useState<null | {
    front: string
    back: string
  }>(null)
  React.useEffect(() => {
    const contactInfo = Object.keys(template.contactInfoSpec).reduce<
      Record<string, string>
    >((acc, infoItem) => {
      acc[infoItem] = template.contactInfoSpec[infoItem].placeholder
      return acc
    }, {})
    contactInfo.name = template.name

    const colorScheme = Object.keys(template.colorSchemeSpec).reduce<
      Record<string, string>
    >((acc, specItem) => {
      acc[specItem] = template.colorSchemeSpec[specItem].defaultValue
      return acc
    }, {})

    // @ts-expect-error TS doesn't seem to have types for this API yet
    const documentFontFaceSet = document.fonts as any
    documentFontFaceSet.ready
      .then(() =>
        template.renderBothSidesToDataUrls({
          contactInfo,
          colorScheme,
          graphic: {
            url: template.graphicSpec?.defaultGraphic ?? '/logo.png',
            size: 1,
          },
          qrCodeUrl: 'https://nomus.me',
          omittedContactInfoFields: Object.keys(
            template.contactInfoSpec,
          ).filter((key) => !Object.keys(contactInfo).includes(key)),
        }),
      )
      .then(setImages)
  }, [template])

  return images ? (
    <BusinessCardFan frontImageUrl={images.front} backImageUrl={images.back} />
  ) : null
}

export default SampleTemplateCard
