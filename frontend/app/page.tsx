"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* ── SVG paths for the 6 face shapes (100×100 viewBox) ── */
const FACE_SHAPES = [
  {
    name: "Oval",
    desc: "Balanced & versatile",
    path: "M50 12 C73 12 88 28 88 50 C88 72 73 88 50 88 C27 88 12 72 12 50 C12 28 27 12 50 12 Z",
  },
  {
    name: "Round",
    desc: "Full cheeks, soft jaw",
    path: "M50 8 C75 8 92 26 92 50 C92 74 75 92 50 92 C25 92 8 74 8 50 C8 26 25 8 50 8 Z",
  },
  {
    name: "Square",
    desc: "Strong jaw, wide brow",
    path: "M16 16 L84 16 L84 84 L16 84 Z",
  },
  {
    name: "Heart",
    desc: "Wide forehead, narrow chin",
    path: "M50 82 C22 60 7 44 7 30 C7 18 17 10 28 10 C38 10 46 16 50 24 C54 16 62 10 72 10 C83 10 93 18 93 30 C93 44 78 60 50 82 Z",
  },
  {
    name: "Diamond",
    desc: "Wide cheekbones",
    path: "M50 7 L90 50 L50 93 L10 50 Z",
  },
  {
    name: "Oblong",
    desc: "Long & narrow",
    path: "M50 8 C63 8 76 18 76 32 L76 68 C76 82 63 92 50 92 C37 92 24 82 24 68 L24 32 C24 18 37 8 50 8 Z",
  },
];

/* delay[i] positions the cycleShape animation so shape i peaks at t = i*2.5s */
const SHAPE_DELAYS = ["0s", "-12.5s", "-10s", "-7.5s", "-5s", "-2.5s"];

const STEPS = [
  {
    num: "01",
    title: "Upload Your Photo",
    desc: "A clear front-facing shot — JPG or PNG, up to 10 MB. The AI needs your full face in frame.",
  },
  {
    num: "02",
    title: "AI Face Analysis",
    desc: "468 facial landmarks are mapped in real time. Your face shape is classified in under a second.",
  },
  {
    num: "03",
    title: "Get Recommendations",
    desc: "Receive your top personalized hairstyle picks — curated for your shape, for men and women.",
  },
];

const FEATURES = [
  {
    label: "Precision",
    title: "468-point landmark mesh",
    desc: "MediaPipe's face mesh model maps your face with clinical precision before classifying your shape.",
  },
  {
    label: "Speed",
    title: "Under 3 seconds",
    desc: "No upload queues, no waiting. Analysis runs the moment your photo lands on the server.",
  },
  {
    label: "Inclusive",
    title: "Built for everyone",
    desc: "Dedicated recommendation sets for both men's and women's hairstyles across all six face shapes.",
  },
  {
    label: "Private",
    title: "Your data stays yours",
    desc: "Photos are processed server-side and never shared with third parties. Your analysis is yours alone.",
  },
];

