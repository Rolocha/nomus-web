/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardSpecBaseType } from './globalTypes'

// ====================================================
// GraphQL query operation: LoadExistingCardBuilderOrder
// ====================================================

export interface LoadExistingCardBuilderOrder_order_shippingAddress {
  __typename: 'Address'
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
}

export interface LoadExistingCardBuilderOrder_order_user_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface LoadExistingCardBuilderOrder_order_user {
  __typename: 'User'
  name: LoadExistingCardBuilderOrder_order_user_name | null
}

export interface LoadExistingCardBuilderOrder_order_cardVersion_contactInfo {
  __typename: 'TemplateContactInfoFields'
  name: string | null
  line1: string | null
  line2: string | null
  line3: string | null
  line4: string | null
  headline: string | null
  footer: string | null
}

export interface LoadExistingCardBuilderOrder_order_cardVersion_colorScheme {
  __typename: 'TemplateColorScheme'
  background: string
  text: string
  accent: string | null
  accent2: string | null
  accent3: string | null
  accent4: string | null
}

export interface LoadExistingCardBuilderOrder_order_cardVersion {
  __typename: 'CardVersion'
  id: string
  baseType: CardSpecBaseType
  frontImageUrl: string | null
  backImageUrl: string | null
  qrCodeUrl: string | null
  templateId: string | null
  /**
   * User-specified contact info, only present for template-based card versions
   */
  contactInfo: LoadExistingCardBuilderOrder_order_cardVersion_contactInfo | null
  /**
   * User-specified color scheme, only present for template-based card versions
   */
  colorScheme: LoadExistingCardBuilderOrder_order_cardVersion_colorScheme | null
}

export interface LoadExistingCardBuilderOrder_order {
  __typename: 'Order'
  id: string
  quantity: number
  shippingName: string | null
  shippingAddress: LoadExistingCardBuilderOrder_order_shippingAddress | null
  user: LoadExistingCardBuilderOrder_order_user | null
  cardVersion: LoadExistingCardBuilderOrder_order_cardVersion
}

export interface LoadExistingCardBuilderOrder {
  order: LoadExistingCardBuilderOrder_order
}

export interface LoadExistingCardBuilderOrderVariables {
  orderId: string
}
