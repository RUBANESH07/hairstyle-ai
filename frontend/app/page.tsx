"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const FACE_SHAPES = [
  { name: "Oval", img: "/demo/oval.svg", desc: "Balanced & versatile" },
  { name: "Round", img: "/demo/round.svg", desc: "Full cheeks, soft jaw" },
  { name: "Square", img: "/demo/square.svg", desc: "Strong jaw, wide brow" },
  { name: "Heart", img: "/demo/heart.svg", desc: "Wide forehead, narrow chin" },
  { name: "Diamond", img: "/demo/diamond.svg", desc: "Wide cheekbones" },
  { name: "Oblong", img: "/demo/oblong.svg", desc: "Long & narrow" },
];

const STEPS = [
  {
    icon: "📸",
    title: "Upload Your Photo",
    desc: "Take a clear, front-facing photo and upload it. JPG or PNG, up to 10 MB.",
  },
  {
    icon: "🔍",
    title: "AI Face Analysis",
    desc: "Our AI detects your face landmarks and precisely measures your face shape.",
  },
  {
    icon: "💇",
    title: "Get Recommendations",
    desc: "Receive your top 4 personalized hairstyle picks based on your face shape.",
  },
];

const FEATURES = [
  { icon: "🎯", title: "Accurate Detection", desc: "MediaPipe face mesh with 468 landmarks for precise shape classification." },
  { icon: "⚡", title: "Instant Results", desc: "Analysis completes in seconds — no waiting, no manual input." },
  { icon: "👫", title: "Male & Female Styles", desc: "Curated recommendations for both men's and women's hairstyles." },
  { icon: "🔒", title: "Private & Secure", desc: "Your photos are processed securely and never shared with third parties." },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <main className="bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-24 text-white sm:py-32">
        {/* background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
            ✂️ AI-Powered Hairstyle Recommendations
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Find your perfect
            <span className="block text-emerald-400">hairstyle</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
            Upload a photo — our AI detects your face shape and recommends the
            hairstyles that will look best on you. Free, instant, personalized.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {user ? (
              <Link
                href="/analyze"
                className="rounded-2xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-emerald-400 transition"
              >
                Analyze My Face →
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-2xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-emerald-400 transition"
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <p className="mt-5 text-sm text-zinc-500">
            No credit card required · Free face analysis · Instant results
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">How it works</h2>
            <p className="mt-3 text-zinc-500">Three simple steps to your perfect hairstyle</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative rounded-3xl border border-zinc-100 bg-zinc-50 p-8 text-center">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Step {i + 1}
                </div>
                <div className="my-4 text-5xl">{step.icon}</div>
                <h3 className="text-lg font-bold text-zinc-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Face shapes ── */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
              We detect 6 face shapes
            </h2>
            <p className="mt-3 text-zinc-500">
              Each shape has curated hairstyle recommendations for men and women
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {FACE_SHAPES.map((shape) => (
              <div
                key={shape.name}
                className="group flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-5 text-center transition hover:border-emerald-300 hover:shadow-md"
              >
                <div className="mb-3 h-20 w-20 overflow-hidden rounded-xl bg-zinc-100">
                  <Image
                    src={shape.img}
                    alt={shape.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <p className="font-semibold text-zinc-800">{shape.name}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{shape.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Why Hairstyle AI?</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border border-zinc-100 p-6">
                <div className="mb-3 text-4xl">{f.icon}</div>
                <h3 className="font-bold text-zinc-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to find your perfect hairstyle?
          </h2>
          <p className="mt-4 text-zinc-300">
            Join thousands of users who discovered their ideal look with Hairstyle AI.
          </p>
          <Link
            href={user ? "/analyze" : "/register"}
            className="mt-8 inline-block rounded-2xl bg-emerald-500 px-10 py-3.5 text-base font-semibold text-white hover:bg-emerald-400 transition"
          >
            {user ? "Analyze My Face →" : "Start for Free →"}
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 px-4 py-8 text-center text-sm text-zinc-400">
        <p>© 2024 Hairstyle AI · Phase 1 — Face Analysis &amp; Recommendations</p>
        <p className="mt-1 text-xs text-zinc-300">Phase 2 coming soon: AI hairstyle try-on generation</p>
      </footer>
    </main>
  );
}
