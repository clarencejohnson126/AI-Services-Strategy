import type { Trade } from "./trades";

export interface Prospect {
  slug: string;
  companyName: string;
  gfFirstName: string;
  gfLastName: string;
  city: string;
  trade: Trade;
  employeeCount: number;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  painBullets: [string, string, string];
  projectReference: string | null;
  heroPhotoUrl: string | null;
  calendlyLink: string;
  whopStandardLink: string;
  whopFoundingLink: string;
}

export type TradePath = "trockenbauer" | "elektriker" | "bodenleger" | "maler";

export const ALLOWED_TRADE_PATHS: readonly TradePath[] = [
  "trockenbauer",
  "elektriker",
  "bodenleger",
  "maler",
] as const;

const TRADE_PATH_TO_TRADE: Record<TradePath, Trade> = {
  trockenbauer: "trockenbau",
  elektriker: "elektriker",
  bodenleger: "bodenleger",
  maler: "maler",
};

const TRADE_TO_PATH: Record<Trade, TradePath> = {
  trockenbau: "trockenbauer",
  elektriker: "elektriker",
  bodenleger: "bodenleger",
  maler: "maler",
};

const TRADE_NOUN: Record<TradePath, string> = {
  trockenbauer: "Trockenbau",
  elektriker: "Elektrotechnik",
  bodenleger: "Bodenbeläge",
  maler: "Malerbetrieb",
};

const DEFAULT_CALENDLY =
  "https://calendly.com/clarencejohnson/rebelz-ai-schlachtplan-gesprach";
const DEFAULT_WHOP_STANDARD = "https://whop.com/checkout/nachtragsagent-standard";
const DEFAULT_WHOP_FOUNDING = "https://whop.com/checkout/nachtragsagent-founding";

const COLORS_BY_TRADE: Record<Trade, { primary: string; secondary: string }> = {
  trockenbau: { primary: "#1B4F72", secondary: "#F5A623" },
  elektriker: { primary: "#2E5A88", secondary: "#F4D03F" },
  bodenleger: { primary: "#6E4F31", secondary: "#D4A574" },
  maler: { primary: "#8B2C2C", secondary: "#E8C39E" },
};

const PAIN_BULLETS: Record<Trade, [string, string, string]> = {
  trockenbau: [
    `Bei Akustikdecken in Verwaltungsbauten verschwinden Mehrleistungen aus dem HLS-Schnittstellen-Gewerk regelmäßig in der Mail-Korrespondenz, niemand schreibt sie als Nachtrag mit.`,
    `In den Aufmaßen fehlt pro Projekt typischerweise eine Position, weil zwischen Bautagebuch und Kalkulation kein automatischer Abgleich stattfindet.`,
    `Beim Quartalsabschluss fällt sechs Wochen zu spät auf: drei Mails enthielten klare Mehrleistungs-Indikatoren, keiner hat sie rechtzeitig als Nachtrag erfasst.`,
  ],
  elektriker: [
    `Pro Projekt kommen 15 bis 25 nachträgliche Wünsche vom Bauherren oder Architekten: eine Steckdose hier, ein LAN-Anschluss da, alles versandet in der Mail-Korrespondenz.`,
    `Schaltplan-Änderungen werden per E-Mail kommuniziert, aber nicht systematisch mit dem ursprünglichen Angebot abgeglichen. Bei größeren Projekten geht so jede Position 1-2x verloren.`,
    `Beim Abschluss merkt der Bauherr: das hatten wir doch noch dazu bestellt. Aber im LV steht es nicht, und in den 200+ Mails findet keiner die Bestätigung schnell genug.`,
  ],
  bodenleger: [
    `Fußbodenaufbau-Sondervarianten (Trittschall-Klasse, Aufkantung, Sockel) werden vom GU per Mail bestellt, aber nicht im Aufmaß-System verbucht.`,
    `Wenn der Estrich nicht trocken war, gibt es eine Behinderung. Drei Wochen später interessiert das niemanden mehr, bis im Aufmaß die Pos.-Zuordnung scheitert und die Tage nicht abgerechnet werden.`,
    `Pro Bauabschnitt 4 bis 7 Detail-Mails zur Fugenausführung, Sockelhöhe oder Übergangsschiene. Alles potenzielle Nachträge, aber keine systematische Erfassung.`,
  ],
  maler: [
    `Farbwechsel-Wünsche kommen über Mail nach Bemusterung. Eine andere RAL-Nummer ist immer Mehraufwand, aber selten ein offizieller Nachtrag.`,
    `Vorgewerk nicht spachtelfertig? Q3-Spachtelung statt Q2 wird stillschweigend gemacht, in der Mail vom Polier dokumentiert, im Aufmaß vergessen.`,
    `Streichen UND Tapezieren in einem Raum, der nur als Streichen im LV stand: diese Mehrleistungen schlüpfen durch, weil keiner alle Räume mit dem Original-LV abgleicht.`,
  ],
};

