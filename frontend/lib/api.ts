export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Hairstyle {
  name: string;
  description: string;
}

export interface AnalyzeResult {
  face_detected: boolean;
  image_id?: string;
  gender?: string;
  debug_image_url?: string;
  face_crop_url?: string;
  bbox?: { x: number; y: number; width: number; height: number };
  measurements?: {
    forehead_width: number;
    cheekbone_width: number;
    jaw_width: number;
    face_length: number;
  };
  face_shape?: string;
  confidence?: number;
  shape_description?: string;
  shape_tip?: string;
  recommendations?: Hairstyle[];
  detail?: string;
}

export interface HistoryItem {
  id: number;
  image_id: string;
  face_shape: string;
  confidence: number;
  gender: string;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      typeof data.detail === "string" ? data.detail : "Request failed"
    );
  }
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<{ user: User }> {
  return request<{ user: User }>("/api/auth/me");
}

// ── Analyze ───────────────────────────────────────────────────────────────
export async function analyzeImage(
  file: File,
  gender: "male" | "female"
): Promise<AnalyzeResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("gender", gender);

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers,
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data.detail === "string" ? data.detail : "Upload failed"
    );
  }
  return data as AnalyzeResult;
}

// ── History ───────────────────────────────────────────────────────────────
export async function getHistory(): Promise<{ history: HistoryItem[] }> {
  return request<{ history: HistoryItem[] }>("/api/history");
}
