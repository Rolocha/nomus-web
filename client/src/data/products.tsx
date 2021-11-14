import * as React from 'react'
import SampleTemplateCard from 'src/components/SampleTemplateCard'
import templateLibrary, { templateNames } from 'src/templates'

export enum ProductCategory {
  TemplateCard,
}

export interface ProductDetails {
  id: string
  name: string
  category: ProductCategory
  price: string
  cta: {
    text: string
    url: string
  }
  description: Array<React.ReactNode>
  preview: React.ReactNode
}

export const products: Array<ProductDetails> = [
  {
    id: 'custom-card',
    name: 'Custom card',
    category: ProductCategory.TemplateCard,
    cta: {
      text: 'Build your custom card',
      url: '/card-studio/custom',
    },
    price: 'from $40.00',
    description: [
      <>
        Have a business card design you've already been using? Hop into the
        custom Card Studio with the button above to upload your designs.
      </>,
      <>Your design + Nomus's tap-to-share technology = unstoppable.</>,
    ],
    preview: <>TODO: Preview image</>,
  },
  // Dynamically generated product item for each of the template cards
  ...templateNames.map((templateId) => {
    const template = templateLibrary[templateId]
    return {
      id: `template-card-${templateId}`,
      name: `${template.name} template card`,
      category: ProductCategory.TemplateCard,
      cta: {
        text: 'Customize your template card',
        url: `/card-studio/template?templateId=${template.name}`,
      },
      price: 'from $40.00',
      description: [<>The {template.name} template is cool.</>],
      preview: <SampleTemplateCard templateId={templateId} />,
    }
  }),
]
