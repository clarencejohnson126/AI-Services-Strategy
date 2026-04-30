import type { Prospect } from "@/lib/prospects";
import { calculateBusinessCase, formatEur } from "@/lib/business-case";

interface Props {
  prospect: Prospect;
}

export default function BusinessCase({ prospect }: Props) {
  const summary = calculateBusinessCase(prospect);
  const monthlyTotal = summary.statusQuoMonthly.totalEur;
  const monthlySavings = summary.withRebelzMonthly.savingsEur;
  const grossThreeYear = monthlySavings * 36;

  return (
    <section
      className="px-6 py-20"
      style={{
        background: `linear-gradient(135deg, #0a0a0a, ${prospect.primaryColor}30)`,
        color: "#fff",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-sm uppercase tracking-widest opacity-70 mb-3">
          Der Business Case für {prospect.companyName}
        </div>
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ fontFamily: prospect.fontFamily }}
        >
          Was Status quo dich monatlich kostet -<br />
          und wieviel davon zurückgeholt werden kann.
        </h2>
        <p className="text-lg opacity-80 mb-12 max-w-3xl">
          Hochgerechnet auf {prospect.employeeCount} Mitarbeiter, ~
          {summary.estimatedProjectsPerYear} Projekte pro Jahr und einen
          geschätzten Jahresumsatz von{" "}
          <span style={{ color: prospect.secondaryColor }}>
            {formatEur(summary.estimatedAnnualRevenueEur)}
          </span>
          . Alle Heuristiken stützen sich auf 11 Jahre Bauleiter-Erfahrung.
        </p>

        {/* The big number block */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
            <div className="text-sm uppercase tracking-widest text-red-400 mb-2">
              Status quo / Monat
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-1">
              −{formatEur(monthlyTotal)}
            </div>
            <div className="text-sm opacity-70">
              verbrennt jeden Monat in Nachträgen + Bürozeit
            </div>
          </div>

          <div
            className="rounded-xl p-6 border-2"
            style={{
              backgroundColor: `${prospect.primaryColor}30`,
              borderColor: prospect.secondaryColor,
            }}
          >
            <div className="text-sm uppercase tracking-widest opacity-80 mb-2">
              Mit Rebelz zurückgewonnen / Monat
            </div>
            <div
              className="text-4xl md:text-5xl font-bold mb-1"
              style={{ color: prospect.secondaryColor }}
            >
              +{formatEur(monthlySavings)}
            </div>
            <div className="text-sm opacity-70">
              60 % Rückgewinnung - konservativ gerechnet
            </div>
          </div>
        </div>

        {/* Status-quo breakdown */}
        <div className="bg-white/5 rounded-xl p-6 mb-12 border border-white/10">
          <div className="text-xs uppercase tracking-widest opacity-70 mb-4">
            So setzt sich Status quo zusammen
          </div>
          <div className="space-y-2 font-mono text-sm">
            <Row
              label="Verlust durch nicht erkannte Nachträge"
              value={summary.statusQuoMonthly.nachtragsLossEur}
              detail={`Jahresumsatz × 5 % ÷ 12`}
            />
            <Row
              label="GF-Stunden für Bürokratie"
              value={summary.statusQuoMonthly.gfTimeCostEur}
              detail="12 h/Wo × 80 €/h × 4,33 Wochen"
            />
            <Row
              label="Verwaltungs-Stunden Büro"
              value={summary.statusQuoMonthly.adminTimeCostEur}
              detail="20 h/Wo × 40 €/h × 4,33 Wochen"
            />
            <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
              <span>Status quo Gesamt / Monat</span>
              <span>{formatEur(monthlyTotal)}</span>
            </div>
          </div>
        </div>

        {/* 3-year value projection - gross savings only, no costs */}
        <div className="text-sm uppercase tracking-widest opacity-70 mb-4">
          3-Jahres-Wertbeitrag
        </div>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 font-semibold">Position</th>
                <th className="text-right p-4 font-semibold">Jahr 1</th>
                <th className="text-right p-4 font-semibold">Jahr 2</th>
                <th className="text-right p-4 font-semibold">Jahr 3</th>
                <th className="text-right p-4 font-semibold">Gesamt 3 J.</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-t border-white/10">
                <td className="p-4">Zurückgewonnene Nachträge + Zeit</td>
                <td className="p-4 text-right text-green-400">
                  +{formatEur(monthlySavings * 12)}
                </td>
                <td className="p-4 text-right text-green-400">
                  +{formatEur(monthlySavings * 12)}
                </td>
                <td className="p-4 text-right text-green-400">
                  +{formatEur(monthlySavings * 12)}
                </td>
                <td className="p-4 text-right text-green-400 font-bold">
                  +{formatEur(grossThreeYear)}
                </td>
              </tr>
              <tr
                className="border-t-2 font-bold"
                style={{ borderColor: prospect.secondaryColor }}
              >
                <td className="p-4">Wertbeitrag gesamt</td>
                <td
                  className="p-4 text-right"
                  style={{ color: prospect.secondaryColor }}
                >
                  +{formatEur(monthlySavings * 12)}
                </td>
                <td
                  className="p-4 text-right"
                  style={{ color: prospect.secondaryColor }}
                >
                  +{formatEur(monthlySavings * 12)}
                </td>
                <td
                  className="p-4 text-right"
                  style={{ color: prospect.secondaryColor }}
                >
                  +{formatEur(monthlySavings * 12)}
                </td>
                <td
                  className="p-4 text-right text-2xl"
                  style={{ color: prospect.secondaryColor }}
                >
                  +{formatEur(grossThreeYear)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm opacity-80">
            Diese Zahlen sind Hochrechnungen auf Basis von Branchenwerten -
            im Audit-Call rechnen wir mit deinen echten Daten neu.
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
            30-Min Audit für deine echten Zahlen →
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="flex justify-between items-baseline">
      <div>
        <div>{label}</div>
        <div className="text-xs opacity-50">{detail}</div>
      </div>
      <div>−{formatEur(value)}</div>
    </div>
  );
}
