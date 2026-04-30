import type { Prospect } from "@/lib/prospects";

interface Props {
  prospect: Prospect;
}

export default function PricingCard({ prospect }: Props) {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Was im Pilot enthalten ist
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-gray-900"
          style={{ fontFamily: prospect.fontFamily }}
        >
          NachtragsAgent - fest installiert in 14 Werktagen.
        </h2>

        <div
          className="rounded-xl p-8 md:p-10 text-white"
          style={{ backgroundColor: prospect.primaryColor }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80 mb-3">
                Im Setup enthalten
              </div>
              <ul className="space-y-3 text-sm md:text-base">
                <li>✓ Mail- & Bautagebuch-Integration</li>
                <li>✓ Vertragsabgleich-Engine (LV + AGB werden eingelesen)</li>
                <li>✓ Sprachprofil-Training auf eure typischen Verträge</li>
                <li>✓ AVV (DSGVO-konform) inklusive</li>
                <li>✓ 14 Werktage von Kick-off bis Live-Schaltung</li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80 mb-3">
                Im laufenden Betrieb
              </div>
              <ul className="space-y-3 text-sm md:text-base">
                <li>✓ Wöchentliche Nachtrags-Liste mit Begründungstexten</li>
                <li>✓ PDF-Export für eure Buchhaltung</li>
                <li>✓ Direkt-Support per WhatsApp</li>
                <li>✓ Monatliche Performance-Auswertung</li>
                <li>✓ Monatlich kündbar (nach 3 Mt Mindestlaufzeit)</li>
              </ul>
            </div>
          </div>

          <div
            className="mt-10 pt-8 border-t border-white/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="text-sm opacity-80">
                Investition besprechen wir im 30-Min-Audit
              </div>
              <div className="text-base md:text-lg">
                Jedes Projekt ist anders - wir richten den Pilot auf
                {" "}{prospect.companyName} zu.
              </div>
            </div>
            <a
              href={prospect.calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-md font-semibold transition hover:opacity-90 whitespace-nowrap"
              style={{
                backgroundColor: prospect.secondaryColor,
                color: "#111",
              }}
            >
              30-Min Audit buchen →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
