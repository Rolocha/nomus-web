import { modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import DeletedObject from 'src/models/DeletedObject'
import { Field, ObjectType } from 'type-graphql'

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
    static mongo: ReturnModelType<typeof BaseModel>

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

    public static async delete(id: string) {
      const model = await this.mongo.findById(id)
      // check that model exists
      await DeletedObject.mongo.create({
        _id: id,
        deletedObject: JSON.stringify(model.toJSON()),
      })
      await this.mongo.deleteOne({ _id: id })
    }
  }

  return BaseModel
}
