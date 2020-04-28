import { IApolloContext } from 'src/graphql/types'
import { Resolver, Query, Ctx, Authorized } from 'type-graphql'
import { User, Role } from 'src/models/User'

@Resolver()
class UserResolver {
  @Authorized(Role.User, Role.Admin)
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
