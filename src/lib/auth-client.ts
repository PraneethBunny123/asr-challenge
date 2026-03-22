import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, viewer, reviewer } from "@/lib/permissions";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        reviewer,
        viewer,
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
