import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'
import { UUIDScalar, UUIDType, Ref } from './scalars'
import { User } from './User'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
export class Connection {
  static mongo: ReturnModelType<typeof Connection>

  @prop({ required: true, default: MUUID.v4 })
  @Field((type) => UUIDScalar)
  _id: UUIDType

  // Override the 'id' virtual property getters/setters since Mongoose doesn't
  // know how to handle our custom MUUID implementation
  @Field() // Expose the pretty underscore-less string version on GraphQL schema
  get id(): string {
    return MUUID.from(this._id).toString()
  }

  set id(id: string) {
    this._id = MUUID.from(id)
  }

  //User initiating the connection: *a* -> b
  @prop({ required: true, ref: 'User', type: Buffer })
  @Field(() => User, { nullable: false })
  from: Ref<User>

  //User connected to: a -> *b*
  @prop({ required: true, ref: 'User', type: Buffer })
  @Field(() => User, { nullable: false })
  to: Ref<User>

  //Notes on meeting this User
  @prop({ required: false })
  @Field({ nullable: true })
  notes: string
}

// Attach the mongoose model onto the core model itself
export const ConnectionModel = getModelForClass(Connection)
Connection.mongo = ConnectionModel

export default Connection
