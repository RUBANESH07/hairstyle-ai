/* SVG paths for the 6 face shapes (100×100 viewBox) — shared by landing and analyze pages */
export const FACE_SHAPES = [
  { name: "Oval", desc: "Balanced & versatile", path: "M50 12 C73 12 88 28 88 50 C88 72 73 88 50 88 C27 88 12 72 12 50 C12 28 27 12 50 12 Z" },
  { name: "Round", desc: "Full cheeks, soft jaw", path: "M50 8 C75 8 92 26 92 50 C92 74 75 92 50 92 C25 92 8 74 8 50 C8 26 25 8 50 8 Z" },
  { name: "Square", desc: "Strong jaw, wide brow", path: "M16 16 L84 16 L84 84 L16 84 Z" },
  { name: "Heart", desc: "Wide forehead, narrow chin", path: "M50 82 C22 60 7 44 7 30 C7 18 17 10 28 10 C38 10 46 16 50 24 C54 16 62 10 72 10 C83 10 93 18 93 30 C93 44 78 60 50 82 Z" },
  { name: "Diamond", desc: "Wide cheekbones", path: "M50 7 L90 50 L50 93 L10 50 Z" },
  { name: "Oblong", desc: "Long & narrow", path: "M50 8 C63 8 76 18 76 32 L76 68 C76 82 63 92 50 92 C37 92 24 82 24 68 L24 32 C24 18 37 8 50 8 Z" },
] as const;

export function shapePath(name: string): string {
  return FACE_SHAPES.find((s) => s.name === name)?.path ?? FACE_SHAPES[0].path;
}
