import "dotenv/config";
import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis;
const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL || null;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL or DIRECT_URL in environment variables."
  );
}

const pool = new Pool({
  connectionString,
  max: 5,
});
const adapter = new PrismaNeon(pool);

export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
