import type { Prospect } from "@/lib/prospects";
import { TRADE_VERB } from "@/lib/trades";
import ClickablePhoto from "./ClickablePhoto";

interface Props {
  prospect: Prospect;
}

export default function BauleiterIntro({ prospect }: Props) {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Wer das hier baut
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-8 text-gray-900"
          style={{ fontFamily: prospect.fontFamily }}
        >
          Der einzige KI-Anbieter, der 11 Jahre auf der Baustelle stand.
        </h2>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <ClickablePhoto
              src="/clarence.png"
              alt="Clarence Johnson - Rebelz AI"
              ringColor={prospect.primaryColor}
            />
            <div className="mt-4">
              <div className="font-bold text-gray-900">Clarence Johnson</div>
              <div className="text-sm text-gray-500">
                Rebelz AI · Mannheim
              </div>
              <a
                href="https://www.rebelzai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                style={{ color: prospect.primaryColor }}
              >
                www.rebelzai.com →
              </a>
            </div>
          </div>

          <div className="md:col-span-2 text-gray-700 space-y-4 text-lg leading-relaxed">
            <p>
              11 Jahre Bauleiter auf Hochbau- und Tiefbau-Projekten bis €100
              Mio. Hochhäuser, Verwaltungsbauten, Industrie. Auf der anderen
              Seite des Tisches: {TRADE_VERB[prospect.trade]} wie ihr.
            </p>
            <p>
              Was mich Monat für Monat genervt hat: Saubere Firmen, gute Arbeit,
              und am Ende des Projekts trotzdem €5.000-15.000 verschenkt - weil
              keiner alle Mails, alle Anweisungen, alle Behinderungsanzeigen
              gleichzeitig im Kopf behalten kann.
            </p>
            <p>
              Inzwischen baue ich KI-Agenten, die genau das übernehmen. Kein
              Software-Anbieter, keine Beraterfirma - Ein-Mann-Werkstatt mit
              Bauleiter-Hintergrund. Damit du dich um die Baustelle kümmern
              kannst, nicht um deinen Posteingang.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 mt-6">
              <div>
                <div className="text-3xl font-bold text-gray-900">11</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Jahre Baustelle
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">€100M</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  größtes Projekt
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">Rhein-Main</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Region
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
