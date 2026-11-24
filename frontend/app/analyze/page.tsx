"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { analyzeImage, type AnalyzeResult } from "@/lib/api";
import { shapePath } from "@/lib/faceShapes";

const eyebrow = "eyebrow";

export default function AnalyzePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  async function handleFile(file: File) {
    if (!gender) return;
    setAnalyzing(true);
    setError("");
    setResult(null);
    setPreview(URL.createObjectURL(file));
    try {
      const data = await analyzeImage(file, gender);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (!gender) return;
    const file = e.dataTransfer.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) handleFile(file);
  }

  function reset() {
    setResult(null);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  if (authLoading) {
    return (
      <div className="section-dark" style={{ minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="anim-spin" style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.15)", borderTopColor: "var(--gold)" }} />
      </div>
    );
  }
  if (!user) return null;

  const hasResult = !!result?.face_shape;
  const pct = Math.round((result?.confidence ?? 0) * 100);
  const genderLabel = result?.gender === "male" ? "Men's" : "Women's";

  return (
    <main className="section-paper" style={{ minHeight: "calc(100vh - 68px)" }}>
      {!hasResult ? (
        /* ───────────── Upload view ───────────── */
        <>
          <section className="section-dark" style={{ padding: "64px 0 72px", textAlign: "center", borderBottom: "1px solid var(--line-dark)" }}>
            <div className="container-x anim-fade-up">
              <p className={eyebrow} style={{ marginBottom: 14 }}>Step 01 · Upload</p>
              <h1 className="h-display" style={{ fontSize: "clamp(38px, 6vw, 72px)", margin: 0 }}>
                Analyze your <em>face</em>
              </h1>
              <p className="lead" style={{ maxWidth: 480, margin: "18px auto 0" }}>
                Upload a clear, front-facing photo to get your face shape and hairstyle recommendations.
              </p>
            </div>
          </section>

          <div style={{ maxWidth: 560, margin: "-36px auto 0", padding: "0 20px 80px", position: "relative" }}>
            {/* Gender toggle */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "var(--muted-dark)" }}>Recommend</span>
              <div style={{ display: "flex", padding: 4, borderRadius: 100, background: "var(--ink)", border: "1px solid var(--line-dark)" }}>
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    style={{
                      padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                      background: gender === g ? "var(--gold)" : "transparent",
                      color: gender === g ? "var(--ink)" : "#bdbdbd",
                      transition: "all .25s",
                    }}
                  >
                    {g === "male" ? "Men's" : "Women's"} styles
                  </button>
                ))}
              </div>
            </div>

            {!gender && (
              <p style={{ textAlign: "center", fontSize: 13, color: "var(--gold-deep)", margin: "-6px 0 16px" }}>
                Choose Men&apos;s or Women&apos;s styles to continue
              </p>
            )}

            {/* Drop zone */}
            <label
              onClick={(e) => { if (!gender) e.preventDefault(); }}
              onDragOver={(e) => { e.preventDefault(); if (gender) setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className="card-light"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: gender ? "pointer" : "not-allowed", opacity: gender ? 1 : 0.5,
                padding: "56px 24px", borderStyle: "dashed", borderWidth: 2,
                borderColor: dragging ? "var(--gold)" : "rgba(10,10,10,0.25)",
                background: dragging ? "#fffaf0" : "#fff",
                transition: "all .25s",
              }}
            >
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                <circle cx="27" cy="27" r="26" stroke="var(--gold)" strokeWidth="1.5" />
                <path d="M27 36V18M19 25l8-8 8 8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p style={{ fontSize: 17, fontWeight: 700, margin: "18px 0 4px" }}>Drop your photo here</p>
              <p style={{ fontSize: 13, color: "var(--muted-light)", margin: 0 }}>or click to browse · JPG, PNG · max 10 MB</p>
              <span className="btn btn-ink btn-sm" style={{ marginTop: 22 }}>Choose photo</span>
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={onInputChange} disabled={analyzing || !gender} />
            </label>

            {/* Tips */}
            <div className="card-light" style={{ marginTop: 20, padding: "20px 24px", background: "#fffaf0", borderColor: "rgba(212,175,55,0.5)" }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "var(--gold-deep)" }}>Tips for best results</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6, fontSize: 13.5, color: "#5b4a14" }}>
                {["Face the camera directly", "Use good lighting — avoid harsh shadows", "Pull hair back to reveal your full face shape", "No sunglasses or hats"].map((t) => (
                  <li key={t}><span style={{ color: "var(--gold)" }}>✦</span> {t}</li>
                ))}
              </ul>
            </div>

            {/* Preview */}
            {preview && (
              <div className="card-light" style={{ marginTop: 20, padding: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" style={{ display: "block", margin: "0 auto", maxHeight: 260, borderRadius: 12, objectFit: "contain" }} />
              </div>
            )}

            {/* Loading */}
            {analyzing && (
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <span className="anim-spin" style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid rgba(10,10,10,0.12)", borderTopColor: "var(--gold)" }} />
                <p style={{ fontSize: 14, color: "var(--muted-light)", margin: 0 }}>Detecting face shape…</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <p role="alert" style={{ marginTop: 20, padding: "14px 16px", borderRadius: 14, background: "#fdecec", border: "1px solid #f3b9b9", color: "#9b1c1c", fontSize: 14, textAlign: "center" }}>
                {error}
              </p>
            )}

            {/* No face */}
            {result?.face_detected === false && (
              <div className="card-light" style={{ marginTop: 20, padding: 24, textAlign: "center", borderColor: "rgba(212,175,55,0.6)" }}>
                <p style={{ fontWeight: 700, margin: 0 }}>No face detected</p>
                <p style={{ fontSize: 14, color: "var(--muted-light)", margin: "6px 0 14px" }}>Try a clear, well-lit, front-facing photo.</p>
                <button onClick={reset} className="btn btn-outline-light btn-sm">Try another photo</button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ───────────── Results view ───────────── */
        <>
          <section className="section-dark" style={{ padding: "48px 0", borderBottom: "1px solid var(--line-dark)" }}>
            <div className="container-x" style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "flex-end" }}>
              <div className="anim-fade-up">
                <p className={eyebrow} style={{ marginBottom: 12 }}>Your analysis</p>
                <h1 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0 }}>
                  {result!.face_shape} <em>face</em>
                </h1>
                <p style={{ fontSize: 14, color: "var(--muted-dark)", margin: "10px 0 0" }}>
                  {genderLabel} recommendations for your {result!.face_shape} face
                </p>
              </div>
              <button onClick={reset} className="btn btn-outline-dark btn-sm">← Analyze another</button>
            </div>
          </section>

          <div className="container-x" style={{ padding: "40px 24px 80px" }}>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left column */}
              <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
                {preview && (
                  <div className="card-light" style={{ padding: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Uploaded" style={{ display: "block", margin: "0 auto", maxHeight: 240, borderRadius: 12, objectFit: "contain" }} />
                  </div>
                )}

                {/* Face shape card */}
                <div className="card-light" style={{ padding: 28 }}>
                  <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                    <div style={{ width: 70, height: 70, flexShrink: 0, borderRadius: 18, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 100 100" width="40" height="40" aria-hidden="true">
                        <path d={shapePath(result!.face_shape!)} fill="rgba(212,175,55,0.15)" stroke="var(--gold)" strokeWidth="4" />
                      </svg>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p className={eyebrow} style={{ margin: 0 }}>Face shape detected</p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: "2px 0 8px" }}>{result!.face_shape}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 6, background: "rgba(10,10,10,0.08)", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "var(--gold)", borderRadius: 6, transition: "width .8s ease" }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-light)", flexShrink: 0 }}>{pct}% confidence</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.7, color: "var(--muted-light)" }}>{result!.shape_description}</p>
                  {result!.shape_tip && (
                    <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 14, background: "#fffaf0", border: "1px solid rgba(212,175,55,0.5)", fontSize: 14, color: "#5b4a14" }}>
                      <strong style={{ color: "var(--gold-deep)" }}>Tip · </strong>{result!.shape_tip}
                    </div>
                  )}
                </div>

                {/* Measurements */}
                {result!.measurements && (
                  <div className="card-light" style={{ padding: 28 }}>
                    <p className={eyebrow} style={{ margin: "0 0 16px" }}>Face measurements</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Forehead", value: result!.measurements.forehead_width },
                        { label: "Cheekbone", value: result!.measurements.cheekbone_width },
                        { label: "Jaw width", value: result!.measurements.jaw_width },
                        { label: "Face length", value: result!.measurements.face_length },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ padding: 16, borderRadius: 14, background: "var(--paper)" }}>
                          <div style={{ width: 28, height: 3, borderRadius: 3, background: "var(--gold)", marginBottom: 10 }} />
                          <p style={{ fontSize: 12, color: "var(--muted-light)", margin: 0 }}>{label}</p>
                          <p style={{ fontSize: 20, fontWeight: 700, margin: "2px 0 0" }}>{value}px</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detection images */}
                {(result!.face_crop_url || result!.debug_image_url) && (
                  <div className="card-light" style={{ padding: 28 }}>
                    <p className={eyebrow} style={{ margin: "0 0 16px" }}>Detection images</p>
                    <div className="grid grid-cols-2 gap-3">
                      {result!.face_crop_url && (
                        <div>
                          <p style={{ fontSize: 12, color: "var(--muted-light)", margin: "0 0 6px" }}>Face crop</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={result!.face_crop_url} alt="Face crop" style={{ width: "100%", borderRadius: 14, objectFit: "cover" }} />
                        </div>
                      )}
                      {result!.debug_image_url && (
                        <div>
                          <p style={{ fontSize: 12, color: "var(--muted-light)", margin: "0 0 6px" }}>Landmarks</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={result!.debug_image_url} alt="Landmark visualization" style={{ width: "100%", borderRadius: 14, objectFit: "cover" }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
                <div className="card-light" style={{ padding: 28 }}>
                  <h2 className="h-display" style={{ fontSize: 30, margin: "0 0 6px" }}>Top hairstyle <em>picks</em></h2>
                  <p style={{ fontSize: 13.5, color: "var(--muted-light)", margin: "0 0 22px" }}>
                    Curated for {result!.face_shape} face shape · {genderLabel} styles
                  </p>
                  <div style={{ display: "grid", gap: 12 }}>
                    {result!.recommendations?.map((style, i) => {
                      const name = typeof style === "string" ? style : style.name;
                      const desc = typeof style === "string" ? "" : style.description;
                      return (
                        <div key={name} className="rec-row" style={{ display: "flex", gap: 16, padding: 16, borderRadius: 16, border: "1px solid var(--line-light)", background: "var(--paper)" }}>
                          <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 12, background: "var(--ink)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: 17 }}>
                            {i + 1}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, margin: 0 }}>{name}</p>
                            {desc && <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--muted-light)" }}>{desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Phase 2 teaser */}
                <div className="section-dark" style={{ borderRadius: 20, padding: 28, border: "1px solid rgba(212,175,55,0.45)" }}>
                  <p className={eyebrow} style={{ margin: "0 0 10px" }}>Coming in phase 2</p>
                  <h3 className="h-display" style={{ fontSize: 28, margin: 0 }}>AI hairstyle <em>try-on</em></h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--muted-dark)", margin: "12px 0 16px" }}>
                    Generate a realistic preview of any hairstyle on your own photo — before you commit to the cut.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                    {["Stable Diffusion", "ControlNet", "Hair Segmentation"].map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                  <button className="btn btn-gold btn-sm">Notify me when ready</button>
                </div>

                {/* Share */}
                <div className="card-light" style={{ padding: 28 }}>
                  <h3 style={{ fontWeight: 700, margin: "0 0 6px" }}>Share your result</h3>
                  <p style={{ fontSize: 14, color: "var(--muted-light)", margin: "0 0 16px" }}>Save this analysis or share it with your hairdresser.</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => window.print()} className="btn btn-outline-light btn-sm" style={{ flex: 1 }}>Print</button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`My face shape is ${result!.face_shape} — analyzed by Hairstyle AI`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1800);
                      }}
                      className="btn btn-outline-light btn-sm"
                      style={{ flex: 1 }}
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`.rec-row{transition:border-color .25s,transform .25s,background .25s}.rec-row:hover{border-color:var(--gold);background:#fff;transform:translateX(4px)}`}</style>
    </main>
  );
}
