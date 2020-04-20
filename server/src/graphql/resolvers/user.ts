import { IApolloContext } from 'src/graphql/types'
import { Resolver, Query, Ctx } from 'type-graphql'
import { User } from 'src/models'

@Resolver()
class UserResolver {
  @Query(() => User)
  currentUser(@Ctx() context: IApolloContext) {
    if (context.user) {
      return context.user
    } else {
      throw new Error('No user object present on Apollo context')
    }
  }
}
export default UserResolver
