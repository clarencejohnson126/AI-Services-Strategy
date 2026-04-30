"use client";

import { useState } from "react";
import type { Prospect } from "@/lib/prospects";

interface Question {
  id: string;
  text: (p: Prospect) => string;
  options: Array<{ label: string; value: number }>;
}

const QUESTIONS: Question[] = [
  {
    id: "projects-parallel",
    text: () => "Wie viele Projekte habt ihr aktuell parallel laufen?",
    options: [
      { label: "1-3", value: 2 },
      { label: "4-6", value: 5 },
      { label: "7-10", value: 8 },
      { label: ">10", value: 12 },
    ],
  },
  {
    id: "nachtrag-process",
    text: () => "Wie kommen Mehrleistungen bei euch normalerweise ans Tageslicht?",
    options: [
      { label: "Mein Polier schreibt's mit", value: 1 },
      { label: "Ich erinnere mich beim Aufmaß", value: 2 },
      { label: "Beim Quartalsabschluss fällt's auf", value: 3 },
      { label: "Ehrlich? Oft zu spät", value: 4 },
    ],
  },
  {
    id: "email-hours",
    text: () => "Wie viele Stunden pro Tag verbringst du mit Mail-Beantwortung?",
    options: [
      { label: "<1 h", value: 1 },
      { label: "1-2 h", value: 2 },
      { label: "2-4 h", value: 3 },
      { label: ">4 h", value: 4 },
    ],
  },
  {
    id: "free-time",
    text: () =>
      "Wenn du morgen 10 zusätzliche Stunden pro Woche hättest - was würdest du machen?",
    options: [
      { label: "Mehr Projekte annehmen", value: 1 },
      { label: "Team besser führen", value: 2 },
      { label: "Endlich Feierabend pünktlich", value: 3 },
      { label: "Strategie / Kalkulation", value: 4 },
    ],
  },
  {
    id: "biggest-frustration",
    text: () =>
      "Welcher Vorgang hat dich in den letzten 4 Wochen am meisten genervt?",
    options: [
      { label: "Vergessener Nachtrag", value: 4 },
      { label: "Verspäteter Aufmaß-Termin", value: 3 },
      { label: "Mail-Chaos", value: 3 },
      { label: "Anderes", value: 2 },
    ],
  },
];

interface ROIResult {
  monthlyLoss: number;
  monthlyCost: number;
  totalStatusQuo: number;
  monthlySavings: number;
  amortizationWeeks: number;
}

function calculateROI(answers: Record<string, number>): ROIResult {
  const projects = answers["projects-parallel"] ?? 5;
  const nachtragRisk = answers["nachtrag-process"] ?? 3;
  const emailHours = answers["email-hours"] ?? 2;

  // Heuristics - calibrated against your audit-framework numbers
  const avgProjectVolume = 200_000;
  const lossPercentage = 0.025 * nachtragRisk;
  const monthlyLoss = (projects * avgProjectVolume * lossPercentage) / 12;

  const officeHoursPerWeek = emailHours * 4;
  const hourlyRate = 80;
  const monthlyCost = officeHoursPerWeek * hourlyRate * 4.3;

  const totalStatusQuo = monthlyLoss + monthlyCost;
  const monthlySavings = totalStatusQuo * 0.6;
  const setupCost = 2997;
  const amortizationWeeks = Math.max(
    4,
    Math.ceil((setupCost / monthlySavings) * 4.3),
  );

  return {
    monthlyLoss: Math.round(monthlyLoss),
    monthlyCost: Math.round(monthlyCost),
    totalStatusQuo: Math.round(totalStatusQuo),
    monthlySavings: Math.round(monthlySavings),
    amortizationWeeks,
  };
}

interface Props {
  prospect: Prospect;
}

export default function AuditBot({ prospect }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"intro" | number | "result">("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const fmt = (v: number) =>
    v.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });

  function answerQuestion(value: number) {
    if (typeof step !== "number") return;
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setStep("result");
    }
  }

  function reset() {
    setAnswers({});
    setStep("intro");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full shadow-lg font-semibold text-white transition hover:scale-105"
        style={{ backgroundColor: prospect.primaryColor }}
      >
        🤖 KI-Bauleiter fragen
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[min(380px,calc(100vw-3rem))] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 text-white flex items-center justify-between"
        style={{ backgroundColor: prospect.primaryColor }}
      >
        <div>
          <div className="font-semibold">KI-Bauleiter</div>
          <div className="text-xs opacity-80">Mini-Audit · 2 Min</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-white/80 hover:text-white text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-5 max-h-[60vh] overflow-y-auto">
        {step === "intro" && (
          <div>
            <p className="text-gray-700 mb-4">
              {prospect.gfFirstName ? `Hi ${prospect.gfFirstName}` : "Hi"}, ich bin der KI-Bauleiter von Rebelz. In
              2 Minuten zeig ich dir, was bei {prospect.companyName} mit KI
              konkret rauskommt. 5 kurze Fragen?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="px-4 py-2 rounded-md font-semibold text-white"
                style={{ backgroundColor: prospect.primaryColor }}
              >
                Los geht's →
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md font-semibold bg-gray-100 text-gray-700"
              >
                Später
              </button>
            </div>
          </div>
        )}

        {typeof step === "number" && (
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Frage {step + 1} / {QUESTIONS.length}
            </div>
            <p className="text-gray-900 font-semibold mb-4">
              {QUESTIONS[step].text(prospect)}
            </p>
            <div className="space-y-2">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => answerQuestion(opt.value)}
                  className="w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition text-gray-800"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "result" && (
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Auf Basis deiner Antworten
            </div>
            <div className="space-y-3 mb-5 font-mono text-sm">
              {(() => {
                const roi = calculateROI(answers);
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Verlust durch Nachträge / Mt:
                      </span>
                      <span className="font-bold text-gray-900">
                        ~ {fmt(roi.monthlyLoss)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Bürozeit-Kosten / Mt:</span>
                      <span className="font-bold text-gray-900">
                        ~ {fmt(roi.monthlyCost)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="text-gray-900 font-semibold">
                        Status quo gesamt / Mt:
                      </span>
                      <span className="font-bold text-gray-900">
                        ~ {fmt(roi.totalStatusQuo)}
                      </span>
                    </div>
                    <div
                      className="rounded p-3 mt-2"
                      style={{ backgroundColor: `${prospect.primaryColor}15` }}
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Mit NachtragsAgent + Doku-Pilot:
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: prospect.primaryColor }}
                        >
                          - {fmt(roi.monthlySavings)} / Mt
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-700">
                          ROI in:
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: prospect.primaryColor }}
                        >
                          {roi.amortizationWeeks} Wochen
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Soll ich dir das im 30-Min Audit live mit euren echten Mails
              durchrechnen?
            </p>
            <div className="flex gap-2">
              <a
                href={prospect.calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 rounded-md font-semibold text-white text-center"
                style={{ backgroundColor: prospect.primaryColor }}
              >
                Termin buchen
              </a>
              <button
                onClick={reset}
                className="px-4 py-2 rounded-md font-semibold bg-gray-100 text-gray-700"
              >
                Nochmal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
