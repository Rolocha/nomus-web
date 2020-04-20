import { Field, Resolver, Query, Mutation, Arg, ObjectType, InputType } from 'type-graphql'

import User from 'src/models/User'

@ObjectType()
class AuthSuccessResponse {
  @Field()
  token: string

  @Field((returns) => User)
  user: typeof User
}

@InputType()
class SignupInput {
  @Field() firstName!: string
  @Field({ nullable: true }) middleName: string
  @Field() lastName!: string
  @Field() email: string
  @Field() password: string
}

@Resolver()
export default class AuthResolver {
  @Query(() => AuthSuccessResponse)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await User.mongo.findByCredentials(email, password)
    const token = user.generateAuthToken()
    return { user, token }
  }

  @Mutation(() => AuthSuccessResponse)
  async signup(@Arg('data') { firstName, middleName, lastName, email, password }: SignupInput) {
    const user = await User.mongo.create({
      name: {
        first: firstName,
        middle: middleName,
        last: lastName,
      },
      email,
      password,
    })
    const token = user.generateAuthToken()
    return { user, token }
  }
}
