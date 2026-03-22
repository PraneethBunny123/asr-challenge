import { useSession } from "@/lib/auth-client";
import { AppRole } from "../types";

export function useRole() {
  const { data: session } = useSession();

  const role = session?.user.role as AppRole;;
  
  return {
    role,
    isViewer: role === "viewer",
    isReviewer: role === "reviewer",
    isAdmin: role === "admin",

    canCreate: role === "reviewer" || role === "admin",
    canUpdate: role === "reviewer" || role === "admin",
    canDelete: role === "admin",
  };
}