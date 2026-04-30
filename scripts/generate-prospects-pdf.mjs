// Generates a clickable PDF listing all 25 real prospect URLs.
// Output: /Users/clarence/Desktop/Rebelz-Prospects-Liste.pdf

import { jsPDF } from "jspdf";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// Pick base URL via env var, defaults to local dev for immediate testing.
// After Vercel deploy: BASE_URL=https://your-real-vercel-url.app node scripts/generate-prospects-pdf.mjs
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const TRADES = [
  {
    label: "Trockenbau",
    color: [27, 79, 114],
    pathPrefix: "/trockenbauer/",
    prospects: [
      { company: "MHM Trockenbau GmbH", city: "Mannheim", emp: 18, slug: "mhm", deep: false },
      { company: "ALLTOM GmbH Sanierung + Haustechnik", city: "Mannheim", emp: 15, slug: "alltom", deep: true },
      { company: "Santos Trockenbau", city: "Mannheim", emp: 12, slug: "santos", deep: false },
      { company: "I&S Innenausbau & Sanierung Kurjata", city: "Mannheim", emp: 12, slug: "kurjata", deep: true },
      { company: "MatFix Der Handwerker GmbH", city: "Mannheim", emp: 18, slug: "matfix", deep: true },
      { company: "HZ Dienstleistungen", city: "Mannheim", emp: 10, slug: "hzd", deep: true },
      { company: "Bossmann Sanierung & Renovierung", city: "Mannheim", emp: 20, slug: "bossmann", deep: true },
    ],
  },
  {
    label: "Elektriker",
    color: [46, 90, 136],
    pathPrefix: "/elektriker/",
    prospects: [
      { company: "Elektro Schuster GmbH", city: "Mannheim", emp: 8, slug: "schuster", deep: true },
      { company: "ERT Elektrotechnik GmbH", city: "Meckesheim", emp: 15, slug: "ert", deep: true },
      { company: "prosermo GmbH", city: "Abstatt", emp: 25, slug: "prosermo", deep: true },
      { company: "HLS-Elektro GmbH", city: "Heppenheim", emp: 18, slug: "hls", deep: false },
      { company: "Y-E Yucel Elektro GmbH", city: "Ludwigshafen", emp: 16, slug: "yucel", deep: false },
      { company: "F&S Elektrotechnik GmbH", city: "Hemsbach", emp: 20, slug: "fs", deep: false },
    ],
  },
  {
    label: "Bodenleger",
    color: [110, 79, 49],
    pathPrefix: "/bodenleger/",
    prospects: [
      { company: "DM Boden GmbH", city: "Mannheim", emp: 14, slug: "dm", deep: true },
      { company: "Fußbodentechnik ZWEIK GmbH", city: "Mannheim", emp: 14, slug: "zweik", deep: true },
      { company: "Karli Parkett & Bodenleger", city: "Ludwigshafen", emp: 8, slug: "karli", deep: false },
      { company: "Heil Parkett", city: "Mannheim", emp: 12, slug: "heil", deep: false },
      { company: "Bembe Parkett Mannheim", city: "Mannheim", emp: 22, slug: "bembe", deep: false },
      { company: "Batu Parkett", city: "Mannheim", emp: 9, slug: "batu", deep: false },
    ],
  },
  {
    label: "Maler",
    color: [139, 44, 44],
    pathPrefix: "/maler/",
    prospects: [
      { company: "Malerbetrieb Lutz", city: "Mannheim", emp: 14, slug: "lutz", deep: false },
      { company: "BMS Maler & Stuckateure", city: "Ludwigshafen", emp: 18, slug: "bms", deep: false },
      { company: "Peter Boell GmbH", city: "Mannheim", emp: 12, slug: "boell", deep: false },
      { company: "Annweiler Maler & Stuckateur", city: "Heidelberg", emp: 16, slug: "annweiler", deep: false },
      { company: "Malerbetrieb Beyerl", city: "Mannheim", emp: 10, slug: "beyerl", deep: false },
      { company: "Malerbetrieb Vella", city: "Mannheim", emp: 11, slug: "vella", deep: false },
    ],
  },
];

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

// ===== Cover =====
doc.setFontSize(11);
doc.setTextColor(120);
doc.setFont("helvetica", "normal");
doc.text("Rebelz AI · Clarence Johnson", 20, 18);
doc.text("Stand 29.04.2026", 190, 18, { align: "right" });

doc.setDrawColor(220);
doc.line(20, 22, 190, 22);

doc.setFontSize(28);
doc.setTextColor(0);
doc.setFont("helvetica", "bold");
doc.text("25 Prospect-Demo-URLs", 20, 38);

doc.setFontSize(13);
doc.setFont("helvetica", "normal");
doc.setTextColor(60);
doc.text("Region Rhein-Neckar · 4 Gewerke", 20, 47);

