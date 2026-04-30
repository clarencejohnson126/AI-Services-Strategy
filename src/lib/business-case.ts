import type { Prospect } from "./prospects";
import type { Trade } from "./trades";

// Heuristics - calibrated against the audit-framework numbers from
// the Strategie-Trockenbau docs (file 06_AUDIT-FUNNEL-DE.md).

const AVG_PROJECT_VOLUME_EUR = 200_000;
const PROJECTS_PER_EMPLOYEE_PER_YEAR = 0.6;
const NACHTRAGS_LOSS_PERCENTAGE = 0.05;
const GF_HOURLY_RATE_EUR = 80;
const ADMIN_HOURLY_RATE_EUR = 40;
const GF_OFFICE_HOURS_PER_WEEK = 12;
const ADMIN_OFFICE_HOURS_PER_WEEK = 20;
const WEEKS_PER_MONTH = 4.33;
const REBELZ_RECOVERY_PERCENTAGE = 0.6;
const SETUP_COST_FOUNDING_EUR = 1497;
const SETUP_COST_STANDARD_EUR = 2997;
const MONTHLY_SERVICE_EUR = 397;

export interface ServiceImpact {
  id: string;
  number: string;
  name: string;
  emoji: string;
  category: "money" | "time";
  monthlyEur: number;
  monthlyHours?: number;
  problem: string;
  solution: string;
  howCalculated: string;
}

export interface BusinessCaseSummary {
  estimatedAnnualRevenueEur: number;
  estimatedProjectsPerYear: number;

  statusQuoMonthly: {
    nachtragsLossEur: number;
    gfTimeCostEur: number;
    adminTimeCostEur: number;
    totalEur: number;
  };

  withRebelzMonthly: {
    savingsEur: number;
    serviceCostEur: number;
    netImpactEur: number;
  };

  yearOne: {
    grossSavingsEur: number;
    totalCostEur: number;
    netSavingsEur: number;
  };

  threeYearCumulative: {
    grossSavingsEur: number;
    totalCostEur: number;
    netSavingsEur: number;
  };

  amortizationDays: number;
  services: ServiceImpact[];
}

function impactNachtragsAgent(prospect: Prospect, annualRevenue: number): ServiceImpact {
  const monthlyEur = Math.round((annualRevenue * NACHTRAGS_LOSS_PERCENTAGE) / 12);
  return {
    id: "nachtrags-agent",
    number: "01",
    name: "NachtragsAgent",
    emoji: "💰",
    category: "money",
    monthlyEur,
    problem:
      "Mehrleistungen aus dem täglichen Mail-Verkehr und Bautagebuch werden nicht systematisch erfasst - pro Projekt verschwinden 5-10 % der möglichen Nachträge.",
    solution:
      "KI scannt jede E-Mail, jede Behinderungsanzeige und jeden Bautagebuch-Eintrag und vergleicht mit dem Vertrag. Liefert wöchentlich eine Liste mit fertigem Begründungstext.",
    howCalculated: `${prospect.companyName}: ~${Math.round((annualRevenue / 1_000_000) * 10) / 10} Mio € Jahresumsatz × 5 % Nachtrags-Verlustquote ÷ 12 Mt = ${monthlyEur.toLocaleString("de-DE")} €/Mt`,
  };
}

function impactDokuPilot(prospect: Prospect): ServiceImpact {
  const hoursPerMonth = Math.max(8, prospect.employeeCount * 0.6);
  const monthlyEur = Math.round(hoursPerMonth * GF_HOURLY_RATE_EUR);
  return {
    id: "doku-pilot",
    number: "02",
    name: "Doku-Pilot",
    emoji: "📁",
    category: "time",
    monthlyEur,
    monthlyHours: Math.round(hoursPerMonth),
    problem:
      "200 Dateien pro Tag aus 8 Mail-Verteilern, 4 Cloud-Foldern, dem Tilda-LV und Polier-WhatsApp landen ohne Struktur auf dem Desktop.",
    solution:
      "Agent klassifiziert eingehende Dokumente automatisch nach Projekt, Gewerk und Vorgangs-Typ. Sucht in Sekunden, statt minutenlang zu wühlen.",
    howCalculated: `${Math.round(hoursPerMonth)} h/Mt × ${GF_HOURLY_RATE_EUR} € GF-Stundensatz = ${monthlyEur.toLocaleString("de-DE")} €/Mt`,
  };
}

