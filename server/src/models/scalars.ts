import { DocumentType } from '@typegoose/typegoose'

export type Ref<T> = string | DocumentType<T>
