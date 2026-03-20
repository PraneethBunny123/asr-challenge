/**
 * Creates the first admin user. Run once after the initial deploy.
 * If the user already exists, it just promotes them to admin.
 *
 *   npx tsx src/db/seed-admin.ts
 *
 * Set these in your .env before running:
 *   ADMIN_EMAIL=you@example.com
 *   ADMIN_PASSWORD=a-strong-password
 *   ADMIN_NAME="Your Name"
 */

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { usersTable } from "@/db/authSchema";
import { auth } from "@/lib/auth";

const email = process.env.ADMIN_EMAIL    ?? "";
const password = process.env.ADMIN_PASSWORD ?? "";
const name = process.env.ADMIN_NAME     ?? "Admin";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  process.exit(1);
}

async function seedAdmin() {
  const [existingAdmin] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if(existingAdmin?.role === "admin") {
    console.log(`${existingAdmin.name} with email:${existingAdmin.email} is already an admin`)
    return;
  }
    
  if (existingAdmin) {
    await db
      .update(usersTable)
      .set({ role: "admin" })
      .where(eq(usersTable.id, existingAdmin.id));
    console.log(`Existing user ${email} promoted to admin`);
  } else {
    const newAdmin = await auth.api.createUser({
      body: { email, password, name, role: "admin" },
    });
    console.log(`Admin user ${newAdmin.user.name} with email:${newAdmin.user.email} created`);
  }

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});