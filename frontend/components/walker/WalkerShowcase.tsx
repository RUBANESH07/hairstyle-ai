"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { HAIR_STYLES, RUN_END } from "./styles";

const NAV_H = 69;          // sticky navbar height
const FRAME_COUNT = 90;    // /assets/frames/f_001.webp … f_090.webp (extracted from the video)
const FOCUS_Y = 0.06;      // keep the top of the hair in frame when the image is cropped
const frameSrc = (i: number) => `/assets/frames/f_${String(i + 1).padStart(3, "0")}.webp`;

/* Scroll-driven image sequence. Scroll progress 0→1 plays the frames in order
   (walk in → close-up) on a canvas; scrolling up plays them backwards. */
export default function WalkerShowcase() {
  const { user } = useAuth();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const progress = useRef(0);
  const [p, setP] = useState(0);
  const [loaded, setLoaded] = useState(0);

  /* preload all frames (first frame first) */
  useEffect(() => {
    let done = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => { done++; setLoaded(done); };
      img.onerror = () => { done++; setLoaded(done); };
      img.src = frameSrc(i);
      imgs.push(img);
    }
    images.current = imgs;
    return () => { imgs.forEach((im) => { im.onload = null; im.onerror = null; }); };
  }, []);

  /* scroll → progress */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - (window.innerHeight - NAV_H);
      const v = Math.min(1, Math.max(0, -(r.top - NAV_H) / total));
      progress.current = v;
      setP(v);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* canvas draw loop: ease toward the target frame, draw with "cover" fit */
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let current = 0;
    let lastDrawn = -1;
    let lastW = 0, lastH = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth, h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      lastDrawn = -1;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const nearestLoaded = (i: number) => {
      const imgs = images.current;
      for (let d = 0; d < FRAME_COUNT; d++) {
        for (const j of [i - d, i + d]) {
          const im = imgs[j];
          if (im && im.complete && im.naturalWidth) return j;
        }
      }
      return -1;
    };

    const tick = () => {
      const target = progress.current * (FRAME_COUNT - 1);
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.01) current = target;
      const idx = nearestLoaded(Math.round(current));
      if ((idx !== lastDrawn || cv.width !== lastW || cv.height !== lastH) && idx >= 0) {
        const im = images.current[idx];
        const cw = cv.width, ch = cv.height;
        const scale = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
        const dw = im.naturalWidth * scale, dh = im.naturalHeight * scale;
        const dx = (cw - dw) / 2;
        const dy = -(dh - ch) * FOCUS_Y;
        ctx.fillStyle = "#0A0A0A";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(im, dx, dy, dw, dh);
        lastDrawn = idx; lastW = cw; lastH = ch;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const jumpTo = (target: number) => {
    const el = section.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - NAV_H + (el.offsetHeight - (window.innerHeight - NAV_H)) * target, behavior: "smooth" });
  };

  const closeUp = p >= RUN_END;
  const quiff = HAIR_STYLES[0];
  const style = closeUp
    ? quiff
    : { id: "intro", name: "Your Perfect Cut", tag: "Personalised · AI-matched", desc: "Every face shape suits different styles. Our AI reads yours and recommends the hairstyles that frame it best.", bestFor: [] as string[] };
  const stepLabels = ["Your match", "Recommended cut"];
  const activeStep = closeUp ? 1 : 0;

  return (
    <section ref={section} id="hairstyles" className="snap-start-x" style={{ height: "420vh", position: "relative", background: "#0A0A0A" }}>
      <div style={{ position: "sticky", top: NAV_H, height: `calc(100vh - ${NAV_H}px)`, overflow: "hidden" }}>
        {/* frame sequence canvas, full-bleed */}
        <canvas ref={canvas} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />

        {/* gradient so copy stays readable */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(90deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 36%, rgba(10,10,10,0.05) 60%), linear-gradient(0deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0) 35%)",
          }}
        />

        {/* copy */}
        <div className="container-x" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 56, pointerEvents: "none" }}>
          <div style={{ maxWidth: 520, pointerEvents: "auto" }}>
            <p className="eyebrow" style={{ marginBottom: 14 }}>
              {closeUp ? "Recommended hairstyle" : "Hairstyle recommendation"}
            </p>

            <div key={style.id} style={{ animation: "fadeUp 0.6s cubic-bezier(.2,.7,.2,1) both" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-dark)", margin: "0 0 8px" }}>
                {style.tag}
              </p>
              <h2 className="h-display" style={{ fontSize: "clamp(38px, 6vw, 76px)", margin: 0 }}>
                {style.name.split(" ")[0]}{" "}
                <em>{style.name.split(" ").slice(1).join(" ")}</em>
              </h2>
              <p className="lead" style={{ maxWidth: 440, margin: "18px 0 22px" }}>{style.desc}</p>

              {style.bestFor.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--muted-dark)", marginRight: 4 }}>Best for</span>
                  {style.bestFor.map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
              )}

              {closeUp && (
                <div style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <Link href={user ? "/analyze" : "/register"} className="btn btn-gold">
                    {user ? "Find my style" : "Get my recommendations"}
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path d="M2 7.5h11M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 30 }}>
              {stepLabels.map((label, i) => (
                <button
                  key={label}
                  onClick={() => jumpTo(i === 0 ? 0.02 : 0.9)}
                  aria-label={`Jump to ${label}`}
                  className="btn btn-sm"
                  style={{
                    background: i === activeStep ? "var(--gold)" : "transparent",
                    color: i === activeStep ? "var(--ink)" : "var(--muted-dark)",
                    borderColor: i === activeStep ? "var(--gold)" : "rgba(255,255,255,0.2)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* progress rail */}
        <div aria-hidden="true" className="hidden md:block" style={{ position: "absolute", right: 28, top: "50%", transform: "translateY(-50%)", height: 180, width: 2, background: "rgba(255,255,255,0.14)" }}>
          <div style={{ width: 2, height: `${p * 100}%`, background: "var(--gold)" }} />
        </div>

        {/* thin loading bar while frames download */}
        {loaded < FRAME_COUNT && (
          <div aria-hidden="true" style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: `${(loaded / FRAME_COUNT) * 100}%`, background: "var(--gold)", transition: "width .2s" }} />
        )}
      </div>
    </section>
  );
}
