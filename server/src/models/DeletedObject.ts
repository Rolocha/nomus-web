import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
class DeletedObject {
  static mongo: ReturnModelType<typeof DeletedObject>

  @prop({ required: true, unique: true })
  _id: string

  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  @prop({ required: true })
  deletedObject: string

  createdAt: Date
}

DeletedObject.mongo = getModelForClass(DeletedObject)

export default DeletedObject