const TICKER = "OVAL · ROUND · SQUARE · HEART · DIAMOND · OBLONG · ";

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M2 7.5h11M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <main style={{ background: "var(--ground)", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center py-20 lg:py-28">

        {/* Left — editorial headline */}
        <div className="lg:pr-14">

          {/* Badge */}
          <div
            className="anim-fade-up inline-flex items-center gap-2 mb-8"
            style={{
              padding: "5px 14px",
              borderRadius: 100,
              border: "1px solid var(--accent-border)",
              background: "var(--accent-low)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "block", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--accent)",
              textTransform: "uppercase" as const,
            }}>
              AI-Powered · Face Shape Analysis
            </span>
          </div>

          {/* Headline — the aesthetic risk: italic Playfair in gold */}
          <h1
            className="anim-fade-up anim-delay-1"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(46px, 5.5vw, 78px)",
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Find your
            <br />
            <em style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 700,
              color: "var(--accent)",
            }}>
              perfect
            </em>
            <br />
            hairstyle
          </h1>

          <p
            className="anim-fade-up anim-delay-2"
            style={{
              fontSize: 17,
              lineHeight: 1.72,
              color: "var(--text-muted)",
              maxWidth: 420,
              marginTop: 24,
              marginBottom: 40,
            }}
          >
            Upload a photo. Our AI reads your face shape from 468 landmarks
            and surfaces the cuts that will work best for you — instantly.
          </p>

          {/* CTAs */}
          <div className="anim-fade-up anim-delay-3 flex flex-wrap gap-3">
            <Link
              href={user ? "/analyze" : "/register"}
              className="inline-flex items-center gap-2"
              style={{
                padding: "14px 26px",
                borderRadius: 12,
                background: "var(--accent)",
                color: "#0B0D17",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                transition: "opacity 0.18s, transform 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.87";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {user ? "Analyze My Face" : "Get Started Free"}
              <ArrowRight />
            </Link>

            {!user && (
              <Link
                href="/login"
                className="inline-flex items-center"
                style={{
                  padding: "14px 26px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "border-color 0.18s, color 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                }}
              >
                Sign in
              </Link>
            )}
          </div>

          <p
            className="anim-fade-up anim-delay-3"
            style={{
              marginTop: 18,
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}
          >
            Free · No credit card · Instant results
          </p>
        </div>

        {/* Right — animated face-shape lens (desktop only) */}
        <div className="hidden lg:flex justify-center items-center">
          <div style={{ position: "relative", width: 420, height: 420 }}>

            {/* Outer dashed scanning ring */}
            <svg
              className="anim-spin-slow"
              width="420" height="420" viewBox="0 0 420 420"
              style={{ position: "absolute", top: 0, left: 0 }}
              aria-hidden="true"
            >
              <circle
                cx="210" cy="210" r="200"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="5 14"
                opacity="0.35"
              />
            </svg>

            {/* Inner pulsing ring */}
            <svg
              className="anim-pulse"
              width="420" height="420" viewBox="0 0 420 420"
              style={{ position: "absolute", top: 0, left: 0 }}
              aria-hidden="true"
            >
              <circle
                cx="210" cy="210" r="166"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.75"
                opacity="0.25"
              />
            </svg>

            {/* Cycling face shape outlines */}
            {FACE_SHAPES.map((shape, i) => (
              <svg
                key={shape.name}
                viewBox="0 0 100 100"
                width="260" height="260"
                aria-label={shape.name}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: `cycleShape 15s ${SHAPE_DELAYS[i]} infinite`,
                }}
              >
                <path
                  d={shape.path}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.6"
                />
                <path
                  d={shape.path}
                  fill="var(--accent)"
                  opacity="0.06"
                />
              </svg>
            ))}

            {/* Cycling shape name label */}
            {FACE_SHAPES.map((shape, i) => (
              <div
                key={`label-${shape.name}`}
                style={{
                  position: "absolute",
                  bottom: 44,
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "5px 16px",
                  borderRadius: 100,
                  background: "var(--surface-2)",
                  border: "1px solid var(--accent-border)",
                  whiteSpace: "nowrap" as const,
                  animation: `cycleShape 15s ${SHAPE_DELAYS[i]} infinite`,
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "var(--accent)",
                  textTransform: "uppercase" as const,
                }}>
                  {shape.name} Shape
                </span>
              </div>
            ))}

            {/* Corner bracket markers */}
            {([
              { top: 30, left: 30, bT: true,  bL: true,  bB: false, bR: false },
              { top: 30, right: 30, bT: true,  bL: false, bB: false, bR: true  },
              { bottom: 30, left: 30, bT: false, bL: true,  bB: true,  bR: false },
              { bottom: 30, right: 30, bT: false, bL: false, bB: true,  bR: true  },
            ] as Array<{ top?: number; left?: number; bottom?: number; right?: number; bT: boolean; bL: boolean; bB: boolean; bR: boolean }>
            ).map((m, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: m.top,
                  left: m.left,
                  bottom: m.bottom,
                  right: m.right,
                  width: 18,
                  height: 18,
                  borderTop:    m.bT ? "2px solid var(--accent)" : "none",
                  borderLeft:   m.bL ? "2px solid var(--accent)" : "none",
                  borderBottom: m.bB ? "2px solid var(--accent)" : "none",
                  borderRight:  m.bR ? "2px solid var(--accent)" : "none",
                  opacity: 0.55,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── TICKER STRIP ─────────────────────── */}
      <div
        style={{
          overflow: "hidden",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          padding: "11px 0",
        }}
        aria-hidden="true"
      >
        <div style={{
          display: "flex",
          width: "max-content",
          animation: "tickerScroll 18s linear infinite",
        }}>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.13em",
                color: "var(--text-muted)",
              }}
            >
              {TICKER}
            </span>
          ))}
        </div>
      </div>

      {/* ───────────────────── HOW IT WORKS ───────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Sticky header */}
          <div className="lg:sticky lg:top-28">
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--accent)",
              textTransform: "uppercase" as const,
              marginBottom: 16,
            }}>
              Simple Steps
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(34px, 4vw, 54px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              margin: 0,
            }}>
              How it{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>works</em>
            </h2>
            <p style={{
              marginTop: 20,
              fontSize: 16,
              lineHeight: 1.72,
              color: "var(--text-muted)",
              maxWidth: 340,
            }}>
              Three steps from photo to perfect hairstyle. Free to browse — no account needed.
            </p>
          </div>

          {/* Step list */}
          <div>
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="flex gap-7 items-start py-8"
                style={{ borderBottom: i < STEPS.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--accent)",
                  minWidth: 28,
                  paddingTop: 3,
                  flexShrink: 0,
                }}>
                  {step.num}
                </span>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--text-muted)", margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── FACE SHAPES ─────────────────────── */}
      <section style={{ background: "var(--surface)", padding: "96px 0" }} id="hairstyles">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--accent)",
              textTransform: "uppercase" as const,
              marginBottom: 16,
            }}>
              We detect 6 shapes
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 3.5vw, 50px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}>
              Which shape are{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>you?</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FACE_SHAPES.map((shape) => (
              <div
                key={shape.name}
                className="flex flex-col items-center text-center rounded-2xl p-6"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <svg viewBox="0 0 100 100" width="68" height="68" style={{ marginBottom: 14 }} aria-label={shape.name}>
                  <path d={shape.path} fill="none" stroke="var(--accent)" strokeWidth="2.2" />
                  <path d={shape.path} fill="var(--accent)" opacity="0.07" />
                </svg>
                <p style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em", margin: 0 }}>{shape.name}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, margin: "4px 0 0" }}>{shape.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── FEATURES ──────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--accent)",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}>
            Why Hairstyle AI
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(30px, 3.5vw, 50px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}>
            Built to be{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>trusted</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-8"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--accent)",
                textTransform: "uppercase" as const,
              }}>
                {f.label}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: "10px 0 10px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.72, color: "var(--text-muted)", margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────── CTA ─────────────────────────── */}
      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div
          className="flex flex-col lg:flex-row lg:items-center gap-10 rounded-3xl p-10 lg:p-16"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex-1">
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 3vw, 46px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              maxWidth: 520,
              margin: "0 0 16px",
            }}>
              Ready to see which hairstyle suits your face?
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)", margin: 0, maxWidth: 400 }}>
              Free to try. Instant results. No credit card required.
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Link
              href={user ? "/analyze" : "/register"}
              className="inline-flex items-center gap-2"
              style={{
                padding: "15px 30px",
                borderRadius: 12,
                background: "var(--accent)",
                color: "#0B0D17",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap" as const,
                transition: "opacity 0.18s, transform 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.87";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {user ? "Analyze My Face" : "Start for Free"}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── FOOTER ──────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "28px 0" }}>
        <div
          className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}>
            Hairstyle<span style={{ color: "var(--accent)" }}>AI</span>
          </span>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            © 2025 Hairstyle AI · Phase 1 — Face Analysis &amp; Recommendations
          </p>
          <p style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            margin: 0,
          }}>
            PHASE 2: AI TRY-ON COMING
          </p>
        </div>
      </footer>

    </main>
  );
}