function impactMailRadar(prospect: Prospect): ServiceImpact {
  const hoursPerMonth = 12;
  const monthlyEur = Math.round(hoursPerMonth * GF_HOURLY_RATE_EUR);
  return {
    id: "mail-radar",
    number: "03",
    name: "Mail-Radar",
    emoji: "📧",
    category: "time",
    monthlyEur,
    monthlyHours: hoursPerMonth,
    problem:
      "100-200 Projekt-Mails pro Woche. Wichtige Anweisungen vom GU gehen unter zwischen Werbung, Kalkulations-Rückfragen und Lieferanten-Mails.",
    solution:
      "Agent liest deine Inbox mit, priorisiert nach Dringlichkeit (GU-Anweisung > Behinderungsanzeige > Standard) und liefert dir täglich eine 5-Min-Briefing.",
    howCalculated: `${hoursPerMonth} h/Mt × ${GF_HOURLY_RATE_EUR} € = ${monthlyEur.toLocaleString("de-DE")} €/Mt`,
  };
}

function impactBaustellenReporter(prospect: Prospect): ServiceImpact {
  const hoursPerMonth = Math.max(10, prospect.employeeCount * 0.4);
  const monthlyEur = Math.round(hoursPerMonth * ADMIN_HOURLY_RATE_EUR);
  return {
    id: "baustellen-reporter",
    number: "04",
    name: "Baustellen-Reporter",
    emoji: "🎙️",
    category: "time",
    monthlyEur,
    monthlyHours: Math.round(hoursPerMonth),
    problem:
      "Polier spricht 30 Min Bautagebuch - ins Handy, nicht in den PC. Kalte Finger, lange Schicht, keiner tippt nach.",
    solution:
      "Polier nimmt Sprach-Memo auf. KI transkribiert + strukturiert: Datum, Gewerk, Leistung, Probleme. PDF-Bautagebuch fertig zum Versand an GU.",
    howCalculated: `${Math.round(hoursPerMonth)} h/Mt × ${ADMIN_HOURLY_RATE_EUR} € Admin-Stundensatz = ${monthlyEur.toLocaleString("de-DE")} €/Mt`,
  };
}

function impactAufmassAssistent(prospect: Prospect): ServiceImpact {
  const hoursPerMonth = 16;
  const monthlyEur = Math.round(hoursPerMonth * ADMIN_HOURLY_RATE_EUR);
  return {
    id: "aufmass-assistent",
    number: "05",
    name: "Aufmaß-Assistent",
    emoji: "📐",
    category: "time",
    monthlyEur,
    monthlyHours: hoursPerMonth,
    problem:
      "Aufmaß auf Klemmbrett. Im Büro abgetippt. Im LV gesucht. Pos.-Zuordnung händisch. Wochen-Verzögerung bis zur Rechnung.",
    solution:
      "Foto vom Klemmbrett oder Aufmaß-Skizze hochladen. KI erkennt Maße, schlägt LV-Position vor, generiert Aufmaß-Blatt fertig zum Versand.",
    howCalculated: `${hoursPerMonth} h/Mt × ${ADMIN_HOURLY_RATE_EUR} € = ${monthlyEur.toLocaleString("de-DE")} €/Mt`,
  };
}

function impactAngebotsBeschleuniger(prospect: Prospect): ServiceImpact {
  const hoursPerMonth = 14;
  const monthlyEur = Math.round(hoursPerMonth * GF_HOURLY_RATE_EUR);
  return {
    id: "angebots-beschleuniger",
    number: "06",
    name: "Angebots-Beschleuniger",
    emoji: "📋",
    category: "time",
    monthlyEur,
    monthlyHours: hoursPerMonth,
    problem:
      "GU schickt 50-Seiten-Ausschreibung mit 3 Tagen Frist. Du liest sie nachts. Kalkulierst zu konservativ aus Zeitdruck. Konkurrenz zieht vorbei.",
    solution:
      "KI liest die Ausschreibung in 10 Min, extrahiert alle Positionen, vergleicht mit deinen letzten Kalkulationen und schlägt EPs vor. Du polierst, du sendest.",
    howCalculated: `${hoursPerMonth} h/Mt × ${GF_HOURLY_RATE_EUR} € = ${monthlyEur.toLocaleString("de-DE")} €/Mt (zzgl. besserer Hit-Rate)`,
  };
}

function impactRfiKoordinator(prospect: Prospect): ServiceImpact {
  const hoursPerMonth = 8;
  const monthlyEur = Math.round(hoursPerMonth * GF_HOURLY_RATE_EUR);
  return {
    id: "rfi-koordinator",
    number: "07",
    name: "RFI-Koordinator",
    emoji: "🔄",
    category: "time",
    monthlyEur,
    monthlyHours: hoursPerMonth,
    problem:
      "Schnittstelle zu HLS / Elektro / Fenster: pro Projekt 30-50 RFIs (Requests for Information). Frage gestellt, Antwort verschwunden, neu gefragt.",
    solution:
      "Agent verfolgt jede RFI-Frage, erkennt Antworten in nachgelagerten Mails, schickt Reminder bei offenen Fragen, liefert RFI-Status-Dashboard.",
    howCalculated: `${hoursPerMonth} h/Mt × ${GF_HOURLY_RATE_EUR} € = ${monthlyEur.toLocaleString("de-DE")} €/Mt`,
  };
}

