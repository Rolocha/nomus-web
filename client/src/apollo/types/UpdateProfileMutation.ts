/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProfileUpdateInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: UpdateProfileMutation
// ====================================================

export interface UpdateProfileMutation_updateProfile_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface UpdateProfileMutation_updateProfile {
  __typename: 'User'
  id: string
  name: UpdateProfileMutation_updateProfile_name | null
  /**
   * A URL pointing to the user's profile picture
   */
  profilePicUrl: string | null
  headline: string | null
  phoneNumber: string | null
  email: string | null
  isEmailVerified: boolean
  bio: string | null
  activated: boolean
  position: string | null
  company: string | null
  website: string | null
}

export interface UpdateProfileMutation {
  updateProfile: UpdateProfileMutation_updateProfile
}

export interface UpdateProfileMutationVariables {
  updatedUser: ProfileUpdateInput
}
