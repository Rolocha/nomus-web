import { mongoose } from '@typegoose/typegoose'
import DeletedObject from 'src/models/DeletedObject'

export const deleteObject = (model) => {
  DeletedObject.mongo.create({
    id: model._id,
    deletedObject: JSON.stringify(this),
  })
  model.mongo.deleteOne({ id: model.id })
}
