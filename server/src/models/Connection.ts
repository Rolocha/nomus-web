import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants'
import { Field } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { Ref } from './scalars'
import { User } from './User'

// Not using @ObjectType() because we prefer to expose the Contact object rather than this Connection

export class Connection extends BaseModel({
  prefix: 'cnxn',
}) {
  static mongo: ReturnModelType<typeof Connection>

  //User initiating the connection: *a* -> b
  @prop({ required: true, ref: 'User', type: String })
  @Field(() => User, { nullable: false })
  from: Ref<User>

  //User connected to: a -> *b*
  @prop({ required: true, ref: 'User', type: String })
  @Field(() => User, { nullable: false })
  to: Ref<User>

  @prop({ required: false })
  @Field({ nullable: true })
  meetingPlace: string

  @prop({ required: false })
  @Field({ nullable: true })
  meetingDate: string

  //Notes on meeting this User
  @prop({ required: false })
  @Field({ nullable: true })
  notes: string

  @prop({ required: false, default: [], type: String }, WhatIsIt.ARRAY)
  @Field(() => [String], { nullable: false })
  tags: Array<string>
}

// Attach the mongoose model onto the core model itself
export const ConnectionModel = getModelForClass(Connection)
Connection.mongo = ConnectionModel

export default Connection
