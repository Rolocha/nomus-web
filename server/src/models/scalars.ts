import { Ref as TypegooseRef } from '@typegoose/typegoose'

export type Ref<T> = TypegooseRef<T, string>
