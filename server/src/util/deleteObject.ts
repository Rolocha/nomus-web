import { mongoose } from '@typegoose/typegoose'
import DeletedObject from 'src/models/DeletedObject'

export const deleteObject = (model: { id: string; mongo: typeof mongoose.Model }) => {
  DeletedObject.mongo.create({
    id: model.id,
    deletedObject: JSON.stringify(this),
  })
  model.mongo.deleteOne({ id: model.id })
}
