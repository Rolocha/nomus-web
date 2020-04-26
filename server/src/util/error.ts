// Inspired by https://khalilstemmler.com/articles/enterprise-typescript-nodejs/handling-errors-result-class/
export class Result<T, E extends string> {
  public isSuccess: boolean
  public error: NamedError<E> | undefined
  private _value: T

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
        successful and contain an error`)
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
        needs to contain an error message`)
    }

    this.isSuccess = isSuccess
    this.error = new NamedError(error)
    this._value = value

    Object.freeze(this)
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`)
    }

    return this._value
  }

  public static ok<U>(value?: U): Result<U, any> {
    return new Result<U, any>(true, null, value)
  }

  public static fail<U extends string>(error: U): Result<any, U> {
    return new Result<any, U>(false, error)
  }

  // public static combine(results: Result<any>[]): Result<any> {
  //   for (let result of results) {
  //     if (result.isFailure) return result
  //   }
  //   return Result.ok<any>()
  // }
}

export class NamedError<T extends string> extends Error {
  public name: T

  constructor(name: T, message?: string) {
    super(message)
    this.name = name
  }
}
