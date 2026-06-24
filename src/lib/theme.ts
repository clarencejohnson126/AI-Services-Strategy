// Per-company visual variation so the 88 pages don't all look the same.
// Each slug deterministically maps to one of several palettes + a hero layout
// variant. No more uniform green/black.

export interface Palette {
  name: string;
  heroBg: string; // hero background (dark, tinted)
  heroInk: string; // hero text
  heroMuted: string; // hero secondary text
  accent: string; // accent (buttons, numbers, rules)
  accentInk: string; // text on accent
  band: string; // light section background
  bandAlt: string; // alternate light section background
  ink: string; // body text on light
}

export const PALETTES: Palette[] = [
  {
    name: "amber",
    heroBg: "#1c1714",
    heroInk: "#fdf6ee",
    heroMuted: "#c8b6a3",
    accent: "#e0913f",
    accentInk: "#1c1714",
    band: "#faf5ef",
    bandAlt: "#f1e7da",
    ink: "#221b15",
  },
  {
    name: "copper",
    heroBg: "#101a2b",
    heroInk: "#eef3fb",
    heroMuted: "#9fb0c8",
    accent: "#cd7f4e",
    accentInk: "#ffffff",
    band: "#f4f6fa",
    bandAlt: "#e6edf6",
    ink: "#15202e",
  },
  {
    name: "bordeaux",
    heroBg: "#2a1216",
    heroInk: "#fbf0ef",
    heroMuted: "#cda7a7",
    accent: "#b0354b",
    accentInk: "#ffffff",
    band: "#faf3f2",
    bandAlt: "#f0e1df",
    ink: "#251316",
  },
  {
    name: "teal",
    heroBg: "#0d2125",
    heroInk: "#ecf6f4",
    heroMuted: "#9bc0bb",
    accent: "#1f8f8c",
    accentInk: "#ffffff",
    band: "#f1f7f6",
    bandAlt: "#e0eeeb",
    ink: "#12262a",
  },
  {
    name: "forest",
    heroBg: "#15211a",
    heroInk: "#eef5ef",
    heroMuted: "#a8c2b1",
    accent: "#3f8a5e",
    accentInk: "#ffffff",
    band: "#f3f7f3",
    bandAlt: "#e4eee6",
    ink: "#16261d",
  },
  {
    name: "rust",
    heroBg: "#1b1f24",
    heroInk: "#f4f5f6",
    heroMuted: "#aab2bc",
    accent: "#e2702e",
    accentInk: "#ffffff",
    band: "#f5f6f7",
    bandAlt: "#e7eaed",
    ink: "#1b2026",
  },
  {
    name: "plum",
    heroBg: "#221726",
    heroInk: "#f8f1f7",
    heroMuted: "#c2a8c2",
    accent: "#a9627c",
    accentInk: "#ffffff",
    band: "#f8f4f7",
    bandAlt: "#ebdfe9",
    ink: "#221a25",
  },
  {
    name: "navy",
    heroBg: "#10203a",
    heroInk: "#eef3fa",
    heroMuted: "#9eb1cc",
    accent: "#4a72ad",
    accentInk: "#ffffff",
    band: "#f3f6fa",
    bandAlt: "#e4ebf3",
    ink: "#14243d",
  },
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function pickPalette(slug: string): Palette {
  return PALETTES[hash(slug) % PALETTES.length];
}

// Two hero compositions, chosen deterministically, so the layout also varies.
export function pickHeroVariant(slug: string): "spotlight" | "split" {
  return hash(slug + "x") % 2 === 0 ? "spotlight" : "split";
}
