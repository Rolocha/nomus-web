import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, Ref, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { UUIDScalar, UUIDType } from 'src/models/scalars'
import { User } from 'src/models'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class UserRoute {
  static mongo: ReturnModelType<typeof UserRoute>

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
  readonly _id: UUIDType

  @prop({ _id: false, required: true })
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
