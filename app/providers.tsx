"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/Toaster";
import { ThemeProvider } from "@/lib/theme-context";
import { RealtimeProvider } from "@/lib/realtime-context";
import { VoiceProvider } from "@/lib/voice-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";
  
  return (
    <ThemeProvider>
      <SessionProvider 
        refetchInterval={isDev ? 0 : 300}
        refetchOnWindowFocus={!isDev}
      >
        <RealtimeProvider>
          <VoiceProvider>
            <HeroUIProvider>
              {children}
              <Toaster />
            </HeroUIProvider>
          </VoiceProvider>
        </RealtimeProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
