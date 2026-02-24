/**
 * Run once to populate the database with the specimen records that were
 * previously hardcoded in route.ts.
 *
 *   npx tsx src/db/seed.ts
 */
import { db } from "../index";
import { recordsTable } from "./schema";
import { records } from "@/app/api/mock/records/route";

async function seed() {
  console.log("Seeding records…");

  await db
    .insert(recordsTable)
    .values(records)
    .onConflictDoNothing(); // safe to re-run; skips rows that already exist

  console.log(`Inserted ${records.length} records`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});