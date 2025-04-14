import { CreateGroup, UpdateGroup } from '@packages/types'
import { db } from '../../db'

export const getAllGroups = async () => {
  return await db.selectFrom('Group').selectAll().execute()
}

export const getGroupById = async (id: string) => {
  const group = await db
    .selectFrom('Group')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  return group
}

export const createGroup = async (group: CreateGroup) => {
  return await db.insertInto('Group').values(group).execute()
}

export const updateGroup = async (id: string, group: UpdateGroup) => {
  return await db.updateTable('Group').set(group).where('id', '=', id).execute()
}

export const deleteGroup = async (id: string) => {
  return await db.deleteFrom('Group').where('id', '=', id).execute()
}
