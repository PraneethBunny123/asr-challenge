import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../index";

export const auth = betterAuth({
  database: drizzleAdapter(db, { 
    provider: "pg", // or "pg" or "mysql"
  }), 
  //... the rest of your config
  emailAndPassword: { 
    enabled: true, 
  },
});