function impactStundenzettelAgent(prospect: Prospect): ServiceImpact {
  const hoursPerMonth = Math.max(6, prospect.employeeCount * 0.3);
  const monthlyEur = Math.round(hoursPerMonth * ADMIN_HOURLY_RATE_EUR);
  return {
    id: "stundenzettel-agent",
    number: "08",
    name: "Stundenzettel-Agent",
    emoji: "⏱️",
    category: "time",
    monthlyEur,
    monthlyHours: Math.round(hoursPerMonth),
    problem:
      "Handgeschriebene Stundenzettel jeden Freitag. Ins Buchhaltungs-Tool getippt. Fehler eingeschlichen. Lohnabrechnung verzögert.",
    solution:
      "Foto vom handgeschriebenen Stundenzettel. KI digitalisiert + ordnet automatisch Projekt, Gewerk und Mitarbeiter zu. Direkt-Export in Datev / Lexware.",
    howCalculated: `${Math.round(hoursPerMonth)} h/Mt × ${ADMIN_HOURLY_RATE_EUR} € = ${monthlyEur.toLocaleString("de-DE")} €/Mt`,
  };
}

export function calculateBusinessCase(prospect: Prospect): BusinessCaseSummary {
  const projectsPerYear = Math.round(
    prospect.employeeCount * PROJECTS_PER_EMPLOYEE_PER_YEAR,
  );
  const annualRevenue = projectsPerYear * AVG_PROJECT_VOLUME_EUR;

  const services: ServiceImpact[] = [
    impactNachtragsAgent(prospect, annualRevenue),
    impactDokuPilot(prospect),
    impactMailRadar(prospect),
    impactBaustellenReporter(prospect),
    impactAufmassAssistent(prospect),
    impactAngebotsBeschleuniger(prospect),
    impactRfiKoordinator(prospect),
    impactStundenzettelAgent(prospect),
  ];

  // Status quo monthly cost
  const nachtragsLoss = services[0].monthlyEur;
  const gfTimeCost = Math.round(GF_OFFICE_HOURS_PER_WEEK * GF_HOURLY_RATE_EUR * WEEKS_PER_MONTH);
  const adminTimeCost = Math.round(ADMIN_OFFICE_HOURS_PER_WEEK * ADMIN_HOURLY_RATE_EUR * WEEKS_PER_MONTH);
  const statusQuoTotal = nachtragsLoss + gfTimeCost + adminTimeCost;

  // Rebelz savings (recovery rate applied to status-quo total)
  const monthlySavings = Math.round(statusQuoTotal * REBELZ_RECOVERY_PERCENTAGE);
  const monthlyService = MONTHLY_SERVICE_EUR;
  const netMonthly = monthlySavings - monthlyService;

  // Year-1
  const grossYear1 = monthlySavings * 12;
  const costYear1 = SETUP_COST_FOUNDING_EUR + monthlyService * 12;
  const netYear1 = grossYear1 - costYear1;

  // 3-year cumulative
  const grossY3 = monthlySavings * 36;
  const costY3 = SETUP_COST_FOUNDING_EUR + monthlyService * 36;
  const netY3 = grossY3 - costY3;

  // Amortization
  const dailyNet = netMonthly / 30;
  const amortizationDays = Math.max(
    7,
    Math.ceil(SETUP_COST_FOUNDING_EUR / dailyNet),
  );

  return {
    estimatedAnnualRevenueEur: annualRevenue,
    estimatedProjectsPerYear: projectsPerYear,
    statusQuoMonthly: {
      nachtragsLossEur: nachtragsLoss,
      gfTimeCostEur: gfTimeCost,
      adminTimeCostEur: adminTimeCost,
      totalEur: statusQuoTotal,
    },
    withRebelzMonthly: {
      savingsEur: monthlySavings,
      serviceCostEur: monthlyService,
      netImpactEur: netMonthly,
    },
    yearOne: {
      grossSavingsEur: grossYear1,
      totalCostEur: costYear1,
      netSavingsEur: netYear1,
    },
    threeYearCumulative: {
      grossSavingsEur: grossY3,
      totalCostEur: costY3,
      netSavingsEur: netY3,
    },
    amortizationDays,
    services,
  };
}

// Some services are most valuable for specific trades - used for emphasis,
// not for filtering (all 8 services apply to all 4 trades).
export function getTradeFlagshipServices(trade: Trade): string[] {
  switch (trade) {
    case "trockenbau":
      return ["nachtrags-agent", "aufmass-assistent", "rfi-koordinator"];
    case "elektriker":
      return ["nachtrags-agent", "doku-pilot", "rfi-koordinator"];
    case "bodenleger":
      return ["nachtrags-agent", "aufmass-assistent", "angebots-beschleuniger"];
    case "maler":
      return ["nachtrags-agent", "aufmass-assistent", "stundenzettel-agent"];
  }
}

export function formatEur(value: number): string {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}
