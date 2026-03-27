import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Set it in module-12/.env')
}

// Use Neon serverless transport (443) instead of raw TCP (5432).
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString })

const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'], 
})

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = db
}

export default db