import type { Prospect } from "@/lib/prospects";

interface Props {
  prospect: Prospect;
}

const STEPS = [
  {
    day: "Tag 1",
    title: "Onboarding-Call (60 Min)",
    description:
      "Du gibst mir Zugang zu einem dedizierten Mail-Account, deinen Standard-Vertrag und ein typisches LV. Ich brauche keinen Daten-Migration - alles bleibt bei euch.",
    bullets: [
      "Mail-Forwarder einrichten (Aufwand: 15 Min mit deinem IT)",
      "AVV (DSGVO-konform) wird übergeben",
      "Welche Vorgänge zählen bei euch als Mehrleistung?",
    ],
  },
  {
    day: "Tag 2-7",
    title: "Setup-Phase (im Hintergrund)",
    description:
      "Ich integriere die Mail-Anbindung, lade deine Verträge ins System, trainiere das Sprach-Profil auf eure typischen Begriffe.",
    bullets: [
      "Vertrags-Engine lernt eure LV-Struktur",
      "Sprach-Modell wird auf eure E-Mail-Tonalität feinjustiert",
      "Kein Eingriff in eure bestehenden Tools (Sage / Datev / etc.)",
    ],
  },
  {
    day: "Tag 8-13",
    title: "Test-Phase mit echten Projekten",
    description:
      "Wir laufen parallel. Du markierst, was Treffer und was Fehlalarm war. Ich tune nach. 20-30 % Fehlerquote in dieser Phase ist normal.",
    bullets: [
      "Du gibst Feedback in 2 Klicks: Treffer / Fehlalarm",
      "Ich nehme nach jeder Markierung Anpassungen vor",
      "Kein Zwang zur Live-Schaltung wenn die Quote nicht passt",
    ],
  },
  {
    day: "Tag 14",
    title: "Go-Live",
    description:
      "Ab heute jeden Freitag um 09:00 in deiner Inbox: die Wochen-Liste mit klaren Nachträgen + grenzwertigen Vorgängen + fertigem Begründungstext.",
    bullets: [
      "Wöchentlicher Status-Report automatisch",
      "Begründungstexte fertig zum Senden",
      "PDF-Export für deine Buchhaltung",
    ],
  },
  {
    day: "Tag 60",
    title: "60-Tage-Bilanz",
    description:
      "Wir schauen gemeinsam: was wurde gefunden, was abgerechnet, wo läuft es noch nicht rund. Du entscheidest: weiterlaufen oder stoppen.",
    bullets: [
      "Konkrete Eurozahl: was hat der Agent eingebracht?",
      "Kein Lock-in - monatlich kündbar nach Mindestlaufzeit (3 Mt)",
      "Bei Founding Customer: Video-Testimonial-Aufnahme",
    ],
  },
];

export default function HowItWorks({ prospect }: Props) {
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center mb-16">
          <div>
            <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Was passiert in den ersten 60 Tagen
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900"
              style={{ fontFamily: prospect.fontFamily }}
            >
              Vom Kick-off zum ersten erkannten Nachtrag.
            </h2>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/${prospect.trade}/timeline.png`}
              alt={`Projektleiter prüft Status auf der ${prospect.companyName}-Baustelle`}
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>

        <ol className="space-y-8 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-6">
              <div className="flex-shrink-0 w-32 pt-1">
                <div
                  className="text-xs uppercase tracking-widest font-bold mb-1"
                  style={{ color: prospect.primaryColor }}
                >
                  {step.day}
                </div>
                <div
                  className="h-1 w-12 rounded"
                  style={{ backgroundColor: prospect.primaryColor }}
                />
              </div>
              <div className="flex-1 pb-8 border-b border-gray-200 last:border-0">
                <h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: prospect.fontFamily }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-700 mb-3">{step.description}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {step.bullets.map((b, j) => (
                    <li key={j}>✓ {b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

