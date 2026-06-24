// Loader for the per-company personalized landing pages at /p/[slug].
// Company data (facts, painpoints, opener) is researched from each firm's own
// website and stored in src/data/prospects.json. No fabricated facts.

import rawData from "@/data/prospects.json";
import { GEWERKE, type Gewerk } from "@/lib/handwerk";

export interface Prospect {
  slug: string;
  company: string;
  gewerk: string;
  facts: string[];
  painpoints: string[];
  opener: string;
}

const PROSPECTS = rawData as unknown as Record<string, Prospect>;

export function getProspect(
  slug: string,
): { prospect: Prospect; gewerk: Gewerk } | null {
  const p = PROSPECTS[slug];
  if (!p) return null;
  const gewerk = GEWERKE[p.gewerk] ?? GEWERKE.trockenbau;
  return { prospect: p, gewerk };
}

export function allProspectSlugs(): string[] {
  return Object.keys(PROSPECTS);
}
