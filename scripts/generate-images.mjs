// Generate trade-specific imagery via Gemini Nano Banana 2 (gemini-3.1-flash-image-preview).
// Per trade: hero, pain, timeline. Plus one shared AI-flow illustration.
// Saves to /public/images/{trade}/ and /public/images/shared/.
//
// Usage:  node scripts/generate-images.mjs
// Requires: GEMINI_API_KEY in .env.local

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const envPath = join(process.cwd(), ".env.local");
const env = readFileSync(envPath, "utf-8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"))
  .reduce((acc, line) => {
    const [k, ...rest] = line.split("=");
    acc[k.trim()] = rest.join("=").trim();
    return acc;
  }, {});

const API_KEY = env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const MODELS_TO_TRY = [
  "gemini-3.1-flash-image-preview",
  "gemini-3-pro-image-preview",
];

// Trade-specific imagery profiles.
// HERO  = workspace photo with site manager + tablet + trade-specific environment
// PAIN  = cluttered office desk specific to trade's paperwork
// TIMELINE = manager checking tablet in active trade-specific work environment
const TRADE_PROFILES = {
  trockenbau: {
    label: "Trockenbau",
    heroSetting:
      "interior of a modern office building under construction with metal stud framing partition walls visible, GK gypsum boards (Gipskartonplatten) stacked nearby, suspended ceiling grid being installed overhead, dust covers on the floor",
    painPaperwork:
      "the desk of a small Trockenbau (drywall) contractor: stacks of LV documents specifically about gypsum boards, partition walls, suspended ceiling installations, joint compound specifications. A hard hat with chalk dust on it tossed beside the laptop",
    timelineSetting:
      "an unfinished interior space with exposed metal stud framing for partition walls, half-installed gypsum boards, sheet of plasterboard leaning against wall, suspended ceiling grid visible overhead",
  },
  elektriker: {
    label: "Elektriker",
    heroSetting:
      "interior of a modern building under construction with an open electrical distribution panel, exposed cable trays running along the ceiling, cable bundles and conduits visible, electrical sockets being installed on raw concrete walls",
    painPaperwork:
      "the desk of a small Elektriker (electrical contractor): stacks of wiring diagrams, electrical permits (Elektroinstallationsnachweis), VDE-norm specifications, schedule of luminaires. Insulated screwdrivers and a multimeter beside the laptop",
    timelineSetting:
      "an unfinished interior with an exposed electrical distribution panel, cable bundles emerging from the wall, conduits running along the ceiling, partially installed switch boxes",
  },
  bodenleger: {
    label: "Bodenleger",
    heroSetting:
      "interior of a building under construction with freshly leveled cement screed (Estrich) floor, rolls of vinyl flooring and stacked parquet planks nearby, a chalk line snapped on the smooth screed surface, knee pads and a trowel visible",
    painPaperwork:
      "the desk of a small Bodenleger (flooring contractor): stacks of LV documents about vinyl, parquet and screed installations, color sample swatches for floor finishes, room measurement diagrams. A trowel and rubber mallet beside the laptop",
    timelineSetting:
      "an unfinished interior room with a freshly leveled cement screed floor, partially installed parquet planks at one end, rolls of vinyl flooring and underlayment material in the corner",
  },
  maler: {
    label: "Maler",
    heroSetting:
      "interior of a building under renovation with freshly primed white walls, paint cans (Eimer) of premium wall paint stacked on a drop cloth, a paint roller on an extension pole leaning against the wall, masking tape lines crisp on the trim",
    painPaperwork:
      "the desk of a small Maler (painting contractor): stacks of LV documents about interior painting, surface preparation, color schemes (RAL color charts visible), wallpapering specifications. A paint brush wrapped in plastic and a putty knife beside the laptop",
    timelineSetting:
      "an unfinished interior room with walls partially painted in a fresh light color, masking tape on the trim and floor edges, paint cans and roller tray on a drop cloth in the corner",
  },
};

