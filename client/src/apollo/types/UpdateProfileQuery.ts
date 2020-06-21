/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProfileUpdateInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: UpdateProfileQuery
// ====================================================

export interface UpdateProfileQuery_updateProfile_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface UpdateProfileQuery_updateProfile {
  __typename: 'User'
  id: string
  username: string | null
  name: UpdateProfileQuery_updateProfile_name | null
  profilePicUrl: string | null
  headline: string | null
  phoneNumber: string | null
  email: string | null
  bio: string | null
}

export interface UpdateProfileQuery {
  updateProfile: UpdateProfileQuery_updateProfile
}

export interface UpdateProfileQueryVariables {
  updatedUser: ProfileUpdateInput
}