doc.setFontSize(10);
doc.setTextColor(40);
const intro = [
  "Jede URL fuehrt zu einer personalisierten Demo-Page mit:",
  "  - Firmen-spezifischem Hero (Name + Stadt)",
  "  - Trade-spezifischen Bildern (Trockenbau / Elektro / Boden / Maler)",
  "  - Trade-spezifischen Pain-Bullets",
  "  - Live NachtragsAgent-Demo + PDF-Upload (max 4,5 MB)",
  "  - Mini-Audit-Bot (5 Fragen, ROI live gerechnet)",
  "  - Calendly-Link zum Schlachtplan-Gespraech",
  "",
  "Mit Haken markiert (V) = tief recherchiert mit Custom-Bullets,",
  "die echte Services aus der Webseite referenzieren.",
  "",
  `Base-URL: ${BASE_URL}`,
  "Nach Vercel-Deploy ggf. anpassen.",
];

let y = 60;
for (const line of intro) {
  doc.text(line, 20, y);
  y += 5;
}

// Summary box
y += 5;
doc.setFillColor(245, 245, 245);
doc.rect(20, y, 170, 22, "F");
doc.setFontSize(10);
doc.setFont("helvetica", "bold");
doc.setTextColor(0);
doc.text("Uebersicht", 25, y + 7);
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
let totalDeep = 0;
let total = 0;
for (const t of TRADES) {
  totalDeep += t.prospects.filter((p) => p.deep).length;
  total += t.prospects.length;
}
doc.text(`Trockenbau 7  ·  Elektriker 6  ·  Bodenleger 6  ·  Maler 6  =  ${total} Prospects`, 25, y + 13);
doc.text(`Davon ${totalDeep} mit Custom-Pain-Bullets, ${total - totalDeep} mit Trade-Default.`, 25, y + 18);

// ===== Trade Sections =====
let pageY = 0;
doc.addPage();
pageY = 20;

for (const trade of TRADES) {
  // Section heading
  if (pageY > 250) {
    doc.addPage();
    pageY = 20;
  }

  doc.setFillColor(...trade.color);
  doc.rect(20, pageY - 5, 170, 9, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255);
  doc.text(`${trade.label.toUpperCase()}  ·  ${trade.prospects.length} Prospects`, 25, pageY + 1);
  pageY += 12;

  // Each prospect
  for (const p of trade.prospects) {
    if (pageY > 270) {
      doc.addPage();
      pageY = 20;
    }

    const url = `${BASE_URL}${trade.pathPrefix}${p.slug}`;

    // Company name
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    const checkmark = p.deep ? "[V] " : "    ";
    doc.text(`${checkmark}${p.company}`, 20, pageY);

    // Metadata
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110);
    doc.text(`${p.city}  ·  ${p.emp} Mitarbeiter`, 24, pageY + 4.5);

    // Clickable URL
    doc.setFontSize(9);
    doc.setTextColor(...trade.color);
    doc.textWithLink(url, 24, pageY + 9.5, { url });
    doc.setDrawColor(...trade.color);
    const urlWidth = doc.getTextWidth(url);
    doc.line(24, pageY + 10.2, 24 + urlWidth, pageY + 10.2);

    pageY += 14;
  }
  pageY += 4;
}

// ===== Footer / Notes =====
if (pageY > 240) {
  doc.addPage();
  pageY = 20;
} else {
  pageY += 6;
}

doc.setFontSize(11);
doc.setFont("helvetica", "bold");
doc.setTextColor(0);
doc.text("Hinweise zum Outreach", 20, pageY);
pageY += 6;

doc.setFontSize(9);
doc.setFont("helvetica", "normal");
doc.setTextColor(60);
const notes = [
  "1. URL pro Prospect direkt in DM oder Email kopieren.",
  "2. Bauleiter-Hintergrund im Anschreiben erwaehnen (Trust-Lift).",
  "3. Demo-Page hat alles Wichtige: Pain, Zahlen, Demo, Calendly.",
  "4. Bei Antwort: Calendly-Link bestaetigen, Audit-Termin halten.",
  "",
  "Calendly:  https://calendly.com/clarencejohnson/rebelz-ai-schlachtplan-gesprach",
  "Webseite:  https://www.rebelzai.com",
  "Kontakt:   thinkbig@rebelz-ai.com  ·  +49 151 5773 1682",
];
for (const line of notes) {
  doc.text(line, 20, pageY);
  pageY += 4.5;
}

// ===== Save =====
const outPath = join(process.cwd(), "..", "Rebelz-Prospects-Liste.pdf");
const pdfBytes = doc.output("arraybuffer");
writeFileSync(outPath, Buffer.from(pdfBytes));
console.log(`PDF saved: ${outPath}`);
console.log(`Pages: ${doc.getNumberOfPages()}, Size: ${(pdfBytes.byteLength / 1024).toFixed(1)} KB`);
console.log(`Total prospects: ${total} (deep-customized: ${totalDeep})`);
