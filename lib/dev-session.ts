// Mock session for development mode
export const mockSession = {
  user: {
    id: "dev-user-1",
    name: "Dev User",
    email: "dev@aurorahorizon.local",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser",
    role: "admin", // Change to 'admin' to test admin features, 'user' for regular user
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
};

// Helper to get session in development or production
export async function getDevSession() {
  const isDev = process.env.NODE_ENV === "development";
  
  if (isDev) {
    return mockSession;
  }
  
  // In production, use real auth - dynamically import to avoid issues
  try {
    const { auth } = await import("@/auth");
    return auth();
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
