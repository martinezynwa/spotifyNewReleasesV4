import { Request } from 'express'

export interface RequestProps<T> extends Request {
  body: T
}
