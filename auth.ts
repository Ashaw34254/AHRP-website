import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Development mode bypass
const isDev = process.env.NODE_ENV === "development";

export const config = {
  adapter: PrismaAdapter(prisma) as any,
  providers: isDev ? [] : [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: {
        params: {
          scope: "identify email",
        },
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // In development, always authorize
      if (isDev) return true;

      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
