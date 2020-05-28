/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UCPCardsSectionQuery
// ====================================================

export interface UCPCardsSectionQuery_user {
  __typename: 'User'
  id: string
  defaultCardVersion: any | null
}

export interface UCPCardsSectionQuery_cardVersions {
  __typename: 'CardVersion'
  id: string
  createdAt: any
  frontImageUrl: string
  backImageUrl: string
}

export interface UCPCardsSectionQuery_cardVersionsStats {
  __typename: 'CardVersionStats'
  id: string
  numCardsOrdered: number
  numTaps: number
}

export interface UCPCardsSectionQuery {
  user: UCPCardsSectionQuery_user
  cardVersions: UCPCardsSectionQuery_cardVersions[]
  cardVersionsStats: UCPCardsSectionQuery_cardVersionsStats[]
}