interface EnrichmentArgs {
  tradePath: TradePath;
  nameSlug: string;
  companyName: string;
  gfFirstName?: string;
  gfLastName?: string;
  city?: string;
  employeeCount?: number;
  projectReference?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  // Override the trade-default pain bullets with company-specific ones.
  painBullets?: [string, string, string];
}

function buildEnriched(args: EnrichmentArgs): Prospect {
  const trade = TRADE_PATH_TO_TRADE[args.tradePath];
  const colors = COLORS_BY_TRADE[trade];
  return {
    slug: `${args.tradePath}/${args.nameSlug}`,
    companyName: args.companyName,
    gfFirstName: args.gfFirstName ?? "",
    gfLastName: args.gfLastName ?? "",
    city: args.city ?? "Rhein-Neckar",
    trade,
    employeeCount: args.employeeCount ?? 12,
    logoUrl: null,
    primaryColor: args.primaryColor ?? colors.primary,
    secondaryColor: args.secondaryColor ?? colors.secondary,
    fontFamily: "Inter",
    painBullets: args.painBullets ?? PAIN_BULLETS[trade],
    projectReference: args.projectReference ?? null,
    heroPhotoUrl: null,
    calendlyLink: DEFAULT_CALENDLY,
    whopStandardLink: DEFAULT_WHOP_STANDARD,
    whopFoundingLink: DEFAULT_WHOP_FOUNDING,
  };
}

function capitalizeName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Auto-generate a basic prospect from URL params alone, used when no enriched
// entry exists. The page still renders with trade-correct images, colors and
// pain bullets - just without a GF name or specific project reference.
function buildAutoProspect(tradePath: TradePath, nameSlug: string): Prospect {
  const trade = TRADE_PATH_TO_TRADE[tradePath];
  const colors = COLORS_BY_TRADE[trade];
  const niceName = capitalizeName(nameSlug);
  return {
    slug: `${tradePath}/${nameSlug}`,
    companyName: `${niceName} ${TRADE_NOUN[tradePath]}`,
    gfFirstName: "",
    gfLastName: "",
    city: "Rhein-Neckar",
    trade,
    employeeCount: 12,
    logoUrl: null,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    fontFamily: "Inter",
    painBullets: PAIN_BULLETS[trade],
    projectReference: null,
    heroPhotoUrl: null,
    calendlyLink: DEFAULT_CALENDLY,
    whopStandardLink: DEFAULT_WHOP_STANDARD,
    whopFoundingLink: DEFAULT_WHOP_FOUNDING,
  };
}

function isTradePath(value: string): value is TradePath {
  return (ALLOWED_TRADE_PATHS as readonly string[]).includes(value);
}

