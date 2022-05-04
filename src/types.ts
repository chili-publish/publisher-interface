export enum ResultType {
  error,
  ok
}

export type Ok<T> = {
  isOk: true,
  isError: false,
  ok: T,
  error: undefined
}

export type Err = {
  isOk: false,
  isError: true,
  ok: undefined,
  error: string
}

export type Result<T> = Ok<T> | Err;

export function Ok<T>(val: T): Ok<T> {
  return {
    isOk: true,
    isError: false,
    ok: val,
    error: undefined
  }
}

export function Err(val: string): Err {
  return {
    isOk: false,
    isError: true,
    ok: undefined,
    error: val
  }
}
