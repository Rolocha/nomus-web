import { DocumentType } from '@typegoose/typegoose'
import { graphql, GraphQLSchema } from 'graphql'
import Maybe from 'graphql/tsutils/Maybe'

import { createSchema } from 'src/graphql/schema'
import { User, Role } from 'src/models/User'
import { createMockUser } from 'src/__mocks__/models/User'

interface Options {
  source: string
  variableValues?: Maybe<{
    [key: string]: any
  }>
  contextUser?: DocumentType<User>
  asAdmin?: boolean
}

let schema: GraphQLSchema

export const execQuery = async ({
  source,
  variableValues,
  contextUser,
  asAdmin = false,
}: Options) => {
  if (!schema) {
    schema = createSchema()
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      user:
        contextUser ??
        (await createMockUser({
          name: { first: 'Context', last: 'User' },
          email: 'iamthecaptain@now.com',
          roles: [asAdmin ? Role.Admin : Role.User],
        })),
    },
  })
}
