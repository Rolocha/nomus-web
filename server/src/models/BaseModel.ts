import mongoose from 'mongoose'
import { modelOptions, prop } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

const defaultId = (prefix: string) => () => {
  const id = mongoose.Types.ObjectId()
  return `${prefix}_${id.toHexString()}`
}

export interface BaseModelArgs {
  prefix: string
}

export const BaseModel = ({ prefix }: BaseModelArgs) => {
  @modelOptions({
    schemaOptions: {
      // @ts-ignore Bad types from typegoose here falsely require a boolean
      _id: String,
    },
  })
  @ObjectType()
  class BaseModel {
    @prop({ required: true, default: defaultId(prefix) })
    _id: string

    // Override the 'id' virtual property getters/setters,
    // TODO: Investigate if this is still necessary, mongoose may auto-create this virtual getter
    @Field() // Expose the pretty underscore-less string version on GraphQL schema
    get id(): string {
      return this._id
    }

    set id(id: string) {
      this._id = id
    }
  }
  return BaseModel
}
