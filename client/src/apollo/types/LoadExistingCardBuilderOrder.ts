/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardSpecBaseType } from "./globalTypes";

// ====================================================
// GraphQL query operation: LoadExistingCardBuilderOrder
// ====================================================

export interface LoadExistingCardBuilderOrder_order_cardVersion_contactInfo {
  __typename: "TemplateContactInfoFields";
  name: string | null;
  line1: string | null;
  line2: string | null;
  line3: string | null;
  line4: string | null;
  headline: string | null;
  footer: string | null;
}

export interface LoadExistingCardBuilderOrder_order_cardVersion_colorScheme {
  __typename: "TemplateColorScheme";
  background: string;
  text: string;
  accent: string | null;
  accent2: string | null;
  accent3: string | null;
  accent4: string | null;
}

export interface LoadExistingCardBuilderOrder_order_cardVersion {
  __typename: "CardVersion";
  id: string;
  baseType: CardSpecBaseType;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  templateId: string | null;
  /**
   * User-specified contact info, only present for template-based card versions
   */
  contactInfo: LoadExistingCardBuilderOrder_order_cardVersion_contactInfo | null;
  /**
   * User-specified color scheme, only present for template-based card versions
   */
  colorScheme: LoadExistingCardBuilderOrder_order_cardVersion_colorScheme | null;
  qrCodeUrl: string | null;
}

export interface LoadExistingCardBuilderOrder_order {
  __typename: "Order";
  id: string;
  cardVersion: LoadExistingCardBuilderOrder_order_cardVersion;
}

export interface LoadExistingCardBuilderOrder {
  order: LoadExistingCardBuilderOrder_order | null;
}

export interface LoadExistingCardBuilderOrderVariables {
  orderId: string;
}
