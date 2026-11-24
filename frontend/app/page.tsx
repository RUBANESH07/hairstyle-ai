"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Reveal from "@/components/Reveal";
import WalkerShowcase from "@/components/walker/WalkerShowcase";
import { FACE_SHAPES } from "@/lib/faceShapes";

const STEPS = [
  { num: "01", title: "Upload your photo", desc: "A clear front-facing shot — JPG or PNG, up to 10 MB. The AI needs your full face in frame." },
  { num: "02", title: "AI face analysis", desc: "468 facial landmarks are mapped in real time. Your face shape is classified in seconds." },
  { num: "03", title: "Get recommendations", desc: "Receive your top personalised hairstyle picks — curated for your shape, for men and women." },
];

const FEATURES = [
  { label: "Precision", title: "468-point landmark mesh", desc: "MediaPipe's face mesh maps your face with clinical precision before classifying your shape." },
  { label: "Speed", title: "Seconds, not minutes", desc: "No queues and no waiting. Analysis runs the moment your photo reaches the server." },
  { label: "Inclusive", title: "Built for everyone", desc: "Dedicated recommendation sets for men's and women's hairstyles across all six face shapes." },
  { label: "Private", title: "Your data stays yours", desc: "Photos are processed server-side and never shared with third parties." },
];

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M2 7.5h11M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LandingPage() {
  const { user } = useAuth();
  const ctaHref = user ? "/analyze" : "/register";

  return (
    <main>
      {/* ─────────── HERO (black) ─────────── */}
      <section className="section-dark snap-start-x" style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "-20%", right: "-10%", width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.18), transparent 65%)", pointerEvents: "none" }} />
        <div className="container-x" style={{ position: "relative", padding: "104px 24px 88px", textAlign: "center" }}>
          <p className="eyebrow anim-fade-up" style={{ marginBottom: 26, display: "inline-flex", gap: 10, alignItems: "center", padding: "7px 16px", border: "1px solid rgba(212,175,55,0.45)", borderRadius: 100 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />
            AI stylist · Face shape analysis
          </p>
          <h1 className="h-display anim-fade-up anim-delay-1" style={{ fontSize: "clamp(48px, 8.5vw, 124px)", margin: "0 auto", maxWidth: 1000 }}>
            Find your <em>perfect</em> hairstyle
          </h1>
          <p className="lead anim-fade-up anim-delay-2" style={{ maxWidth: 560, margin: "28px auto 40px" }}>
            Upload one photo. Our AI maps your face, finds your shape, and recommends the cuts that frame you best — then lets you see them in motion.
          </p>
          <div className="anim-fade-up anim-delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={ctaHref} className="btn btn-gold">
              {user ? "Analyze my face" : "Get started free"} <ArrowRight />
            </Link>
            {!user && <Link href="/login" className="btn btn-outline-dark">Sign in</Link>}
          </div>
          <p style={{ marginTop: 22, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-dark)" }}>
            Free · No credit card · Instant results
          </p>
        </div>
      </section>

      {/* ─────────── 3D SCROLL STAGE (id=hairstyles) ─────────── */}
      <WalkerShowcase />

      {/* ─────────── HOW IT WORKS (white) ─────────── */}
      <section className="section-light snap-start-x" style={{ padding: "120px 0" }}>
        <div className="container-x" style={{ display: "grid", gap: 64 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow" style={{ marginBottom: 16 }}>Simple steps</p>
                <h2 className="h-display" style={{ fontSize: "clamp(38px, 5vw, 66px)", margin: 0 }}>
                  How it <em>works</em>
                </h2>
                <p className="lead" style={{ marginTop: 20, maxWidth: 360 }}>
                  Three steps from photo to the right haircut. Create a free account to run your first analysis.
                </p>
              </div>
            </Reveal>

            <div>
              {STEPS.map((s, i) => (
                <Reveal key={s.num} delay={i * 90}>
                  <div style={{ display: "flex", gap: 28, padding: "34px 0", borderBottom: i < STEPS.length - 1 ? "1px solid var(--line-light)" : "none" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 40, lineHeight: 1, color: "var(--gold)", minWidth: 60 }}>{s.num}</span>
                    <div>
                      <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{s.title}</h3>
                      <p className="lead" style={{ margin: 0, fontSize: 16 }}>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── FACE SHAPES / GALLERY (black) ─────────── */}
      <section id="gallery" className="section-dark snap-start-x" style={{ padding: "120px 0" }}>
        <div className="container-x">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p className="eyebrow" style={{ marginBottom: 16 }}>We detect 6 shapes</p>
              <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0 }}>
                Which shape are <em>you?</em>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FACE_SHAPES.map((s, i) => (
              <Reveal key={s.name} delay={i * 60}>
                <div className="card-dark shape-card" style={{ padding: "28px 16px", textAlign: "center", height: "100%" }}>
                  <svg viewBox="0 0 100 100" width="72" height="72" style={{ marginBottom: 16 }} aria-label={s.name}>
                    <path d={s.path} fill="rgba(212,175,55,0.1)" stroke="var(--gold)" strokeWidth="2.2" />
                  </svg>
                  <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{s.name}</p>
                  <p style={{ fontSize: 12, color: "var(--muted-dark)", margin: "6px 0 0", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES (white) ─────────── */}
      <section className="section-light snap-start-x" style={{ padding: "120px 0" }}>
        <div className="container-x">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p className="eyebrow" style={{ marginBottom: 16 }}>Why Hairstyle AI</p>
              <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0 }}>
                Built to be <em>trusted</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="card-light feature-card" style={{ padding: 30, height: "100%" }}>
                  <span className="eyebrow">{f.label}</span>
                  <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", margin: "12px 0 10px" }}>{f.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--muted-light)", margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── PHASE 2 TRY-ON (black) ─────────── */}
      <section id="tryon" className="section-dark snap-start-x" style={{ padding: "120px 0" }}>
        <div className="container-x">
          <Reveal>
            <div className="card-dark" style={{ padding: "64px 32px", textAlign: "center", borderColor: "rgba(212,175,55,0.45)" }}>
              <p className="eyebrow" style={{ marginBottom: 16 }}>Phase 2 · Coming soon</p>
              <h2 className="h-display" style={{ fontSize: "clamp(32px, 4.5vw, 58px)", margin: "0 0 18px" }}>
                Try it on <em>before you cut</em>
              </h2>
              <p className="lead" style={{ maxWidth: 580, margin: "0 auto" }}>
                Virtual try-on will place your recommended hairstyles on your own photo, so you can preview the look, compare options side by side, and walk into the salon with confidence.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── CTA (gold band) ─────────── */}
      <section className="snap-start-x" style={{ background: "var(--gold)", color: "var(--ink)", padding: "88px 0" }}>
        <div className="container-x" style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 className="h-display" style={{ fontSize: "clamp(30px, 4vw, 54px)", margin: "0 0 12px", maxWidth: 620 }}>
              Ready to see which hairstyle suits your face?
            </h2>
            <p style={{ fontSize: 16, margin: 0, color: "rgba(10,10,10,0.75)" }}>Free to try. Instant results. No credit card required.</p>
          </div>
          <Link href={ctaHref} className="btn btn-ink">
            {user ? "Analyze my face" : "Start for free"} <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ─────────── FOOTER (black) ─────────── */}
      <footer id="contact" className="section-dark snap-start-x" style={{ borderTop: "1px solid var(--line-dark)", padding: "40px 0" }}>
        <div className="container-x" style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Hairstyle<span style={{ color: "var(--gold)" }}>AI</span>
          </span>
          <p style={{ fontSize: 13, color: "var(--muted-dark)", margin: 0 }}>
            © 2026 Hairstyle AI · Phase 1 live — Face Analysis &amp; Recommendations
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--gold)", margin: 0 }}>
            PHASE 2 · VIRTUAL TRY-ON · COMING SOON
          </p>
        </div>
      </footer>

      <style>{`
        .shape-card{transition:border-color .25s,transform .25s}
        .shape-card:hover{border-color:var(--gold);transform:translateY(-4px)}
        .feature-card{transition:border-color .25s,transform .25s,box-shadow .25s}
        .feature-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 18px 40px rgba(10,10,10,.08)}
      `}</style>
    </main>
  );
}
