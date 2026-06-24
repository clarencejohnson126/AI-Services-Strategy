import { notFound } from "next/navigation";
import { getProspect, allProspectSlugs } from "@/lib/personalized";
import { STORIES, ABLAUF, BRAND } from "@/lib/handwerk";
import { pickPalette, pickLayout } from "@/lib/theme";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProspectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getProspect(slug);
  if (!data) return { title: "Nicht gefunden" };
  return {
    title: `Für ${data.prospect.company} · Rebelz AI`,
    description: data.prospect.opener,
    robots: { index: false, follow: false },
  };
}

export default async function ProspectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getProspect(slug);
  if (!data) notFound();
  const { prospect: p, gewerk: g } = data;
  const pal = pickPalette(slug);
  const img = p.image || null;
  const layout = pickLayout(slug, !!img);
  const s = STORIES;

  const ctaPrimary = (dark: boolean) => (
    <a
      href={BRAND.calendly}
      className="inline-block rounded-lg px-6 py-3 font-semibold"
      style={{ backgroundColor: dark ? "#111111" : pal.accent, color: dark ? "#ffffff" : pal.accentInk }}
    >
      30 Min Gespräch, kostenfrei
    </a>
  );

  // ---------- HERO (4 distinct layouts) ----------
  let hero;
  if (layout === "spotlight") {
    hero = (
      <section className="px-6 py-28 text-center" style={{ backgroundColor: pal.heroBg, color: pal.heroInk }}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-8 px-4 py-1.5 rounded-full" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
            Für {p.company}
          </div>
          <p className="text-3xl md:text-5xl font-bold leading-[1.15] mb-10">{p.opener}</p>
          <div className="flex justify-center gap-4 items-center flex-wrap">
            {ctaPrimary(false)}
            <a href={BRAND.phoneHref} className="underline" style={{ color: pal.heroMuted }}>{BRAND.phone}</a>
          </div>
          <p className="text-sm mt-8" style={{ color: pal.heroMuted }}>11 Jahre Bauleiter-Erfahrung im Hochbau, Projekte bis 100 Mio.</p>
        </div>
      </section>
    );
  } else if (layout === "editorial") {
    hero = (
      <section className="px-6 py-24" style={{ backgroundColor: pal.band, color: pal.ink }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-12 items-start">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: pal.accent }} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: pal.accent }}>Für {p.company}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight mb-10">{p.opener}</h1>
            {ctaPrimary(false)}
          </div>
          <div className="lg:pt-4 lg:border-l lg:pl-8" style={{ borderColor: pal.bandAlt }}>
            <dl className="space-y-5 text-sm">
              <div><dt className="uppercase tracking-widest text-xs opacity-50 mb-1">Standort</dt><dd className="font-medium text-lg">{(p as { city?: string }).city || g.label}</dd></div>
              <div><dt className="uppercase tracking-widest text-xs opacity-50 mb-1">Gewerk</dt><dd className="font-medium text-lg">{g.label}</dd></div>
              <div><dt className="uppercase tracking-widest text-xs opacity-50 mb-1">Wer schreibt</dt><dd className="font-medium">Clarence Johnson, Rebelz AI. 11 Jahre Bauleiter, Hochbau bis 100 Mio.</dd></div>
            </dl>
          </div>
        </div>
      </section>
    );
  } else if (layout === "poster") {
    hero = (
      <section className="relative px-6 py-28 overflow-hidden" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
        <div className="pointer-events-none absolute -right-10 -bottom-16 text-[22vw] font-black leading-none opacity-10 select-none">{g.verbPlural}</div>
        <div className="relative max-w-4xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] mb-8 opacity-80">Für {p.company}</div>
          <p className="text-4xl md:text-6xl font-black leading-[1.08] mb-10">{p.opener}</p>
          <div className="flex gap-4 items-center flex-wrap">
            {ctaPrimary(true)}
            <a href={BRAND.phoneHref} className="underline opacity-90">{BRAND.phone}</a>
          </div>
          <p className="text-sm mt-8 opacity-80">11 Jahre Bauleiter-Erfahrung im Hochbau, Projekte bis 100 Mio.</p>
        </div>
      </section>
    );
  } else {
    // feature: image/accent panel split
    hero = (
      <section className="grid lg:grid-cols-2 min-h-[60vh]">
        <div className="relative min-h-[260px]" style={{ backgroundColor: pal.accent }}>
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={p.company} className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
        <div className="px-6 md:px-12 py-20 flex flex-col justify-center" style={{ backgroundColor: pal.heroBg, color: pal.heroInk }}>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: pal.accent }}>Für {p.company}</div>
          <p className="text-3xl md:text-4xl font-bold leading-[1.15] mb-8">{p.opener}</p>
          {ctaPrimary(false)}
          <p className="text-sm mt-8" style={{ color: pal.heroMuted }}>11 Jahre Bauleiter-Erfahrung im Hochbau, Projekte bis 100 Mio.</p>
        </div>
      </section>
    );
  }

  return (
    <main className="bg-white" style={{ color: pal.ink }}>
      {hero}

      {/* FACTS band */}
      {p.facts && p.facts.length > 0 && (
        <section className="px-6 py-16" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-sm uppercase tracking-widest mb-6 opacity-80">Das haben wir über {p.company} herausgefunden</div>
            <div className="grid md:grid-cols-2 gap-6">
              {p.facts.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-3xl font-bold opacity-50">{String(i + 1).padStart(2, "0")}</div>
                  <p className="text-lg md:text-xl font-medium leading-snug">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PAIN POINTS */}
      <section className="px-6 py-20" style={{ backgroundColor: pal.band }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-sm uppercase tracking-widest mb-3 opacity-60">Wo bei euch heute Geld und Zeit liegen bleiben</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Genau die Stellen, die bei {p.company} ins Geld gehen.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(p.painpoints && p.painpoints.length > 0 ? p.painpoints : g.painPoints.map((pp) => pp.title + ". " + pp.body))
              .slice(0, 3)
              .map((pp, i) => (
                <div key={i} className="rounded-xl p-6 bg-white shadow-sm" style={{ borderTop: `3px solid ${pal.accent}` }}>
                  <div className="text-2xl font-bold mb-3" style={{ color: pal.accent }}>{String(i + 1).padStart(2, "0")}</div>
                  <p className="leading-relaxed">{pp}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* FLAGSHIP */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-sm uppercase tracking-widest mb-3 opacity-60">{s.stundenzettel.kicker}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">{s.stundenzettel.title}</h2>
            <p className="text-lg mb-6 leading-relaxed opacity-90">{s.stundenzettel.lead}</p>
            <p className="font-medium leading-relaxed">{s.stundenzettel.outcome}</p>
          </div>
          <div className="rounded-2xl p-5 shadow-xl" style={{ backgroundColor: pal.heroBg }}>
            <div className="rounded-xl bg-[#e5ddd5] p-4 space-y-3">
              {s.stundenzettel.chat.map((c, i) => (
                <div key={i} className={`flex ${c.from === "worker" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${c.from === "worker" ? "bg-[#dcf8c6] text-gray-900 rounded-br-sm" : "bg-white text-gray-900 rounded-bl-sm"}`}>
                    <div>{c.text}</div>
                    {"note" in c && c.note ? <div className="text-[11px] text-gray-500 mt-1">{c.note}</div> : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs mt-3" style={{ color: pal.heroMuted }}>Sprachnachricht rein, fertiger Stundenzettel beim Chef raus.</div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      {[s.aufmass, s.nachtraege, s.termine, s.doku].map((story, idx) => (
        <section key={idx} className="px-6 py-20" style={{ backgroundColor: idx % 2 === 0 ? pal.bandAlt : "#ffffff" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-sm uppercase tracking-widest mb-3 opacity-60">{story.kicker}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">{story.title}</h2>
            <p className="text-lg mb-8 max-w-3xl leading-relaxed opacity-90">{story.lead}</p>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {story.bullets.map((b, j) => (
                <li key={j} className="flex gap-3"><span className="font-bold" style={{ color: pal.accent }}>✓</span><span>{b}</span></li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* ABLAUF */}
      <section className="px-6 py-20" style={{ backgroundColor: pal.heroBg, color: pal.heroInk }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-sm uppercase tracking-widest mb-3" style={{ color: pal.accent }}>So fangen wir an</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Kein Großprojekt. Ein Schritt nach dem anderen.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {ABLAUF.map((a) => (
              <div key={a.step} className="flex gap-5">
                <div className="text-2xl font-bold shrink-0" style={{ color: pal.accent }}>{a.step}</div>
                <div><h3 className="text-lg font-bold mb-1">{a.title}</h3><p className="text-sm leading-relaxed" style={{ color: pal.heroMuted }}>{a.body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">30 Minuten, eure echten Zahlen, ehrliche Einschätzung.</h2>
          <p className="text-lg mb-8 opacity-90">Wir schauen uns gemeinsam an, wo bei {p.company} am meisten liegen bleibt, und ob sich ein KI-Prozess für euch rechnet. Kein Verkaufsdruck.</p>
          <a href={BRAND.calendly} className="inline-block rounded-lg px-8 py-4 font-semibold text-lg" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>Gespräch buchen</a>
          <div className="mt-4 opacity-70">oder direkt: <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a></div>
        </div>
      </section>

      <footer className="px-6 py-10 text-sm" style={{ backgroundColor: pal.heroBg, color: pal.heroMuted }}>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-4">
          <div>Rebelz AI · Mannheim · {BRAND.site}</div>
          <div>Clarence Johnson · {BRAND.phone}</div>
        </div>
      </footer>
    </main>
  );
}
