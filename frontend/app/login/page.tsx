"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ── Shared glass-card + orb styles ── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.07)",
  padding: "12px 16px",
  fontSize: 14,
  color: "#EDE8DF",
  outline: "none",
  fontFamily: "var(--font-body)",
  transition: "border-color 0.18s, background 0.18s",
  boxSizing: "border-box" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(237,232,223,0.65)",
  letterSpacing: "0.07em",
  textTransform: "uppercase" as const,
  marginBottom: 8,
  fontFamily: "var(--font-mono)",
};

export default function LoginPage() {
  const { login }  = useAuth();
  const router     = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "calc(100vh - 65px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      position: "relative",
      overflow: "hidden",
      background: "radial-gradient(ellipse at 20% 30%, #2D1B6B 0%, #1A0D3A 35%, #0A0812 70%, #000000 100%)",
    }}>

      {/* Floating orbs */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Top-left large orb */}
        <div style={{
          position: "absolute", top: "-80px", left: "-80px",
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, #7C3AED 0%, #4C1D95 50%, transparent 75%)",
          opacity: 0.55, filter: "blur(1px)",
        }} />
        {/* Bottom-right large orb */}
        <div style={{
          position: "absolute", bottom: "-100px", right: "-60px",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, #6D28D9 0%, #3B0764 55%, transparent 75%)",
          opacity: 0.5, filter: "blur(1px)",
        }} />
        {/* Mid-right small orb */}
        <div style={{
          position: "absolute", top: "40%", right: "8%",
          width: 140, height: 140, borderRadius: "50%",
          background: "radial-gradient(circle, #A78BFA 0%, #7C3AED 60%, transparent 80%)",
          opacity: 0.45,
        }} />
        {/* Bottom-left small orb */}
        <div style={{
          position: "absolute", bottom: "12%", left: "6%",
          width: 100, height: 100, borderRadius: "50%",
          background: "radial-gradient(circle, #8B5CF6 0%, #5B21B6 65%, transparent 85%)",
          opacity: 0.4,
        }} />
        {/* Top-right tiny orb */}
        <div style={{
          position: "absolute", top: "10%", right: "20%",
          width: 80, height: 80, borderRadius: "50%",
          background: "radial-gradient(circle, #C4B5FD 0%, #7C3AED 70%, transparent 90%)",
          opacity: 0.35,
        }} />
      </div>

      {/* Glass card */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: 420,
        borderRadius: 28,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        padding: "40px 36px",
        boxShadow: "0 8px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            background: "linear-gradient(135deg, #C8A96A 0%, #7C3AED 100%)",
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, margin: "0 auto 16px",
          }}>
            ✂
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#EDE8DF", margin: "0 0 6px",
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "rgba(237,232,223,0.5)", margin: 0, fontFamily: "var(--font-body)" }}>
            Sign in to your Hairstyle AI account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Email */}
          <div>
            <label style={labelStyle} htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "rgba(200,169,106,0.6)";
                (e.target as HTMLInputElement).style.background  = "rgba(255,255,255,0.11)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.12)";
                (e.target as HTMLInputElement).style.background  = "rgba(255,255,255,0.07)";
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle} htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 46 }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(200,169,106,0.6)";
                  (e.target as HTMLInputElement).style.background  = "rgba(255,255,255,0.11)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.target as HTMLInputElement).style.background  = "rgba(255,255,255,0.07)";
                }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "rgba(237,232,223,0.4)", cursor: "pointer",
                  fontSize: 16, lineHeight: 1, padding: 2,
                }}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "11px 14px",
              borderRadius: 10,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              fontSize: 13,
              color: "#FCA5A5",
              fontFamily: "var(--font-body)",
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: "var(--accent)",
              color: "#0B0D17",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              letterSpacing: "-0.01em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              transition: "opacity 0.18s, transform 0.18s",
            }}
            onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.opacity = "0.87"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = loading ? "0.65" : "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(11,13,23,0.3)", borderTopColor: "#0B0D17", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Signing in…
              </span>
            ) : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 11, color: "rgba(237,232,223,0.35)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "rgba(237,232,223,0.5)", fontFamily: "var(--font-body)", margin: 0 }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Bottom note */}
      <p style={{
        position: "absolute", bottom: 20, left: 0, right: 0,
        textAlign: "center",
        fontSize: 11,
        color: "rgba(237,232,223,0.25)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.06em",
        zIndex: 10,
      }}>
        By signing in you agree to our Terms of Service and Privacy Policy.
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(237,232,223,0.3); }
      `}</style>
    </main>
  );
}
