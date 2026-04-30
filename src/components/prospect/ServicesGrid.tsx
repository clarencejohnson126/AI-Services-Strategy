import type { Prospect } from "@/lib/prospects";
import {
  calculateBusinessCase,
  formatEur,
  getTradeFlagshipServices,
} from "@/lib/business-case";

interface Props {
  prospect: Prospect;
}

export default function ServicesGrid({ prospect }: Props) {
  const summary = calculateBusinessCase(prospect);
  const flagships = getTradeFlagshipServices(prospect.trade);

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Acht Stellen, an denen KI bei {prospect.companyName} arbeitet
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          style={{ fontFamily: prospect.fontFamily }}
        >
          So setzt sich der Wertbeitrag zusammen.
        </h2>
        <p className="text-gray-700 text-lg mb-12 max-w-3xl">
          Acht Agenten - jeder löst eine konkrete Stelle, an der heute Geld oder
          Zeit verloren geht. Die Beträge sind auf {prospect.companyName} mit{" "}
          {prospect.employeeCount} Mitarbeitern hochgerechnet.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {summary.services.map((service) => {
            const isFlagship = flagships.includes(service.id);
            return (
              <div
                key={service.id}
                className="rounded-xl border p-6 transition hover:shadow-md"
                style={{
                  borderColor: isFlagship
                    ? prospect.primaryColor
                    : "#e5e7eb",
                  borderWidth: isFlagship ? 2 : 1,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                      {service.number}
                    </div>
                    <h3
                      className="text-xl font-bold text-gray-900"
                      style={{ fontFamily: prospect.fontFamily }}
                    >
                      {service.emoji} {service.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: prospect.primaryColor }}
                    >
                      {formatEur(service.monthlyEur)}
                    </div>
                    <div className="text-xs text-gray-500">
                      / Monat{service.monthlyHours ? ` (~${service.monthlyHours} h)` : ""}
                    </div>
                  </div>
                </div>

                {isFlagship && (
                  <div
                    className="inline-block text-xs font-semibold px-2 py-1 rounded mb-3"
                    style={{
                      backgroundColor: `${prospect.primaryColor}15`,
                      color: prospect.primaryColor,
                    }}
                  >
                    ⭐ Besonders relevant für {prospect.companyName}
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-red-600 font-semibold mb-1">
                      Heute
                    </div>
                    <p className="text-gray-700">{service.problem}</p>
                  </div>
                  <div>
                    <div
                      className="text-xs uppercase tracking-widest font-semibold mb-1"
                      style={{ color: prospect.primaryColor }}
                    >
                      Mit KI
                    </div>
                    <p className="text-gray-700">{service.solution}</p>
                  </div>
                  <details className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <summary className="cursor-pointer hover:text-gray-700">
                      So haben wir gerechnet
                    </summary>
                    <p className="mt-2">{service.howCalculated}</p>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
