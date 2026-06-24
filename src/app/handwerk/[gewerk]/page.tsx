import { notFound } from "next/navigation";
import { GEWERKE, STORIES, ABLAUF, BRAND } from "@/lib/handwerk";
import { pickPalette } from "@/lib/theme";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(GEWERKE).map((gewerk) => ({ gewerk }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gewerk: string }>;
}) {
  const { gewerk } = await params;
  const g = GEWERKE[gewerk];
  if (!g) return { title: "Nicht gefunden" };
  return {
    title: `KI für ${g.label} · Rebelz AI`,
    description: g.heroSub,
    robots: { index: false, follow: false },
  };
}

export default async function GewerkPage({
  params,
}: {
  params: Promise<{ gewerk: string }>;
}) {
  const { gewerk } = await params;
  const g = GEWERKE[gewerk];
  if (!g) notFound();
  const pal = pickPalette(gewerk);
  const s = STORIES;

  return (
    <main className="bg-white" style={{ color: pal.ink }}>
      {/* HERO */}
      <section className="px-6 py-28" style={{ backgroundColor: pal.heroBg, color: pal.heroInk }}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-8 px-4 py-1.5 rounded-full" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
            Rebelz AI für {g.label}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-8">{g.heroHeadline}</h1>
          <p className="text-lg mb-10 max-w-3xl" style={{ color: pal.heroMuted }}>{g.heroSub}</p>
          <div className="flex flex-wrap gap-4 items-center">
            <a href={BRAND.calendly} className="inline-block rounded-lg px-6 py-3 font-semibold" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
              30 Min Gespräch, kostenfrei
            </a>
            <a href={BRAND.phoneHref} className="underline" style={{ color: pal.heroMuted }}>{BRAND.phone}</a>
          </div>
          <p className="text-sm mt-8" style={{ color: pal.heroMuted }}>11 Jahre Bauleiter-Erfahrung im Hochbau, Projekte bis 100 Mio. Wir kennen die Baustelle, nicht nur die Software.</p>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="px-6 py-20" style={{ backgroundColor: pal.band }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-sm uppercase tracking-widest mb-3 opacity-60">Das kennt ihr als {g.verbPlural}</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Wo bei euch heute Geld und Zeit liegen bleiben.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {g.painPoints.map((p, i) => (
              <div key={i} className="rounded-xl p-6 bg-white shadow-sm" style={{ borderTop: `3px solid ${pal.accent}` }}>
                <div className="text-2xl font-bold mb-3" style={{ color: pal.accent }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed opacity-90">{p.body}</p>
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
          <p className="text-lg mb-8 opacity-90">Wir schauen uns gemeinsam an, wo bei euch als {g.verbPlural} am meisten liegen bleibt, und ob sich ein KI-Prozess für euch rechnet. Kein Verkaufsdruck.</p>
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
