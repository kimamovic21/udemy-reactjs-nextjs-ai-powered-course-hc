import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

const pool = globalForPrisma.prismaPool ?? new Pool({
	connectionString,
});

const adapter = globalForPrisma.prismaAdapter ?? new PrismaPg(pool);

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = db;
	globalForPrisma.prismaPool = pool;
	globalForPrisma.prismaAdapter = adapter;
}
