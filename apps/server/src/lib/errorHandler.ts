import { NextFunction, Request, Response } from 'express'

export const ErrorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER: 500,
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error:', err)

  const statusCode = (err as any).statusCode || ErrorCodes.INTERNAL_SERVER
  const message = err.message || 'Internal server error'

  return res.status(statusCode).json({ error: message })
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export const sendNotFound = (res: Response, message = 'Resource not found') => {
  return res.status(ErrorCodes.NOT_FOUND).json({ error: message })
}

export const sendBadRequest = (res: Response, message = 'Bad request') => {
  return res.status(ErrorCodes.BAD_REQUEST).json({ error: message })
}

export const sendUnauthorized = (res: Response, message = 'Unauthorized') => {
  return res.status(ErrorCodes.UNAUTHORIZED).json({ error: message })
}

export const sendForbidden = (res: Response, message = 'Forbidden') => {
  return res.status(ErrorCodes.FORBIDDEN).json({ error: message })
}
