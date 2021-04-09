import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType({
  description: 'Represents a deleted DB object, stored as strignified JSON',
})
class DeletedObject {
  static mongo: ReturnModelType<typeof DeletedObject>

  @prop({ required: true, unique: true })
  _id: string

  @Field()
  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  @prop({ required: true })
  @Field()
  deletedObject: string

  @Field()
  createdAt: Date
}

DeletedObject.mongo = getModelForClass(DeletedObject)

export default DeletedObject
