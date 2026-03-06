// import { drizzle } from 'drizzle-orm/neon-http';

// export const db = drizzle(process.env.DATABASE_URL!);
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema'
import * as authSchema from "@/db/authSchema"

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema: {...schema, ...authSchema} });
