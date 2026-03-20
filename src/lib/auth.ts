import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../index";
import * as authSchema from "../db/authSchema"
import { admin } from "better-auth/plugins"


export const auth = betterAuth({
  database: drizzleAdapter(db, { 
    provider: "pg", // or "pg" or "mysql"
    schema: {
      user: authSchema.usersTable,
      session: authSchema.sessionsTable,
      account: authSchema.accountsTable,
      verification: authSchema.verificationsTable,
    }
  }), 
  //... the rest of your config
  emailAndPassword: { 
    enabled: true, 
  },
  plugins: [
    admin() 
  ]
});