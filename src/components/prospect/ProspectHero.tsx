import type { Prospect } from "@/lib/prospects";
import { TRADE_VERB } from "@/lib/trades";

interface Props {
  prospect: Prospect;
}

export default function ProspectHero({ prospect }: Props) {
  return (
    <section
      className="relative px-6 py-20 md:py-28"
      style={{
        background: `linear-gradient(135deg, ${prospect.primaryColor}f0, ${prospect.primaryColor}cc)`,
      }}
    >
      <div className="max-w-7xl mx-auto text-white grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        {/* Left: copy */}
        <div>
          {/* Logo or wordmark */}
          <div className="mb-10 flex items-center gap-3">
            {prospect.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={prospect.logoUrl}
                alt={`${prospect.companyName} Logo`}
                className="h-12 w-auto bg-white/95 rounded px-3 py-1"
              />
            ) : (
              <div
                className="text-2xl md:text-3xl font-bold tracking-tight bg-white/15 backdrop-blur px-4 py-2 rounded"
                style={{ fontFamily: prospect.fontFamily }}
              >
                {prospect.companyName}
              </div>
            )}
          </div>

          {/* Eyebrow */}
          <div className="text-sm uppercase tracking-widest opacity-80 mb-4">
            KI-Demo gebaut für {prospect.companyName}
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: prospect.fontFamily }}
          >
            {prospect.gfFirstName ? (
              <>
                Hi {prospect.gfFirstName}.<br />
              </>
            ) : null}
            <span style={{ color: prospect.secondaryColor }}>
              €5.000-15.000 pro Monat
            </span>{" "}
            an Nachträgen, die bei {prospect.companyName} verschwinden.
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
            Ich war 11 Jahre Bauleiter auf Projekten bis €100 Mio. und hatte{" "}
            {TRADE_VERB[prospect.trade]} immer auf der anderen Seite des Tisches.
            {prospect.projectReference && (
              <>
                {" "}Hab mir{" "}
                <span style={{ color: prospect.secondaryColor }}>
                  {prospect.projectReference}
                </span>{" "}
                angeschaut und in 30 Min einen Demo gebaut, was bei{" "}
                {prospect.companyName} mit KI für Nachträge konkret rauskommen
                würde.
              </>
            )}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#nachtragsagent-demo"
              className="px-6 py-3 rounded-md font-semibold text-base transition hover:opacity-90"
              style={{
                backgroundColor: prospect.secondaryColor,
                color: "#111",
              }}
            >
              Demo ansehen ↓
            </a>
            <a
              href={prospect.calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md font-semibold text-base bg-white/15 hover:bg-white/25 transition"
            >
              30-Min Audit buchen
            </a>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${prospect.trade}/hero.png`}
            alt={`${prospect.companyName} Baustelle`}
            className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </section>
  );
}
