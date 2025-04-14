import { DB } from '@example-app/types'
import dotenv from 'dotenv'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
})

const db = new Kysely<DB>({
  dialect,
})

export { db, DB }