// 26 enriched prospects. Real DACH companies scraped from public websites 2026-04-29.
// Companies with extractable rich data (GF name, services, project angles) get
// custom pain bullets. Companies with thin web presence fall back to trade-default
// pain bullets (still trade-relevant, just not company-specific).
const ENRICHED_PROSPECTS: Prospect[] = [
  // ===== Reference / Demo =====
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "mueller",
    companyName: "Müller Trockenbau GmbH",
    gfFirstName: "Stefan",
    gfLastName: "Müller",
    city: "Mannheim",
    employeeCount: 14,
    projectReference: "das Bürobau-Projekt in der Augustaanlage",
  }),

  // ===== Trockenbau (7) =====
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "mhm",
    companyName: "MHM Trockenbau GmbH",
    city: "Mannheim",
    employeeCount: 18,
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "alltom",
    companyName: "ALLTOM GmbH Sanierung + Haustechnik",
    gfFirstName: "Thomas",
    gfLastName: "Kurek",
    city: "Mannheim",
    employeeCount: 15,
    projectReference: "eure vollständigen Badsanierungen mit Fliesenleger, Trockenbauer, Sanitär, Elektriker und Maler in einer Hand",
    painBullets: [
      `Bei Badsanierungen sind simultane Spezialgewerke (Trockenbau Q3/Q4, Fliesenarbeiten Nassbereiche) die Regel. Wenn der Planer mid-Projekt Schachtwandhöhen anpasst, landen die Änderungen im Mail-Chaos statt im Nachtragsformular.`,
      `Euer Netzwerk (Fliesenleger, Maler, Sanitär, Fenster) ist stabil, aber Koordination über Chat und Mail bedeutet, dass Änderungen oft erst beim Polier-Aufmaß sichtbar werden, nicht vorher.`,
      `Trockenbau-Sonderkonstruktionen (Brandschutz F30/F90, Akustik-Doppelständer) sind euer Alltag. Mehrleistungen für Detail-Anpassungen werden selten schriftlich als Nachtrag dokumentiert.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "santos",
    companyName: "Santos Trockenbau",
    city: "Mannheim",
    employeeCount: 12,
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "kurjata",
    companyName: "I&S Innenausbau & Sanierung Kurjata",
    gfFirstName: "Maksymilian",
    gfLastName: "Kurjata",
    city: "Mannheim",
    employeeCount: 12,
    projectReference: "eure Spezialisierung auf Brandschutz und Akustiklösungen im Trockenbau (T30/F90-Konstruktionen)",
    painBullets: [
      `Brandschutz-Trockenbau (F90 Schachtwände, T30 Türzargen-Einfassungen) ist euer Kerngeschäft. Wenn der Statiker mid-Build zusätzliche Brandschutz-Varianten anfordert, werden diese oft als kleine Sondervariante behandelt und nicht dokumentiert.`,
      `Akustik-Decken in Bürobauten: drei verschiedene Spezifikationen pro Bauabschnitt, jede potenziell eine Mehrleistung, aber keine strukturierte Nachtragserfassung.`,
      `Türmontage, Zargen-Einfassung und Brandschutzdetails: das Drumherum der Trockenbauarbeiten wird routinemäßig dabei gemacht, ohne separate Kalkulation.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "matfix",
    companyName: "MatFix Der Handwerker GmbH",
    city: "Mannheim",
    employeeCount: 18,
    projectReference: "eure Koordination von Trockenbau (Spachtelung bis Q3/Q4), Malerei und Bodenbelag als Komplett-Anbieter",
    painBullets: [
      `Als Koordinator mehrerer Gewerke (Trockenbau, Maler, Bodenbelag) ist eure Stärke die alles-aus-einer-Hand-Abwicklung. Schnittstellenprobleme zwischen Spachtler-Qualität und Maler-Endbeschichtung werden erst beim Abnahme-Aufmaß sichtbar.`,
      `Spachteltoleranzen Q3 vs Q4: das ist euer Standard, aber der GU definiert die Q-Klasse oft erst während des Projekts oder ändert sie. Die Mehrleistung wird selten dokumentiert.`,
      `Bodenbelag-Vorbereitung (Ausgleichsmasse, Primer) nach Trockenbau-Decken: ein klassisches dabei ohne separate Kalkulation, obwohl es Tage kostet.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "hzd",
    companyName: "HZ Dienstleistungen",
    city: "Mannheim",
    employeeCount: 10,
    projectReference: "eure Kombination aus Entkernung, Bauendreinigung und anschließendem Trockenbau bei Sanierungsprojekten",
    painBullets: [
      `Entkernung plus Trockenbau in einem Auftrag: ihr macht die komplette Vorbereitung. Änderungen in der Entkernungstiefe (weitere Wände raus, die nicht geplant waren) führen zu Verzögerungen, die nirgends dokumentiert werden.`,
      `Trockenbau nach der Entkernung: die Schnittstelle zwischen Rubbel-Zustand und neuer Trockenbauwand wird oft informell organisiert, statt dass Zwischenschritte (Oberflächenvorbereitung, Dampfbremse) klar kalkuliert sind.`,
      `Transport und Entsorgung der Entkernung wird separat kalkuliert, aber die daraus folgenden Wartezeiten für den Trockenbau werden als Puffer eingeplant statt als Mehrleistung erfasst.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "bossmann",
    companyName: "Bossmann Sanierung & Renovierung",
    city: "Mannheim",
    employeeCount: 20,
    projectReference: "eure Generalunternehmer-Rolle mit Trockenbau als Kerngewerk bei Wohnungs- und Haussanierungen",
    painBullets: [
      `Als GU für komplette Wohnungssanierungen (Bad, Fenster, Energetik, Boden, Trockenbau) ist euer Trockenbau oft das unsichtbare Zwischengewerk, das im Termin-Druck als Puffer genutzt wird.`,
      `Schacht-Konstruktionen für Rohre und Elektro: die technischen Anforderungen ändern sich oft, aber die daraus folgenden Trockenbau-Varianten werden nicht formal als Nachtrag erfasst.`,
      `Akustik-Anforderungen in Wohnungssanierungen: wenn der Architekt nachträglich Lärmschutz fordert, wird es zum Nachtrags-Klassiker, weil Trockenbau-Standard ohne Akustik kalkuliert war.`,
    ],
  }),

  // ===== Elektriker (6) =====
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "schuster",
    companyName: "Elektro Schuster GmbH",
    gfFirstName: "Erich",
    gfLastName: "Schuster",
    city: "Mannheim",
    employeeCount: 8,
    projectReference: "eure Spezialisierung auf Heizung, Warmwasser, Elektrotechnik und SAT-/Kabel-TV im privaten Sektor",
    painBullets: [
      `Nachtspeicherheizungs-Modernisierung und Warmwasserbereitung sind eure Kernkompetenz. Wenn ein Kunde mid-Projekt auf Wärmepumpe wechselt, fehlt die Kalkulationsvorlage dafür.`,
      `Heizungs-Elektroinstallationen für externe Heizungsbauer: ihr verlegt die Stromleitungen, aber Koordination über Mail führt oft zu doppelten Leitungsführungen oder fehlenden Anschlüssen, die erst beim Inbetriebsetzen sichtbar werden.`,
      `SAT- und Kabel-TV-Verkabelung ist euer Zusatzgeschäft. Wenn der Kunde das nachträglich in jedem Zimmer haben will, wird es zur Mehrleistung, die nie sauber kalkuliert wurde.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "ert",
    companyName: "ERT Elektrotechnik GmbH",
    city: "Meckesheim",
    employeeCount: 15,
    projectReference: "eure breite Aufstellung mit Glasfaser, Smart Home, Baustromverteiler, Industrieelektrik und Thermografie",
    painBullets: [
      `Mit über 10 Leistungsbereichen ist eure Stärke die Breite. Genau das wird zum Nachtrags-Klassiker: Kunden wissen nicht, was in einer Standard-Elektroinstallation enthalten ist und was Spezial-Arbeit kostet.`,
      `Baustromverteiler und Demontage veralteter Anlagen sind Zusatzgeschäft, werden aber oft als Paket kalkuliert statt einzeln. Wenn der Abriss komplexer ist, fehlt die Mehrleistung.`,
      `Smart-Home-Integration (KNX, Digitalstrom) ist beratungsintensiv. Der GU hat selten eine klare Vorstellung vom Aufwand, und euer Design wird mid-Projekt angepasst, ohne dass Mehrkosten erfasst werden.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "prosermo",
    companyName: "prosermo GmbH",
    city: "Abstatt",
    employeeCount: 25,
    projectReference: "eure Positionierung als Energie- und Gebäudetechnik-Komplettdienstleister mit Wärmepumpen-Spezialisierung und DAIKIN-Partnerschaft",
    painBullets: [
      `Wärmepumpen-Installation in unter einer Woche ist euer Versprechen. Wenn aber Sanitär-Vorarbeiten oder Elektro-Anpassungen länger dauern, gibt es keine Puffer-Kalkulation und die Mehrarbeit fällt unter den Tisch.`,
      `Energieberatungs-Dokumentation bei Förderanträgen: die Koordination zwischen eurer Installation und externer Energieberatung führt zu fehlenden Unterlagen oder Verzögerungen, die nicht als Mehrleistung kalkuliert sind.`,
      `Klima- und Heizsystem-Integration: wenn ein Kunde nachträglich Kühlung haben will, ist das eine echte Mehrleistung (zusätzliche Außengeräte, Kältemittel-Kreislauf), die oft als kleine Änderung gehandhabt wird.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "hls",
    companyName: "HLS-Elektro GmbH",
    city: "Heppenheim",
    employeeCount: 18,
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "yucel",
    companyName: "Y-E Yücel Elektro GmbH",
    city: "Ludwigshafen",
    employeeCount: 16,
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "fs",
    companyName: "F&S Elektrotechnik GmbH",
    city: "Hemsbach",
    employeeCount: 20,
  }),

  // ===== Bodenleger (6) =====
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "dm",
    companyName: "DM Boden GmbH",
    city: "Mannheim",
    employeeCount: 14,
    projectReference: "eure Spezialisierung auf Parkett, Vinyl und Laminat in Mannheim, Heidelberg und Karlsruhe",
    painBullets: [
      `Parkett-Verlegung mit Untergrundvorbereitung: wenn der Estrich Feuchteprobleme hat, wird das oft erst beim Aufmaß erkannt. Die Nachbehandlung (Trocknungs-Puffer, zusätzliche Spachtelung) ist nie kalkuliert.`,
      `Vinyl-Design-Böden sind im Trend, aber unterschiedliche Untergrund-Anforderungen (Unebenheiten bis 2 mm vs 5 mm) sind zwischen GU und euch nie schriftlich festgehalten.`,
      `Sockelleisten-Montage wird oft als dabei betrachtet. Komplexe Raumkanten oder Aussparungen werden nachträglich zur Mehrleistung, die im Aufmaß fehlt.`,
    ],
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "zweik",
    companyName: "Fußbodentechnik ZWEIK GmbH",
    city: "Mannheim",
    employeeCount: 14,
    projectReference: "eure Fokussierung auf hochwertiges Parkett ohne Vinyl-Massenmarkt",
    painBullets: [
      `Parkett ist euer Kerngeschäft. Verschiedene Holzarten haben unterschiedliches Quellverhalten. Wenn der Architekt mid-Projekt die Holzart wechselt, fehlt die Kalkulationslogik dafür.`,
      `Oberflächenbehandlung (Öl, Lack, Versiegelung) ist oft nicht als separate Position definiert, sondern bleibt unter Parkett verlegen versteckt. Das führt regelmäßig zu Qualitäts-Diskussionen, ohne dass die Mehrleistung sauber abgerechnet wird.`,
      `Lieferketten-Verzögerungen bei exotischen Holzarten gehen auf eure Kappe, werden aber nicht als terminliche Mehrleistung kalkuliert.`,
    ],
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "karli",
    companyName: "Karli Parkett & Bodenleger",
    city: "Ludwigshafen",
    employeeCount: 8,
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "heil",
    companyName: "Heil Parkett",
    city: "Mannheim",
    employeeCount: 12,
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "bembe",
    companyName: "Bembé Parkett Mannheim",
    city: "Mannheim",
    employeeCount: 22,
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "batu",
    companyName: "Batu Parkett",
    city: "Mannheim",
    employeeCount: 9,
  }),

  // ===== Maler (6) =====
  buildEnriched({
    tradePath: "maler",
    nameSlug: "lutz",
    companyName: "Malerbetrieb Lutz",
    city: "Mannheim",
    employeeCount: 14,
  }),
  buildEnriched({
    tradePath: "maler",
    nameSlug: "bms",
    companyName: "BMS Maler & Stuckateure",
    city: "Ludwigshafen",
    employeeCount: 18,
  }),
  buildEnriched({
    tradePath: "maler",
    nameSlug: "boell",
    companyName: "Peter Böll GmbH",
    city: "Mannheim",
    employeeCount: 12,
  }),
  buildEnriched({
    tradePath: "maler",
    nameSlug: "annweiler",
    companyName: "Annweiler Maler & Stuckateur",
    city: "Heidelberg",
    employeeCount: 16,
  }),
  buildEnriched({
    tradePath: "maler",
    nameSlug: "beyerl",
    companyName: "Malerbetrieb Beyerl",
    city: "Mannheim",
    employeeCount: 10,
  }),
  buildEnriched({
    tradePath: "maler",
    nameSlug: "vella",
    companyName: "Malerbetrieb Vella",
    city: "Mannheim",
    employeeCount: 11,
  }),
];

const ENRICHED_BY_PATH = new Map(
  ENRICHED_PROSPECTS.map((p) => [p.slug, p]),
);

export function getOrBuildProspect(
  tradePath: string,
  nameSlug: string,
): Prospect | null {
  if (!isTradePath(tradePath)) return null;
  if (!nameSlug || !/^[a-z0-9-]+$/i.test(nameSlug)) return null;
  const key = `${tradePath}/${nameSlug.toLowerCase()}`;
  return ENRICHED_BY_PATH.get(key) ?? buildAutoProspect(tradePath, nameSlug.toLowerCase());
}

export function getAllProspectPaths(): Array<{ trade: TradePath; name: string }> {
  return ENRICHED_PROSPECTS.map((p) => {
    const [trade, name] = p.slug.split("/");
    return { trade: trade as TradePath, name };
  });
}

export function getAllEnrichedProspects(): Prospect[] {
  return ENRICHED_PROSPECTS;
}

export { TRADE_TO_PATH };
