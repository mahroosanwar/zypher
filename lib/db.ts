/* eslint no-var: 0 */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// Test database connection
async function testDbConnection() {
  try {
    await db.$connect();
    console.log("Prisma connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testDbConnection();
