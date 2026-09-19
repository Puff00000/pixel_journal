"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/shared/api-client";

const PIXEL = '"Press Start 2P", monospace';

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const nextPath = useSearchParams().get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      if (isSignup) await api.signup(email, password);
      else await api.login(email, password);
      router.replace(nextPath);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(ellipse at 60% 30%, #FFE8F5 0%, #F8F0FF 40%, #EEF4FF 100%)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "rgba(255,255,255,0.85)",
          border: "3px solid rgba(220,150,180,0.5)",
          borderRadius: 4,
          padding: 28,
          boxShadow: "6px 6px 0 rgba(200,140,170,0.25)",
        }}
      >
        <h1 style={{ fontFamily: PIXEL, fontSize: 14, color: "#C05080", marginBottom: 22 }}>
          {isSignup ? "new journal" : "welcome back"}
        </h1>

        <label style={{ fontSize: 12, color: "#B05070" }}>
          email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 12, color: "#B05070" }}>
          password
          <input
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={inputStyle}
          />
        </label>

        {isSignup && (
          <p style={{ fontSize: 11, color: "rgba(180,120,160,0.9)", marginTop: 6 }}>
            At least 10 characters.
          </p>
        )}

        {error && (
          <p role="alert" style={{ fontSize: 12, color: "#C02040", marginTop: 12 }}>
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy || !email || !password}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "12px 0",
            fontFamily: PIXEL,
            fontSize: 10,
            color: "#fff",
            background: busy ? "rgba(200,120,160,0.6)" : "#E040A0",
            border: "none",
            borderRadius: 3,
            cursor: busy ? "wait" : "pointer",
          }}
        >
          {busy ? "..." : isSignup ? "begin" : "open journal"}
        </button>

        <p style={{ fontSize: 12, color: "#B05070", marginTop: 18, textAlign: "center" }}>
          {isSignup ? "already have one? " : "no journal yet? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            style={{ color: "#E040A0", textDecoration: "underline" }}
          >
            {isSignup ? "sign in" : "make one"}
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  marginBottom: 14,
  padding: "10px 12px",
  fontSize: 14,
  border: "2px solid rgba(220,170,200,0.6)",
  borderRadius: 3,
  background: "rgba(255,255,255,0.9)",
  outline: "none",
};
