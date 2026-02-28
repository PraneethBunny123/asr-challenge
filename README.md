# VectorCam

This repository contains a review & annotation dashboard built with **Next.js (App Router)**. 

## Running the project

1. Ensure you are using **Node.js 20.17.0**.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Database Setup:
   
   Replace DATABASE_URL in your .env

   ```bash
   DATABASE_URL=YOUR_DATABASE_URL
   ```

   Apply schema changes to the database

    ```bash
   npx drizzle-kit push
   ```

    Seed the db tables

   ```bash
   npx tsx src/db/seed.ts
   ```

4. Run with In-Memory Data:
   
   Replace GET endpoint return value to use in-memory records

   ```bash
   return NextResponse.json({records: paginatedRecords, totalCount});
   ```
   
5. Start the development server:

   ```bash
   npm run dev
   ```

6. Navigate to `http://localhost:3000` to access the app. The dasboard lives under the `/interview` route.

## Context

VectorCam is used by entomologists and public health program managers to review and annotate specimen data collected in the field. This exercise focuses on the **web dashboard** portion of the system. A **mock API** (`/api/mock/records`) serves an in‑memory list of records and supports `GET` and `PATCH` operations. 

## Phase 1 – Analyse & Refactor


## Phase 2 – Extend & Design 


## Phase 3 – Pagination & Optimistic Concurrency


## Phase 4 – Database Integration

