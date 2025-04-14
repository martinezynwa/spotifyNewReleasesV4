import { db } from '../../db'

export const getAllUsers = async () => {
  return await db.selectFrom('User').selectAll().execute()
}

export const getUserById = async (id: string) => {
  return await db
    .selectFrom('User')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}
