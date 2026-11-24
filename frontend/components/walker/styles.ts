export type HairStyleMeta = {
  id: "quiff" | "sidepart" | "curls";
  name: string;
  tag: string;
  desc: string;
  bestFor: string[];
};

export const HAIR_STYLES: HairStyleMeta[] = [
  {
    id: "quiff",
    name: "Textured Quiff",
    tag: "Sharp · Modern",
    desc: "Short tapered sides with a swept-up, textured front. Adds height and structure while staying easy to style.",
    bestFor: ["Round", "Oval", "Square"],
  },
  {
    id: "sidepart",
    name: "Classic Side Part",
    tag: "Clean · Timeless",
    desc: "A sleek, combed side part with a defined parting line. Polished for the office, sharp for the evening.",
    bestFor: ["Oval", "Oblong", "Diamond"],
  },
  {
    id: "curls",
    name: "Curly Crop",
    tag: "Textured · Effortless",
    desc: "Short faded sides with a full crop of natural curls on top. Low-maintenance volume that softens strong angles.",
    bestFor: ["Square", "Heart", "Oblong"],
  },
];

/** Scroll progress where the run ends and the face close-up begins. */
export const RUN_END = 0.62;

/** Hairstyle index (0..2) for a given scroll progress. */
export function styleAt(p: number): number {
  const t = Math.min(1, Math.max(0, p / RUN_END));
  return Math.min(2, Math.floor(t * 3));
}
