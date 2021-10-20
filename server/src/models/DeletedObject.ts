import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'

// We can't use/extend BaseModel in here because BaseModel imports this class and that results in a circular dependency
@modelOptions({
  schemaOptions: {
    // @ts-ignore Bad types from typegoose here falsely require a boolean
    _id: String,
    timestamps: true,
    usePushEach: true,
  },
})
class DeletedObject {
  static mongo: ReturnModelType<typeof DeletedObject>

  @prop({ required: true })
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
