import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { BaseModel } from './BaseModel'

// @ts-ignore
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true, _id: String } })
export class MigrationEvent extends BaseModel({
  prefix: 'migrev',
}) {
  static mongo: ReturnModelType<typeof MigrationEvent>

  @prop({ required: true })
  migrationName: string
}

// Attach the mongoose model onto the core model itself
export const MigrationEventModel = getModelForClass(MigrationEvent)
MigrationEvent.mongo = MigrationEventModel

export default MigrationEvent
