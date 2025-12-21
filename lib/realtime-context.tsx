"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "@/lib/toast";

interface RealtimeUpdate {
  type: "CALL_CREATED" | "CALL_UPDATED" | "UNIT_STATUS" | "NOTIFICATION" | "ALERT";
  data: any;
  timestamp: Date;
}

interface RealtimeContextType {
  connected: boolean;
  subscribe: (callback: (update: RealtimeUpdate) => void) => () => void;
  emit: (update: RealtimeUpdate) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [subscribers, setSubscribers] = useState<Set<(update: RealtimeUpdate) => void>>(
    new Set()
  );

  useEffect(() => {
    // Simulate connection - in production, this would establish WebSocket
    const connectTimeout = setTimeout(() => {
      setConnected(true);
      console.log("Realtime connection established (polling mode)");
    }, 1000);

    // Polling mechanism for updates
    const pollingInterval = setInterval(async () => {
      try {
        // Poll for new calls
        const callsRes = await fetch("/api/cad/calls?status=PENDING,ACTIVE&limit=1");
        if (callsRes.ok) {
          const calls = await callsRes.json();
          if (calls.length > 0) {
            const latestCall = calls[0];
            const updateAge = Date.now() - new Date(latestCall.createdAt).getTime();
            
            // If call is less than 10 seconds old, broadcast it
            if (updateAge < 10000) {
              emit({
                type: "CALL_CREATED",
                data: latestCall,
                timestamp: new Date(),
              });
            }
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(pollingInterval);
      setConnected(false);
    };
  }, []);

  function subscribe(callback: (update: RealtimeUpdate) => void) {
    setSubscribers((prev) => new Set(prev).add(callback));
    
    return () => {
      setSubscribers((prev) => {
        const next = new Set(prev);
        next.delete(callback);
        return next;
      });
    };
  }

  function emit(update: RealtimeUpdate) {
    subscribers.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error("Subscriber callback error:", error);
      }
    });
  }

  return (
    <RealtimeContext.Provider value={{ connected, subscribe, emit }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within RealtimeProvider");
  }
  return context;
}

// Hook for subscribing to specific update types
export function useRealtimeSubscription(
  types: RealtimeUpdate["type"][],
  callback: (update: RealtimeUpdate) => void
) {
  const { subscribe } = useRealtime();

  useEffect(() => {
    const unsubscribe = subscribe((update) => {
      if (types.includes(update.type)) {
        callback(update);
      }
    });

    return unsubscribe;
  }, [types, callback, subscribe]);
}

// Hook for showing toast notifications for updates
export function useRealtimeNotifications() {
  const { subscribe } = useRealtime();

  useEffect(() => {
    const unsubscribe = subscribe((update) => {
      switch (update.type) {
        case "CALL_CREATED":
          toast.info(`New Call: ${update.data.callNumber} - ${update.data.location || "No location"}`);
          break;
        case "ALERT":
          toast.warning(`${update.data.title}: ${update.data.message}`);
          break;
        case "NOTIFICATION":
          toast.info(`${update.data.title}: ${update.data.message}`);
          break;
      }
    });

    return unsubscribe;
  }, [subscribe]);
}
