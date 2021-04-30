// These interfaces are used by each template definition to STATICALLY specify
// metadata about which fields are customizable (and how) for this template.
// The STATIC part is key -- these are NOT fields meant to be customized by the user.
export declare namespace CustomizableFieldSpec {
  export interface ContactInfo {
    label: string
    placeholder: string
    required: boolean
    defaultValue?: string
  }

  export interface Color {
    defaultValue: string
  }

  export type Any = ContactInfo | Color

  // Note: Graphic and QRCode don't show up here even though they do in CustomizableField.
  // This is because these fields' "spec" cannot be customized on a template-by-template
  // basis.
  //
}

// These interfaces represent what the user can customize for each
// field type.
export declare namespace CustomizableField {
  export type Graphic = {
    url?: string | null
    // A number in the range (0, 1] that represents how large the image should be
    // Each template makes its own decision on what size=1 maps to in terms of actual
    // width/height
    size?: number
  }
  export type ContactInfo = string
  export type Color = string
  export type QRCode = string // the URL
}

export type BaseColorScheme = {
  // All templates must specify some base colors
  background: string
  accent: string
  text: string
  // Each template can optionally add more colors to its scheme if needed
}

export type ColorScheme<ExtendedColors extends string> = BaseColorScheme &
  Record<ExtendedColors, string>
