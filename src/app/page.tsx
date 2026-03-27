import PhaseCard from "@/components/PhaseCard";
import Link from "next/link";

/**
 * Landing page for the application. It introduces the context
 * and outlines the phases.
 */

const phases = [
  {
    title: "Phase 1: Analyse & Refactor",
    description: "Organize the application by separating context, hooks, and UI components into clear, well-structured modules to improve maintainability and readability. Ensure that components properly handle different application states by adding loading indicators, error handling, and empty state messages wherever they are missing, so the user experience remains clear and responsive during data fetching, failures, or when no data is available."
  },
  {
    title: "Phase 2: Extend & Design",
    description: "Implement filtering by status, summary counts, and a history log to improve visibility and tracking. Add review actions such as approve, flag, and needs revision, and create a persist endpoint to save updates and ensure changes propagate across components. Design forms and interactions with proper validation to maintain data accuracy and a smooth user experience."
  },
  {
    title: "Phase 3: Pagination & Optimistic Concurrency",
    description: "Implemented both server-side and client-side pagination to efficiently manage large datasets. Handled optimistic concurrency by introducing a version number to track record updates, which helped prevent race conditions. This also allows users to detect stale server state and decide whether to proceed with updating the record or refresh the latest data."
  },
  {
    title: "Phase 4: Database Integration",
    description: "Integrated the application with serverless PostgreSQL, replacing in-memory data with a persistent database. Used Drizzle ORM with Neon serverless Postgres for efficient database interactions, and designed custom schemas for records and record history. The history data is stored in the database to support auditing and tracking changes over time."
  },
  {
    title: "Phase 5: Authentication",
    description: "Integrated Better Auth for authentication using the client-side SDK instead of server actions to simplify integration. Created custom schemas for authentication tables and stored them in Neon serverless PostgreSQL. Built sign-in and sign-up pages using React Hook Form with Zod validation to ensure secure and reliable form handling."
  },
  {
    title: "Phase 6: API Enhancements & Error Handling",
    description: "Added POST and DELETE endpoints to support creating and removing records. Implemented a delete action in the UI with a delete icon and added a concurrency check to prevent deleting stale records. Also improved error handling by ensuring validation and server errors are displayed in the correct UI locations, providing clearer feedback to users."
  },
  {
    title: "Phase 7: Roles & Permissions",
    description: "Implemented role-based access control with three roles: viewer, reviewer, and admin, each with defined permissions for accessing and modifying records. Integrated Better Auth with the admin plugin to manage roles and permissions securely. Built an admin dashboard to view, update, and manage user roles, ensuring controlled access to critical actions across the application."
  },
  {
    title: "Phase 8: Testing & Coverage",
    description: "Added comprehensive test cases using Vitest for all features introduced after Phase 2, including dialogs, hooks, and API interactions. Implemented mocking strategies for context, hooks, and API services to ensure isolated and reliable tests. Achieved over 90% test coverage while validating edge cases, error handling, and role-based behavior across the application."
  }
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-sm font-medium text-muted-foreground">
          DataSpec Pro
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">
          Dashboard Workflow
        </h1>
        <p className="text-base text-muted-foreground mt-4">
          This application is a simplified review and annotation dashboard
          inspired by VectorCam&apos;s production system.  This version focuses on improving an
          imperfect implementation, design clean abstractions and
          extend it with realistic features.
        </p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <PhaseCard {...phases[0]}/>
          <PhaseCard {...phases[1]}/>
          <PhaseCard {...phases[2]}/>
          <PhaseCard {...phases[3]}/>
          <PhaseCard {...phases[4]}/>
          <PhaseCard {...phases[5]}/>
          <PhaseCard {...phases[6]}/>
          <PhaseCard {...phases[7]}/>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Dashboard →
          </Link>
          <p className="text-xs text-muted-foreground">
            Tip: Request admin to change role to access all the features
          </p>
        </div>

        <footer className="mt-14 border-t pt-6 text-xs text-muted-foreground">
          This application uses Next.js 16+ App router
        </footer>
      </div>
    </main>
  );
}
