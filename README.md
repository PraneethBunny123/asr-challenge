# VectorCam

This repository contains a review & annotation dashboard built with **Next.js (App Router)**. 

## Running the project

1. Ensure you are using **Node.js 20.17.0**.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Database and Auth Setup:
   
   Setup .env file

   ```bash
   DATABASE_URL=YOUR_DATABASE_URL # Skip to use in memory data
   BETTER_AUTH_SECRET=YOUR_BETTER_AUTH_SECRET
   BETTER_AUTH_URL=http://localhost:3000 # For prod use YOUR_PUBLIC_APP_URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000 # For prod use YOUR_PUBLIC_APP_URL
   ```

   Apply schema changes to the database

    ```bash
   # For local development & quick prototyping 
   npx drizzle-kit push

   # For production & reviewable SQL file (see docs for more info)
   npx drizzle-kit generate

   npx drizzle-kit migrate
   ```

    Seed the db tables

   ```bash
   npx tsx src/db/seed.ts # Skip to use in memory data
   ```
   
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Navigate to `http://localhost:3000` to access the app. The dasboard lives under the `/dashboard` route.

## Context

DataSpec Pro is inspired by VectorCam which is used by entomologists and public health program managers to review and annotate specimen data collected in the field. This application focuses on the **web dashboard** portion of the system. A **mock API** (`/api/mock/records`) serves an in‑memory list of records. 

## Phase 1 – Analyse & Refactor


## Phase 2 – Extend & Design 


## Phase 3 – Pagination & Optimistic Concurrency


## Phase 4 – Database Integration


## Phase 5 – Authentication


## Phase 6 – API Enhancements & Error Handling


## Phase 7 – Roles & Permissions


## Phase 8 – Testing & Coverage