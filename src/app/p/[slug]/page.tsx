import { notFound } from "next/navigation";
import { getProspect, allProspectSlugs } from "@/lib/personalized";
import { STORIES, ABLAUF, BRAND } from "@/lib/handwerk";
import { pickPalette, pickHeroVariant } from "@/lib/theme";

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
  const variant = pickHeroVariant(slug);
  const img = p.image || null;
  const s = STORIES;

  const cta = (
    <div className="flex flex-wrap gap-4 items-center">
      <a
        href={BRAND.calendly}
        className="inline-block rounded-lg px-6 py-3 font-semibold"
        style={{ backgroundColor: pal.accent, color: pal.accentInk }}
      >
        30 Min Gespräch, kostenfrei
      </a>
      <a href={BRAND.phoneHref} className="underline" style={{ color: pal.heroMuted }}>
        oder direkt: {BRAND.phone}
      </a>
    </div>
  );

  return (
    <main className="bg-white" style={{ color: pal.ink }}>
      {/* HERO — opener is the hook, large and first */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28" style={{ backgroundColor: pal.heroBg, color: pal.heroInk }}>
        {img && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={p.company} className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${pal.heroBg}cc, ${pal.heroBg}f2)` }} />
          </div>
        )}
        <div className={`relative max-w-6xl mx-auto ${variant === "split" && img ? "grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center" : ""}`}>
          <div>
            <div className="inline-block text-sm font-semibold uppercase tracking-widest mb-6 px-3 py-1 rounded-full" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
              Für {p.company}
            </div>
            <p className="text-3xl md:text-5xl font-bold leading-[1.15] mb-8 max-w-3xl">{p.opener}</p>
            {cta}
            <p className="text-sm mt-8 max-w-xl" style={{ color: pal.heroMuted }}>
              Hinter Rebelz AI: 11 Jahre Bauleiter-Erfahrung im Hochbau, Projekte bis 100 Mio. Wir
              kennen die Baustelle, nicht nur die Software.
            </p>
          </div>
          {variant === "split" && img && (
            <div className="hidden lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={p.company} className="w-full h-72 object-cover rounded-2xl shadow-2xl" />
            </div>
          )}
        </div>
      </section>

      {/* FACTS — the "we researched you" proof, in the accent colour so it cannot be missed */}
      {p.facts && p.facts.length > 0 && (
        <section className="px-6 py-16" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-sm uppercase tracking-widest mb-6 opacity-80">
              Das haben wir über {p.company} herausgefunden
            </div>
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

      {/* FIRM-SPECIFIC PAIN POINTS */}
      <section className="px-6 py-20" style={{ backgroundColor: pal.band }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-sm uppercase tracking-widest mb-3 opacity-60">
            Wo bei euch heute Geld und Zeit liegen bleiben
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Genau die Stellen, die bei {p.company} ins Geld gehen.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(p.painpoints && p.painpoints.length > 0
              ? p.painpoints
              : g.painPoints.map((pp) => pp.title + ". " + pp.body)
            )
              .slice(0, 3)
              .map((pp, i) => (
                <div key={i} className="rounded-xl p-6 bg-white shadow-sm" style={{ borderTop: `3px solid ${pal.accent}` }}>
                  <div className="text-2xl font-bold mb-3" style={{ color: pal.accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="leading-relaxed">{pp}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* FLAGSHIP: WhatsApp voice timesheet */}
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
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${
                      c.from === "worker" ? "bg-[#dcf8c6] text-gray-900 rounded-br-sm" : "bg-white text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    <div>{c.text}</div>
                    {"note" in c && c.note ? <div className="text-[11px] text-gray-500 mt-1">{c.note}</div> : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs mt-3" style={{ color: pal.heroMuted }}>
              Sprachnachricht rein, fertiger Stundenzettel beim Chef raus.
            </div>
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
                <li key={j} className="flex gap-3">
                  <span className="font-bold" style={{ color: pal.accent }}>✓</span>
                  <span>{b}</span>
                </li>
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
                <div>
                  <h3 className="text-lg font-bold mb-1">{a.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: pal.heroMuted }}>{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            30 Minuten, eure echten Zahlen, ehrliche Einschätzung.
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Wir schauen uns gemeinsam an, wo bei {p.company} am meisten liegen bleibt, und ob sich ein
            KI-Prozess für euch rechnet. Kein Verkaufsdruck.
          </p>
          <a href={BRAND.calendly} className="inline-block rounded-lg px-8 py-4 font-semibold text-lg" style={{ backgroundColor: pal.accent, color: pal.accentInk }}>
            Gespräch buchen
          </a>
          <div className="mt-4 opacity-70">
            oder direkt: <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a>
          </div>
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
