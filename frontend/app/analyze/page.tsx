"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { analyzeImage, type AnalyzeResult } from "@/lib/api";

const FACE_SHAPE_ICONS: Record<string, string> = {
  Oval: "🥚",
  Round: "⭕",
  Square: "⬛",
  Heart: "🫀",
  Diamond: "💎",
  Oblong: "📏",
};

export default function AnalyzePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [gender, setGender] = useState<"male" | "female">("female");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  async function handleFile(file: File) {
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
    const file = e.dataTransfer.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      handleFile(file);
    }
  }

  function reset() {
    setResult(null);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" />
      </div>
    );
  }

  if (!user) return null;

  const hasResult = !!result?.face_shape;

  return (
    <main className="min-h-[calc(100vh-65px)] bg-gradient-to-br from-stone-50 to-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-10">

        {!hasResult ? (
          /* ── Upload view ── */
          <div className="mx-auto max-w-lg">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-zinc-900">Analyze Your Face</h1>
              <p className="mt-2 text-zinc-500">
                Upload a clear, front-facing photo to get your hairstyle recommendations.
              </p>
            </div>

            {/* Gender toggle */}
            <div className="mb-5 flex items-center justify-center gap-2">
              <span className="text-sm text-zinc-500">Recommend</span>
              <div className="flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
                {(["female", "male"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
                      gender === g
                        ? "bg-zinc-900 text-white shadow"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {g === "female" ? "Women's" : "Men's"} styles
                  </button>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed p-14 transition ${
                dragging
                  ? "border-zinc-600 bg-zinc-100"
                  : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
              }`}
            >
              <span className="text-6xl mb-4">📸</span>
              <p className="text-base font-semibold text-zinc-700">
                Drop your photo here
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                or click to browse · JPG, PNG · max 10 MB
              </p>
              <span className="mt-6 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-zinc-700 transition">
                Choose photo
              </span>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={onInputChange}
                disabled={analyzing}
              />
            </label>

            {/* Tips */}
            <div className="mt-5 rounded-2xl bg-amber-50 px-5 py-4">
              <p className="text-sm font-medium text-amber-800">📌 Tips for best results</p>
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                <li>· Face the camera directly (front-facing)</li>
                <li>· Use good lighting — avoid harsh shadows</li>
                <li>· Pull hair back to reveal your full face shape</li>
                <li>· No sunglasses or hats</li>
              </ul>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mt-6 overflow-hidden rounded-2xl border bg-white p-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-xl object-contain"
                />
              </div>
            )}

            {/* Loading */}
            {analyzing && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" />
                <p className="text-sm text-zinc-500">Detecting face shape…</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                {error}
              </p>
            )}

            {/* No face */}
            {result?.face_detected === false && (
              <div className="mt-5 rounded-2xl bg-amber-50 px-5 py-4 text-center">
                <p className="font-medium text-amber-800">No face detected</p>
                <p className="mt-1 text-sm text-amber-600">
                  Try a clear, well-lit, front-facing photo.
                </p>
                <button
                  onClick={reset}
                  className="mt-3 text-sm font-medium text-amber-700 underline"
                >
                  Try another photo
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Results view ── */
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Your Analysis</h2>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {result.gender === "male" ? "Men's" : "Women's"} recommendations for {result.face_shape} face
                </p>
              </div>
              <button
                onClick={reset}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition shadow-sm"
              >
                ← Analyze another
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* ── Left column ── */}
              <div className="space-y-5">

                {/* Uploaded photo */}
                {preview && (
                  <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white p-3 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Uploaded"
                      className="mx-auto max-h-56 rounded-2xl object-contain"
                    />
                  </div>
                )}

                {/* Face shape card */}
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-3xl">
                      {FACE_SHAPE_ICONS[result.face_shape!] ?? "🪞"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                        Face Shape Detected
                      </p>
                      <p className="text-2xl font-bold text-zinc-900">{result.face_shape}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-zinc-100">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.round((result.confidence ?? 0) * 100)}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-sm font-medium text-zinc-500">
                          {Math.round((result.confidence ?? 0) * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                    {result.shape_description}
                  </p>
                  {result.shape_tip && (
                    <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      💡 {result.shape_tip}
                    </div>
                  )}
                </div>

                {/* Measurements */}
                {result.measurements && (
                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                      Face Measurements
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Forehead", value: result.measurements.forehead_width, color: "bg-blue-500" },
                        { label: "Cheekbone", value: result.measurements.cheekbone_width, color: "bg-cyan-500" },
                        { label: "Jaw Width", value: result.measurements.jaw_width, color: "bg-yellow-500" },
                        { label: "Face Length", value: result.measurements.face_length, color: "bg-purple-500" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl bg-zinc-50 p-4">
                          <div className={`mb-2 h-1 w-8 rounded-full ${color}`} />
                          <p className="text-xs text-zinc-400">{label}</p>
                          <p className="mt-0.5 text-lg font-semibold text-zinc-800">{value}px</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Debug images */}
                {(result.face_crop_url || result.debug_image_url) && (
                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                      Detection Images
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {result.face_crop_url && (
                        <div>
                          <p className="mb-1.5 text-xs font-medium text-zinc-400">Face Crop</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={result.face_crop_url}
                            alt="Face crop"
                            className="w-full rounded-2xl object-cover"
                          />
                        </div>
                      )}
                      {result.debug_image_url && (
                        <div>
                          <p className="mb-1.5 text-xs font-medium text-zinc-400">Landmarks</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={result.debug_image_url}
                            alt="Landmark visualization"
                            className="w-full rounded-2xl object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right column — Recommendations ── */}
              <div className="space-y-5">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-zinc-900">Top Hairstyle Picks</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Curated for {result.face_shape} face shape ·{" "}
                      {result.gender === "male" ? "Men's" : "Women's"} styles
                    </p>
                  </div>

                  <div className="space-y-3">
                    {result.recommendations?.map((style, i) => {
                      const name = typeof style === "string" ? style : style.name;
                      const desc = typeof style === "string" ? "" : style.description;
                      return (
                        <div
                          key={name}
                          className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-zinc-200 hover:bg-white"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-800">{name}</p>
                            {desc && (
                              <p className="mt-0.5 text-sm leading-relaxed text-zinc-500">
                                {desc}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Phase 2 teaser */}
                <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-6 text-white">
                  <div className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400">
                    Coming in Phase 2
                  </div>
                  <h3 className="text-lg font-bold">AI Hairstyle Try-On</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                    Generate a realistic preview of any hairstyle on your own photo —
                    before you commit to the cut.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
                    {["Stable Diffusion", "ControlNet", "Hair Segmentation"].map((t) => (
                      <span key={t} className="rounded-full border border-zinc-600 px-3 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition">
                    Notify me when ready →
                  </button>
                </div>

                {/* Share / save placeholder */}
                <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 font-semibold text-zinc-800">Share your result</h3>
                  <p className="mb-4 text-sm text-zinc-400">
                    Save this analysis or share it with your hairdresser.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 rounded-xl border border-zinc-200 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition"
                    >
                      🖨️ Print
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `My face shape is ${result.face_shape} — analyzed by Hairstyle AI`
                        );
                      }}
                      className="flex-1 rounded-xl border border-zinc-200 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