function buildHeroPrompt(profile) {
  return `Editorial photograph, documentary photojournalism style, NOT plastic NOT stock-photo NOT cgi. A German construction site at golden hour. ${profile.heroSetting}. In the foreground a site manager wearing a navy blue hard hat and a fleece work jacket reviews documents on an iPad, slightly out of focus. Warm cinematic lighting, shallow depth of field, real grain, real shadows, photorealistic. No text, no logos, no watermarks, no people facing camera. Aspect ratio 16:9.`;
}

function buildPainPrompt(profile) {
  return `Editorial photograph, documentary photojournalism style, NOT plastic NOT stock-photo NOT cgi. ${profile.painPaperwork}. An open laptop showing an email inbox sits open on the desk. Atmospheric warm desk lamp lighting in an otherwise dim office at dusk. Conveys end-of-day overwhelm, real and grounded. Photorealistic, top-down 3/4 angle, real grain, no text visible on documents. Aspect ratio 16:9.`;
}

function buildTimelinePrompt(profile) {
  return `Editorial photograph, documentary photojournalism style, NOT plastic NOT stock-photo NOT cgi. A German construction project manager wearing a navy blue work jacket, standing on a partially completed floor, looking thoughtfully at an iPad. ${profile.timelineSetting}. Through the unfinished structure, soft afternoon light streaming in. Professional, calm, in-control composition. No visible logos or brand names. Photorealistic, shot on a 35mm lens, real shadows. Aspect ratio 16:9.`;
}

function buildSharedAiFlowPrompt() {
  return `Modern minimalist editorial illustration showing a stream of email envelopes flowing from left into an abstract geometric AI processing engine, then transforming on the right into a clean structured document with checkmark icons and euro currency symbols. Navy blue and warm gold accent palette, clean off-white background, isometric perspective, editorial newspaper-style line work. No text, no logos. Aspect ratio 16:9.`;
}

const IMAGES = [];
for (const [trade, profile] of Object.entries(TRADE_PROFILES)) {
  IMAGES.push({
    file: `${trade}/hero.png`,
    prompt: buildHeroPrompt(profile),
  });
  IMAGES.push({
    file: `${trade}/pain.png`,
    prompt: buildPainPrompt(profile),
  });
  IMAGES.push({
    file: `${trade}/timeline.png`,
    prompt: buildTimelinePrompt(profile),
  });
}
IMAGES.push({
  file: "shared/ai-agent-flow.png",
  prompt: buildSharedAiFlowPrompt(),
});

async function generateImage(prompt, modelName) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = part.inlineData ?? part.inline_data;
    if (inline?.data) return Buffer.from(inline.data, "base64");
  }
  throw new Error("No image in response: " + JSON.stringify(data).slice(0, 400));
}

async function generateWithFallback(prompt) {
  let lastErr;
  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`  → trying ${model}`);
      const buf = await generateImage(prompt, model);
      console.log(`  ✓ ${model} (${buf.length} bytes)`);
      return buf;
    } catch (e) {
      console.log(`  ✗ ${model}: ${e.message.slice(0, 120)}`);
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("All models failed");
}

async function main() {
  console.log(`Generating ${IMAGES.length} trade-specific images...\n`);
  const baseDir = join(process.cwd(), "public", "images");

  for (const { file, prompt } of IMAGES) {
    const outPath = join(baseDir, file);
    mkdirSync(dirname(outPath), { recursive: true });
    if (existsSync(outPath)) {
      console.log(`⊘ ${file} exists, skipping`);
      continue;
    }
    console.log(`\n▶ ${file}`);
    try {
      const buf = await generateWithFallback(prompt);
      writeFileSync(outPath, buf);
      console.log(`  💾 → ${outPath}`);
    } catch (e) {
      console.error(`  ❌ FAILED: ${e.message}`);
    }
  }
  console.log("\nDone.");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
