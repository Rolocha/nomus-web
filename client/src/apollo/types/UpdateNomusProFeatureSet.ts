/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateNomusProFeatureSetInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: UpdateNomusProFeatureSet
// ====================================================

export interface UpdateNomusProFeatureSet_updateNomusProFeatureSet_featureSet {
  __typename: 'NomusProFeatureSet'
  UseCustomTapLink: boolean
}

export interface UpdateNomusProFeatureSet_updateNomusProFeatureSet {
  __typename: 'NomusProAccessInfo'
  id: string
  hasAccessUntil: number | null
  featureSet: UpdateNomusProFeatureSet_updateNomusProFeatureSet_featureSet | null
}

export interface UpdateNomusProFeatureSet {
  updateNomusProFeatureSet: UpdateNomusProFeatureSet_updateNomusProFeatureSet | null
}

export interface UpdateNomusProFeatureSetVariables {
  featureSetUpdate: UpdateNomusProFeatureSetInput
}
