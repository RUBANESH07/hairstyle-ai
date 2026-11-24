"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

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
    <main className="grid lg:grid-cols-2" style={{ minHeight: "calc(100vh - 68px)" }}>
      {/* Editorial panel */}
      <section className="section-dark hidden lg:flex" style={{ position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "flex-end", padding: 64, borderRight: "1px solid var(--line-dark)" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "-15%", left: "-20%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.2), transparent 65%)" }} />
        <p className="eyebrow" style={{ position: "relative", marginBottom: 18 }}>Welcome back</p>
        <h1 className="h-display anim-fade-up" style={{ position: "relative", fontSize: "clamp(44px, 5vw, 72px)", margin: 0 }}>
          Your next <em>great cut</em> starts here
        </h1>
        <p className="lead" style={{ position: "relative", maxWidth: 400, marginTop: 20 }}>
          Sign in to analyse your face shape and get hairstyle recommendations picked for you.
        </p>
      </section>

      {/* Form panel */}
      <section className="section-light" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div className="anim-fade-up" style={{ width: "100%", maxWidth: 420 }}>
          <h2 className="h-display" style={{ fontSize: 40, margin: "0 0 8px" }}>Sign <em>in</em></h2>
          <p style={{ fontSize: 15, color: "var(--muted-light)", margin: "0 0 32px" }}>Enter your details to continue.</p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="field-input" required autoComplete="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input id="password" type={showPw ? "text" : "password"} className="field-input" style={{ paddingRight: 64 }} required autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--muted-light)", fontFamily: "var(--font-mono)" }}>
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" style={{ margin: 0, padding: "12px 14px", borderRadius: 12, background: "#fdecec", border: "1px solid #f3b9b9", color: "#9b1c1c", fontSize: 14 }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-ink" style={{ width: "100%", opacity: loading ? 0.7 : 1 }}>
              {loading ? <span className="anim-spin" style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block" }} /> : "Sign in"}
            </button>
          </form>

          <p style={{ marginTop: 28, textAlign: "center", fontSize: 14, color: "var(--muted-light)" }}>
            No account yet?{" "}
            <Link href="/register" style={{ color: "var(--ink)", fontWeight: 700, textDecoration: "underline", textDecorationColor: "var(--gold)", textUnderlineOffset: 4 }}>
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
