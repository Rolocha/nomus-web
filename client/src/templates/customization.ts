export declare namespace CustomizableFieldSpec {
  export interface ContactInfo {
    label?: string
    placeholder?: string
    required?: boolean
    defaultValue?: any
  }

  export interface Color {
    defaultValue: string
  }

  export interface QRCode {
    url: string
  }

  export interface Graphic {
    size: {
      min: number
      max: number
      step: number
      defaultValue: number
    }
  }

  export type Any = ContactInfo | Color | QRCode | Graphic
}

export declare namespace CustomizableField {
  export type Graphic = { url?: string | null; size?: number }
  export type ContactInfo = string
  export type Color = string
  export type QRCode = string // the URL
}

// export type CustomizableFieldToSpec = {
//   [CustomizableField.Graphic]
// }
