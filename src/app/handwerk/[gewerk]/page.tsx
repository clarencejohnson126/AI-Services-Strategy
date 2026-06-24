import { notFound } from "next/navigation";
import { GEWERKE, STORIES, ABLAUF, BRAND } from "@/lib/handwerk";

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

  const s = STORIES;

  return (
    <main className="bg-white text-[#1a1a1a]">
      {/* Hero */}
      <section className="bg-[#0a0a0a] text-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm uppercase tracking-widest mb-4" style={{ color: BRAND.primary }}>
            Rebelz AI für {g.label}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {g.heroHeadline}
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl">{g.heroSub}</p>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href={BRAND.calendly}
              className="inline-block rounded-lg px-6 py-3 font-semibold text-white"
              style={{ backgroundColor: BRAND.primary }}
            >
              30 Min Gespräch, kostenfrei
            </a>
            <a href={BRAND.phoneHref} className="text-gray-300 hover:text-white">
              oder direkt anrufen: {BRAND.phone}
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Hinter Rebelz AI: 11 Jahre Bauleiter-Erfahrung im Hochbau, Projekte bis 100 Mio. Wir
            kennen die Baustelle, nicht nur die Software.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="px-6 py-20 bg-[#f8f7f5]">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            Das kennt ihr als {g.verbPlural}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">
            Wo bei euch heute Geld und Zeit liegen bleiben.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {g.painPoints.map((p, i) => (
              <div key={i} className="rounded-xl border border-[#e8e6e1] bg-white p-6">
                <div className="text-2xl font-bold mb-3" style={{ color: BRAND.primary }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story 1: Stundenzettel / WhatsApp voice (flagship) */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">{s.stundenzettel.kicker}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">{s.stundenzettel.title}</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{s.stundenzettel.lead}</p>
            <p className="text-gray-900 font-medium leading-relaxed">{s.stundenzettel.outcome}</p>
          </div>
          {/* WhatsApp-style chat mock */}
          <div className="rounded-2xl bg-[#0a0a0a] p-5 shadow-xl">
            <div className="rounded-xl bg-[#e5ddd5] p-4 space-y-3">
              {s.stundenzettel.chat.map((c, i) => (
                <div
                  key={i}
                  className={`flex ${c.from === "worker" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${
                      c.from === "worker"
                        ? "bg-[#dcf8c6] text-gray-900 rounded-br-sm"
                        : "bg-white text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    <div>{c.text}</div>
                    {"note" in c && c.note ? (
                      <div className="text-[11px] text-gray-500 mt-1">{c.note}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-3">
              Sprachnachricht rein, fertiger Stundenzettel beim Chef raus.
            </div>
          </div>
        </div>
      </section>

      {/* Stories 2-5: alternating feature blocks */}
      {[s.aufmass, s.nachtraege, s.termine, s.doku].map((story, idx) => (
        <section
          key={idx}
          className={`px-6 py-20 ${idx % 2 === 0 ? "bg-[#f5f0f0]" : "bg-white"}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">{story.kicker}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">{story.title}</h2>
            <p className="text-gray-700 text-lg mb-8 max-w-3xl leading-relaxed">{story.lead}</p>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {story.bullets.map((b, j) => (
                <li key={j} className="flex gap-3 text-gray-800">
                  <span style={{ color: BRAND.primary }} className="font-bold">
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* Ablauf */}
      <section className="px-6 py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm uppercase tracking-widest mb-3" style={{ color: BRAND.primary }}>
            So fangen wir an
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Kein Großprojekt. Ein Schritt nach dem anderen.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {ABLAUF.map((a) => (
              <div key={a.step} className="flex gap-5">
                <div className="text-2xl font-bold shrink-0" style={{ color: BRAND.primary }}>
                  {a.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{a.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            30 Minuten, eure echten Zahlen, ehrliche Einschätzung.
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Wir schauen uns gemeinsam an, wo bei euch als {g.verbPlural} am meisten liegen bleibt, und
            ob sich ein KI-Prozess für euch rechnet. Kein Verkaufsdruck.
          </p>
          <a
            href={BRAND.calendly}
            className="inline-block rounded-lg px-8 py-4 font-semibold text-white text-lg"
            style={{ backgroundColor: BRAND.primary }}
          >
            Gespräch buchen
          </a>
          <div className="text-gray-500 mt-4">
            oder direkt: <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-[#0a0a0a] text-gray-500 text-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-4">
          <div>Rebelz AI · Mannheim · {BRAND.site}</div>
          <div>Clarence Johnson · {BRAND.phone}</div>
        </div>
      </footer>
    </main>
  );
}
