import { db } from '../../db'

export const getLogs = async () => {
  const logs = await db.selectFrom('Log').selectAll().execute()

  return logs
}
