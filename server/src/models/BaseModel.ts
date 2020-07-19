import mongoose from 'mongoose'
import { prop } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

const defaultId = (prefix: string) => () => {
  const id = mongoose.Types.ObjectId()
  return `${prefix}_${id.toHexString()}`
}

export interface BaseModelArgs {
  prefix: string
}

export const BaseModel = ({ prefix }: BaseModelArgs) => {
  @ObjectType()
  class BaseModel {
    @prop({ required: true, default: defaultId(prefix) })
    _id: string

    // Override the 'id' virtual property getters/setters since Mongoose doesn't
    // know how to handle our custom MUUID implementation
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
