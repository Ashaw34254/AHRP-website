import { auth } from "@/auth";
import { mockSession } from "./dev-session";

/**
 * Get the current session, using mock session in development mode
 */
export async function getSession() {
  const isDev = process.env.NODE_ENV === "development";
  
  if (isDev) {
    return mockSession;
  }
  
  return await auth();
}
