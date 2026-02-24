/**
 * Run once to populate the database with the specimen records that were
 * previously hardcoded in route.ts.
 *
 *   npx tsx src/db/seed.ts
 */
import { db } from "../index";
import { recordsTable } from "./schema";

const seedRecords = [
  {
    id: "1",
    name: "Anopheles gambiae",
    description: "Primary malaria vector collected at site A.",
    status: "pending" as const,
  },
  {
    id: "2",
    name: "Aedes aegypti",
    description: "Dengue / Zika vector collected near standing water.",
    status: "pending" as const,
  },
  {
    id: "3",
    name: "Culex pipiens",
    description: "West Nile vector; well-documented specimen.",
    status: "approved" as const,
    note: "Identification confirmed by morphology.",
  },
  {
    id: "4",
    name: "Simulium damnosum",
    description: "Blackfly - potential onchocerciasis vector.",
    status: "flagged" as const,
    note: "Requires secondary morphological review.",
  },
  {
    id: "5",
    name: "Lutzomyia longipalpis",
    description: "Sand fly - leishmaniasis vector candidate.",
    status: "needs_revision" as const,
    note: "Image quality insufficient for definitive ID.",
  },
  {
    id: "6",
    name: "Phlebotomus papatasi",
    description: "Old World sand fly collected at site C.",
    status: "pending" as const,
  },
  {
    id: "7",
    name: "Mansonia uniformis",
    description: "Brugia malayi vector found in rice paddies.",
    status: "approved" as const,
  },
  {
    id: "8",
    name: "Cimex lectularius",
    description: "Common bed bug; non-vector but public health relevance.",
    status: "pending" as const,
  },
  {
    id: "9",
    name: "Triatoma infestans",
    description: "Kissing bug - Chagas disease vector.",
    status: "flagged" as const,
    note: "Unusual morphology warrants expert review.",
  },
  {
    id: "10",
    name: "Ixodes scapularis",
    description: "Blacklegged tick - Lyme disease vector.",
    status: "approved" as const,
  },
  {
    id: "11",
    name: "Dermacentor variabilis",
    description: "American dog tick collected in suburban site.",
    status: "pending" as const,
  },
  {
    id: "12",
    name: "Amblyomma americanum",
    description: "Lone star tick - partial image series.",
    status: "needs_revision" as const,
    note: "Request full ventral image set.",
  },
];

async function seed() {
  console.log("Seeding records…");

  await db
    .insert(recordsTable)
    .values(seedRecords)
    .onConflictDoNothing(); // safe to re-run; skips rows that already exist

  console.log(`Inserted ${seedRecords.length} records`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});