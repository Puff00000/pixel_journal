"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import WelcomePage from "@/features/welcome/WelcomePage";
import JournalPage from "@/features/journal/JournalPage";
import GardenPage from "@/features/garden/GardenPage";
import { api } from "@/shared/api-client";

export type Screen = "welcome" | "journal" | "garden";

type Props = {
  email: string;
  initialPlantCount: number;
  initialStampCount: number;
};

/**
 * Same three-screen state machine as the original App.tsx, but the counts
 * are seeded from the server and every save round-trips to the API instead
 * of localStorage.
 */
export default function AppShell({ email, initialPlantCount, initialStampCount }: Props) {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [plantCount, setPlantCount] = useState(initialPlantCount);
  const [stampCount, setStampCount] = useState(initialStampCount);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  /**
   * Optimistic: the stamp and sunflower animations are the whole point, so
   * the count moves immediately and rolls back only if the save fails.
   */
  async function save(text: string, kind: "stamped" | "planted") {
    const bump = kind === "planted" ? setPlantCount : setStampCount;
    bump((n) => n + 1);
    setError(null);
    try {
      await api.saveEntry(text, kind);
    } catch (e) {
      bump((n) => Math.max(0, n - 1));
      setError(e instanceof Error ? e.message : "Couldn't save that entry.");
    }
  }

  const handlePlant = async (text: string) => {
    await save(text, "planted");
    setScreen("garden");
  };

  const handleStamp = (text: string) => save(text, "stamped");

  const handleSignOut = async () => {
    await api.logout();
    startTransition(() => router.replace("/login"));
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "rgba(200,40,70,0.95)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {screen === "welcome" && <WelcomePage onBegin={() => setScreen("journal")} />}

      {screen === "journal" && (
        <JournalPage
          onPlant={handlePlant}
          onStamp={handleStamp}
          stampCount={stampCount}
          onBack={() => setScreen("welcome")}
        />
      )}

      {screen === "garden" && (
        <GardenPage plantCount={plantCount} onBack={() => setScreen("journal")} />
      )}

      {screen !== "welcome" && (
        <button
          onClick={handleSignOut}
          title={email}
          style={{
            position: "fixed",
            left: 12,
            bottom: 12,
            zIndex: 9998,
            padding: "6px 10px",
            fontSize: 11,
            color: "rgba(120,90,110,0.8)",
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(180,140,165,0.35)",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          sign out
        </button>
      )}
    </>
  );
}
