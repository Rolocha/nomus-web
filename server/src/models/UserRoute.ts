import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'
import { BaseModel } from './BaseModel'

import { Ref } from './scalars'
import User from './User'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class UserRoute extends BaseModel({
  prefix: 'usrrt',
}) {
  static mongo: ReturnModelType<typeof UserRoute>

  @prop({ _id: false, ref: () => User, required: true, type: String })
  @Field(() => User, { nullable: false })
  user: Ref<User>

  @prop({ required: true })
  @Field()
  routeType: string

  @prop({ required: true })
  @Field()
  url: string
}

// Attach the mongoose model onto the core model itself
UserRoute.mongo = getModelForClass(UserRoute)

export default UserRoute
