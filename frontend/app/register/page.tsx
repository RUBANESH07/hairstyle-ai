"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPw) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];

  return (
    <main className="grid lg:grid-cols-2" style={{ minHeight: "calc(100vh - 68px)" }}>
      {/* Form panel */}
      <section className="section-light" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div className="anim-fade-up" style={{ width: "100%", maxWidth: 440 }}>
          <h2 className="h-display" style={{ fontSize: 40, margin: "0 0 8px" }}>Create your <em>account</em></h2>
          <p style={{ fontSize: 15, color: "var(--muted-light)", margin: "0 0 30px" }}>Free to start. No credit card needed.</p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
            <div>
              <label className="field-label" htmlFor="name">Full name</label>
              <input id="name" type="text" className="field-input" required autoComplete="name" placeholder="Alex Morgan" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="field-input" required autoComplete="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input id="password" type={showPw ? "text" : "password"} className="field-input" style={{ paddingRight: 64 }} required autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--muted-light)", fontFamily: "var(--font-mono)" }}>
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
              {strength > 0 && (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 4, flex: 1 }}>
                    {[1, 2, 3].map((n) => (
                      <span key={n} style={{ flex: 1, height: 3, borderRadius: 3, background: n <= strength ? "var(--gold)" : "var(--line-light)", transition: "background .3s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--muted-light)", fontFamily: "var(--font-mono)" }}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div>
              <label className="field-label" htmlFor="confirm">Confirm password</label>
              <input id="confirm" type={showPw ? "text" : "password"} className="field-input" required autoComplete="new-password" placeholder="Repeat your password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </div>

            {error && (
              <p role="alert" style={{ margin: 0, padding: "12px 14px", borderRadius: 12, background: "#fdecec", border: "1px solid #f3b9b9", color: "#9b1c1c", fontSize: 14 }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-ink" style={{ width: "100%", opacity: loading ? 0.7 : 1 }}>
              {loading ? <span className="anim-spin" style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block" }} /> : "Create account"}
            </button>
          </form>

          <p style={{ marginTop: 26, textAlign: "center", fontSize: 14, color: "var(--muted-light)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--ink)", fontWeight: 700, textDecoration: "underline", textDecorationColor: "var(--gold)", textUnderlineOffset: 4 }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Editorial panel */}
      <section className="section-dark hidden lg:flex" style={{ position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "flex-end", padding: 64, borderLeft: "1px solid var(--line-dark)" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "-15%", right: "-20%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.2), transparent 65%)" }} />
        <p className="eyebrow" style={{ position: "relative", marginBottom: 18 }}>Join Hairstyle AI</p>
        <h1 className="h-display" style={{ position: "relative", fontSize: "clamp(44px, 5vw, 72px)", margin: 0 }}>
          Know your shape. <em>Own your look.</em>
        </h1>
        <ul style={{ position: "relative", listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gap: 12 }}>
          {["6 face shapes detected with AI", "Men's and women's style picks", "Your analysis history, saved"].map((t) => (
            <li key={t} style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--muted-dark)", fontSize: 15 }}>
              <span style={{ color: "var(--gold)" }}>✦</span> {t}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
