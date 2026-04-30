import type { Prospect } from "@/lib/prospects";

interface Props {
  prospect: Prospect;
}

export default function ProspectFooter({ prospect }: Props) {
  return (
    <footer className="px-6 py-12 bg-gray-900 text-gray-300">
      <div className="max-w-5xl mx-auto">
        {/* Sticky-Style Final CTA */}
        <div className="mb-10 pb-10 border-b border-gray-800 text-center">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Kein Verkaufs-Call. Nur Pain quantifizieren.
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            30 Minuten - und du weißt, was bei {prospect.companyName} liegen bleibt.
          </h3>
          <a
            href={prospect.calendlyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-md font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: prospect.secondaryColor,
              color: "#111",
            }}
          >
            Schlachtplan-Gespräch buchen →
          </a>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              Diese Seite wurde individuell erstellt für
            </div>
            <div className="text-white font-semibold">
              {prospect.companyName}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Built by</div>
            <div className="font-semibold">
              <span className="text-white">Rebelz AI</span> · Clarence Johnson
              <br />
              <a
                href="https://www.rebelzai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white transition"
              >
                www.rebelzai.com
              </a>
              <span className="text-sm text-gray-400">
                {" "}· +49 151 5773 1682 · thinkbig@rebelz-ai.com
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-gray-500">
          Diese Demo ist nicht öffentlich indexiert und nur für{" "}
          {prospect.companyName} bestimmt. Logo und Markenelemente werden
          ausschließlich zur Veranschaulichung verwendet - keine
          geschäftliche Verbindung.
        </div>
      </div>
    </footer>
  );
}
