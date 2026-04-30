# Trade Demo Outreach

## What This Is

A single Next.js app that serves **personalized prospect demo pages** at `/p/[slug]`. Each prospect (a German construction subcontractor — Trockenbauer, Elektriker, Bodenleger, Maler) sees a page branded with their logo, colors, company name, three pain bullets specific to them, plus two interactive demos:

1. **NachtragsAgent Live-Analyse** — Click "Analyse starten" → real OpenAI call against a sample LV + 7 emails → returns structured Nachtrag findings with fertigem Begründungstext.
2. **Mini-Audit-Bot** — Floating widget, 5 questions, computes ROI live, drops Calendly CTA.

The architecture lets one codebase + one Vercel deploy serve N personalized URLs by reading prospect data from Supabase (planned) or the in-memory `SAMPLE_PROSPECTS` map (current V1).

Started by copying `/Users/clarence/Desktop/prototype` (FitKoh demo). The original FitKoh repo and its live deploy at `fitkoh-aqjb.vercel.app` are untouched.

## Architecture

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind v4 + custom CSS variables in `globals.css`
- **AI:** OpenAI `gpt-4o-mini` for the NachtragsAgent demo. (Anthropic SDK can be added later if claude-haiku gives better German legal reasoning.)
- **Data:** Currently in-memory `SAMPLE_PROSPECTS`. Supabase wiring blocked on MCP authentication.
- **Hosting:** Vercel (TBD — fresh project, separate from FitKoh)
- **Domain (V1):** `trade-demo-outreach.vercel.app/p/[slug]` — Vercel default URL is fine per user decision.

## File map

```
src/
├── app/
│   ├── page.tsx                     ← root: minimal "no public content here" placeholder
│   ├── layout.tsx                   ← Inter font, lang="de", noindex
│   ├── globals.css
│   ├── p/
│   │   └── [slug]/
│   │       └── page.tsx             ← THE prospect page; assembles all components
│   └── api/
│       └── demo/
│           └── analyze/
│               └── route.ts         ← NachtragsAgent endpoint
├── components/
│   └── prospect/
│       ├── ProspectHero.tsx         ← brand-tinted hero with logo/wordmark
│       ├── ProspectPainPoints.tsx   ← 3 numbered bullets
│       ├── NachtragsAgentDemo.tsx   ← interactive demo with /api call
│       ├── PricingCard.tsx          ← Standard + Founding Customer
│       ├── ProspectFooter.tsx       ← "Built for [company] by Rebelz AI"
│       └── AuditBot.tsx             ← floating-widget 5-question chatbot
└── lib/
    ├── trades.ts                    ← Trade type + labels
    ├── prospects.ts                 ← Prospect interface + SAMPLE_PROSPECTS
    └── demo-data/
        ├── index.ts                 ← getDemoDataForTrade dispatcher
        └── trockenbau.ts            ← LV + 7 emails (synthetic)
```

## Adding a new prospect (V1, hardcoded)

Edit `src/lib/prospects.ts`. Add an entry to `SAMPLE_PROSPECTS`:

```ts
"new-slug": {
  slug: "new-slug",
  companyName: "...",
  // ...all fields per Prospect interface
}
```

Visit `/p/new-slug` locally. Done.

(Once Supabase is wired, prospects come from a database row — same shape, same UI, no redeploy needed.)

## Adding a new trade demo dataset

Currently only `trockenbau.ts` is a real synthetic dataset. Other trades fall back to it. To add a real Elektriker dataset:

1. Create `src/lib/demo-data/elektriker.ts` exporting `ELEKTRIKER_LV_TEXT` + `ELEKTRIKER_EMAILS`
2. Update `src/lib/demo-data/index.ts` switch statement

## Working principles

1. **Don't touch the FitKoh repo or its deploy.** This is a fresh codebase.
2. **One repo, one deploy, N prospects via slug routing.** Never deploy per prospect.
3. **The wow moment is specificity of language, not pixel-perfect cloning.** Logo + primary color + company name + 3 specific pain bullets + 1 project reference = enough.
4. **Every prospect page is `noindex, nofollow`.** Demo pages shouldn't show up in Google.
5. **Real AI behind every interactive button.** No animations pretending to be analysis. The demo runs an actual `gpt-4o-mini` call.

## Open work (V1 → V2)

- [ ] Supabase `prospects` table (blocked on MCP auth)
- [ ] Wire `/p/[slug]/page.tsx` to read from Supabase instead of `SAMPLE_PROSPECTS`
- [ ] Real LV + email datasets for Elektriker, Bodenleger, Maler
- [ ] Prospect ingestion script (URL → row): scrape website + LinkedIn → extract brand → write Supabase row
- [ ] Admin UI for the 5-min review/tweak step
- [ ] Per-prospect view tracking (which sections scrolled, which CTAs clicked)
- [ ] Auto-archive prospects after 21 days of no engagement
- [ ] Optional: switch demo endpoint to Anthropic Claude with prompt caching for cost reduction
- [ ] Optional: dynamic Google Fonts loading per prospect

## Local dev

```bash
cd /Users/clarence/Desktop/trade-demo-outreach
npm install
npm run dev
# Open http://localhost:3000/p/mueller-trockenbau
```

Required env vars (already in `.env.local` from prototype):

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for V2)

## Deploy

Push to a new GitHub repo. Connect to a NEW Vercel project (not the FitKoh one). Add env vars. Done.
