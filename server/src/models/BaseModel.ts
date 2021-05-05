import { modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import DeletedObject from 'src/models/DeletedObject'
import { Result } from 'src/util/error'
import { Field, ObjectType } from 'type-graphql'

const defaultId = (prefix: string) => () => {
  const id = mongoose.Types.ObjectId()
  return `${prefix}_${id.toHexString()}`
}

export interface BaseModelArgs {
  prefix: string
}

export type DeletedObjectResult = Result<undefined, 'id-not-found' | 'delete-error'>

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

    public static async delete(id: string): Promise<DeletedObjectResult> {
      const model = await this.mongo.findById(id)

      if (model == null) {
        return Result.fail('id-not-found')
      }

      try {
        await DeletedObject.mongo.create({
          _id: id,
          deletedObject: JSON.stringify(model.toJSON()),
        })
        await this.mongo.deleteOne({ _id: id })
        return Result.ok()
      } catch (e) {
        return Result.fail('delete-error')
      }
    }

    public static async batchDelete(ids: string[]): Promise<DeletedObjectResult> {
      // The ids have to be for the same model, mixed array behavior is undefined
      const models = await this.mongo.find({ _id: { $in: ids } })

      if (models.length !== ids.length) {
        return Result.fail('id-not-found')
      }

      try {
        const batchDeletionPromises = models.map(async (model) => {
          await DeletedObject.mongo.create({
            _id: model.id,
            deletedObject: JSON.stringify(model.toJSON()),
          })
          await this.mongo.deleteOne({ _id: model.id })
        })
        await Promise.all(batchDeletionPromises)
      } catch (e) {
        return Result.fail('delete-error')
      }
      return Result.ok()
    }
  }

  return BaseModel
}
