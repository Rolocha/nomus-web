/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * The base type for a card being built
 */
export enum CardSpecBaseType {
  Custom = 'Custom',
  Manual = 'Manual',
  Template = 'Template',
}

/**
 * Features available in Nomus Pro
 */
export enum NomusProFeature {
  UseCustomTapLink = 'UseCustomTapLink',
}

/**
 * Current State in Order Tracking State Machine
 */
export enum OrderState {
  Actionable = 'Actionable',
  Canceled = 'Canceled',
  Captured = 'Captured',
  Created = 'Created',
  Creating = 'Creating',
  Enroute = 'Enroute',
  Fulfilled = 'Fulfilled',
  Reviewed = 'Reviewed',
}

/**
 * Information one user saves about another such as meeting date, meeting place, and tags
 */
export interface ContactInfoInput {
  meetingPlace?: string | null
  meetingDate?: string | null
  notes?: string | null
  tags?: string[] | null
}

/**
 * Input for udpating user profile
 */
export interface ProfileUpdateInput {
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  email?: string | null
  headline?: string | null
  bio?: string | null
  position?: string | null
  company?: string | null
  activated?: boolean | null
  website?: string | null
}

/**
 * Payload for submitting a card builder order with a custom design
 */
export interface SubmitCustomOrderInput {
  previousOrder?: string | null
  quantity: number
  frontImageDataUrl: any
  backImageDataUrl?: any | null
}

/**
 * Payload for submitting a card builder order with a template-based design
 */
export interface SubmitTemplateOrderInput {
  previousOrder?: string | null
  quantity: number
  templateId: string
  templateName: string
  cardVersionId: string
  colorScheme: TemplateColorSchemeInput
  contactInfo: TemplateContactInfoFieldsInput
  graphic?: any | null
  qrCodeUrl: string
  frontImageDataUrl: any
  backImageDataUrl?: any | null
}

/**
 * Colors defined when customizing a template card
 */
export interface TemplateColorSchemeInput {
  background: string
  text: string
  accent?: string | null
  accent2?: string | null
  accent3?: string | null
  accent4?: string | null
}

/**
 * Contact info fields potentially specified when customizing a template card
 */
export interface TemplateContactInfoFieldsInput {
  name?: string | null
  line1?: string | null
  line2?: string | null
  line3?: string | null
  line4?: string | null
  headline?: string | null
  footer?: string | null
}

export interface UpdateNomusProFeatureSetInput {
  UseCustomTapLink?: boolean | null
}

//==============================================================
// END Enums and Input Objects
//==============================================================
