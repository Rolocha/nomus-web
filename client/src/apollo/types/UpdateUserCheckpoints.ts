/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserCheckpoints
// ====================================================

export interface UpdateUserCheckpoints_updateUserCheckpoints_checkpoints {
  __typename: 'UserCheckpoints'
  expressedInterestInOrderingNomusCard: boolean
}

export interface UpdateUserCheckpoints_updateUserCheckpoints {
  __typename: 'User'
  id: string
  checkpoints: UpdateUserCheckpoints_updateUserCheckpoints_checkpoints
}

export interface UpdateUserCheckpoints {
  updateUserCheckpoints: UpdateUserCheckpoints_updateUserCheckpoints
}

export interface UpdateUserCheckpointsVariables {
  checkpointsReached: string[]
}
