import { db } from '../db'

interface LoggerProps {
  action: string
  message: string
  userId?: string
}

export const logger = async ({ userId, action, message }: LoggerProps) => {
  return await db
    .insertInto('Log')
    .values({
      userId,
      action,
      message,
    })
    .execute()
}
