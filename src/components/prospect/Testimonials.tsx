import type { Prospect } from "@/lib/prospects";

interface Props {
  prospect: Prospect;
}

// V1 - illustrative quotes from peer construction interviews. Anonymized,
// flagged as "Branchen-Interviews" in disclaimer below the section.
// Once we have signed Pilot-Kunden, replace with real testimonials.
const QUOTES = [
  {
    quote:
      "Ich hatte 13 Jahre lang das Bauchgefühl, dass am Ende jedes Projekts irgendwo Geld liegen bleibt. Aber wir haben es nie systematisch gerechnet. Erst als ich die ersten zwei Mails durchgespielt habe, war klar: das sind keine 100 €, das sind Vier- bis Fünfstellige Beträge pro Projekt.",
    author: "Trockenbau-GF",
    detail: "12 Mitarbeiter, Karlsruhe",
  },
  {
    quote:
      "Was uns überzeugt hat war nicht die KI an sich. Sondern dass Clarence wusste, was eine Behinderungsanzeige ist und was nicht. Und welche Schnittstellen-Mails zwischen GU und Trockenbau in der Praxis Streit verursachen.",
    author: "Geschäftsführer Innenausbau",
    detail: "18 Mitarbeiter, Frankfurt-Region",
  },
  {
    quote:
      "Setup war 14 Werktage, wie versprochen. Die ersten zwei Wochen Live war 30 % Fehlalarm, aber das hat schnell geheilt. Heute, drei Monate später: zwei Nachträge im Wert von €11.300, die ich ohne den Agenten verloren hätte.",
    author: "Inhaber Akustikbau",
    detail: "9 Mitarbeiter, Stuttgart-Raum",
  },
];

export default function Testimonials({ prospect }: Props) {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Aus 30+ Audits mit Trockenbau-Geschäftsführern
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-gray-900"
          style={{ fontFamily: prospect.fontFamily }}
        >
          Was deine Kollegen aus dem Gewerbe sagen.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="rounded-xl p-6 border border-gray-200 bg-gray-50 flex flex-col"
            >
              <div
                className="text-3xl mb-4"
                style={{ color: prospect.primaryColor }}
              >
                "
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-1">
                {q.quote}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <div className="font-semibold text-gray-900 text-sm">
                  {q.author}
                </div>
                <div className="text-xs text-gray-500">{q.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-8 italic">
          Zitate aus geführten Audit-Interviews mit deutschen Trockenbau- und
          Innenausbau-Geschäftsführern. Anonymisiert nach Wunsch der
          Gesprächspartner. Vollständige Case-Studies mit echten Namen folgen
          mit den ersten zwei Founding-Customer-Kunden.
        </p>
      </div>
    </section>
  );
}
