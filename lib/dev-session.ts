// Mock session for development mode
export const mockSession = {
  user: {
    id: "dev-user-1",
    name: "Dev User",
    email: "dev@aurorahorizon.local",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser",
    role: "admin", // Change to 'admin' to test admin features, 'user' for regular user
    bio: "Passionate roleplayer and community member. Love immersive RP scenarios!",
    discordUsername: "DevUser#1234",
    discordId: "123456789012345678",
    bannerImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=300&fit=crop",
    badges: JSON.stringify(["veteran", "active", "helpful"]),
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
