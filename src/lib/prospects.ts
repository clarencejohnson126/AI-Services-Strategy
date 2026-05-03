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

  // ===== Batch 2 (2026-05-03) =====

  // ----- Trockenbau (5) -----
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "ehrhard",
    companyName: "Ehrhard GmbH",
    gfFirstName: "Frank",
    gfLastName: "Ehrhard",
    city: "Heidelberg",
    employeeCount: 15,
    projectReference: "eure 90-jährige Stuckateur-Tradition mit Spezialisierung auf ökologisches Bauen, Kalk- und Lehmputze sowie Schimmelsanierung",
    painBullets: [
      `Kalk- und Lehmputze sind beratungsintensiv. Architekten ändern mid-Projekt die Putzklasse oder den Schichtaufbau, weil ein Bauherr nachhaltiger werden will. Diese Mehrleistungen verschwinden in der Mail-Korrespondenz statt im Nachtragsformular.`,
      `Schimmelsanierung beginnt oft als Voruntersuchung und wächst zur Komplettsanierung. Die Übergänge zwischen Diagnostik, Sanierung und Endbeschichtung werden über mehrere Mails verhandelt, ohne dass Mehrleistungen sauber dokumentiert werden.`,
      `Ökologische Materialien haben längere Lieferzeiten und Trocknungsphasen. Verzögerungen werden als Puffer eingeplant statt als Mehrleistung erfasst, obwohl sie eure Ressourcen blockieren.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "itm",
    companyName: "Divita I-T-M GmbH & Co. KG",
    gfFirstName: "Marco",
    gfLastName: "Divita",
    city: "Bürstadt",
    employeeCount: 18,
    projectReference: "eure Aufstellung als Komplettanbieter für Innenausbau, Trockenbau mit Brand- und Schallschutz, Montagebau und Malerarbeiten",
    painBullets: [
      `Brand- und Schallschutz-Trockenbau erfordert exakte Detailausführung. Wenn der Brandschutzgutachter nachträglich F90 statt F30 fordert, ist das eine echte Mehrleistung, die oft als kleine Anpassung behandelt wird.`,
      `Eure Kombination aus Trockenbau und Malerarbeiten in einer Hand bedeutet: Schnittstellen-Probleme zwischen Spachtler-Qualität und Malerei werden intern gelöst, aber Mehrleistungen für Q3/Q4-Spachtelung werden selten dokumentiert.`,
      `Wohn-, Gewerbe-, Industrie- und öffentliche Projekte parallel: jeder Auftraggeber hat eigene Standards für Akustik und Brandschutz. Die Detail-Anpassungen während der Bauphase werden routinemäßig dabei gemacht, ohne separate Kalkulation.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "kohl-tb",
    companyName: "Wilhelm Kohl Gipsergeschäft GmbH",
    city: "Ludwigshafen",
    employeeCount: 12,
    projectReference: "euren Familienbetrieb in zweiter Generation seit 1973 mit Schwerpunkt Innen-/Außenputz, Wärmedämmung und Trockenbau",
    painBullets: [
      `Wärmedämm-Verbundsysteme an der Fassade kollidieren regelmäßig mit Innenputz-Terminen. Wartezeiten zwischen den Gewerken werden über Telefon und Mail koordiniert, aber selten als terminliche Mehrleistung erfasst.`,
      `Innenputz auf neuer Trockenbauwand: die Übergänge zur bestehenden Bausubstanz erfordern Sondergrundierungen oder Armierungsgewebe. Diese Detail-Arbeiten werden im LV nie erwähnt und im Aufmaß nie nachverhandelt.`,
      `Stuckaturarbeiten bei Altbau-Sanierungen: jede Decke ist anders, der Aufwand variiert um den Faktor 2 bis 3. Die Pauschalkalkulation deckt diese Bandbreite nicht ab, ohne dass Nachträge gestellt werden.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "curri",
    companyName: "Curri-Ausbau GmbH",
    gfFirstName: "Sander",
    gfLastName: "Curri",
    city: "Ludwigshafen",
    employeeCount: 12,
    projectReference: "eure Spezialisierung auf Trockenbau, Akustikbau, Bodenbeläge und Sanierung im Raum Ludwigshafen seit 2005",
    painBullets: [
      `Akustikbau in Bürobauten: drei verschiedene Decken-Spezifikationen pro Bauabschnitt. Wenn der Architekt mid-Projekt die Akustik-Anforderung anpasst, geht die Mehrleistung in der Mail-Korrespondenz unter.`,
      `Eure Drei-Gewerke-Aufstellung (Trockenbau, Boden, Akustik) bedeutet, dass ihr oft die kompletten Innenausbau-Übergänge selbst koordiniert. Schnittstellen werden intern gelöst, aber nicht als separate Position abgerechnet.`,
      `Sanierungsprojekte bringen Überraschungen: feuchte Wände, abweichender Bestand, Asbest. Diese Mehrleistungen werden während der Baustelle entschieden und vergessen, beim Abschluss formal zu erfassen.`,
    ],
  }),
  buildEnriched({
    tradePath: "trockenbauer",
    nameSlug: "asbau-pfalz",
    companyName: "AS Bau Pfalz GmbH",
    gfFirstName: "Sercan",
    gfLastName: "Ates",
    city: "Bad Dürkheim",
    employeeCount: 6,
    projectReference: "euer 6-köpfiges Festangestellten-Team für Trockenbau, Akustiklösungen, Entkernung und Entrümpelung im Raum Ludwigshafen, Mannheim, Speyer, Frankenthal",
    painBullets: [
      `Mit einem 6er-Team könnt ihr keine versickerten Mehrleistungen leisten. Jede nicht erfasste Stunde fehlt direkt am Monatsergebnis, wo größere Firmen den Verlust noch im Rauschen verstecken.`,
      `Entkernung plus Trockenbau in einem Auftrag bedeutet: nach der Entkernung ist der Bauzustand anders als geplant. Die Anpassung der Trockenbau-Konstruktion wird oft nicht als Mehrleistung formuliert.`,
      `Akustiklösungen erfordern abgestimmte Materialwahl. Wenn der GU mid-Projekt die Decke ändert, verschiebt sich euer Materialeinkauf, die Verzögerung steht aber nicht in eurer Rechnung.`,
    ],
  }),

  // ----- Elektriker (8) -----
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "wernz",
    companyName: "Elektro Wernz & Co. GmbH",
    gfFirstName: "Stefan",
    gfLastName: "Quast",
    city: "Heidelberg",
    employeeCount: 18,
    projectReference: "euren Innungsbetrieb in Heidelberg-Handschuhsheim mit Schwerpunkten Elektroinstallation, Hausgeräte, Anlagenoptimierung und Messungen/Prüfungen",
    painBullets: [
      `Anlagenoptimierung und Messungen/Prüfungen sind beratungsintensiv. Wenn ein Kunde nach der ersten Messung weitere Optimierungen will, geht das oft als Telefonat statt als formales Nachtragsangebot durch.`,
      `Hausgeräte-Installation als Zusatzgeschäft zur Elektroinstallation: die Schnittstelle (Anschlusspositionen, Wasseranschluss-Koordination) wird mündlich abgestimmt und nirgends sauber dokumentiert.`,
      `Elektroinstallationen in Heidelberger Altbauten: jede Wand verbirgt Überraschungen. Stemmarbeiten, Rohrführung um Bestand, zusätzliche Verteiler werden im laufenden Projekt entschieden, im Aufmaß aber nicht mehr nachgehalten.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "wenzel",
    companyName: "Elektro Wenzel GmbH",
    gfFirstName: "Claus",
    gfLastName: "Wenzel",
    city: "Mannheim",
    employeeCount: 30,
    projectReference: "eure Aufstellung mit zwei Standorten Mannheim und Walldorf und ein Portfolio von Photovoltaik über Industrie-Gebäudetechnik und IT/Datentechnik bis Smart Home und E-Mobilität",
    painBullets: [
      `Photovoltaik plus Wallbox plus Speicher in einem Auftrag: jede Komponente hat eigene Liefer- und Förder-Zyklen. Verzögerungen einer Komponente blockieren die Gesamt-Inbetriebnahme, die daraus entstehende Mehrarbeit wird selten erfasst.`,
      `Industrie-Gebäudetechnik kollidiert mit IT/Datentechnik: Trassen werden geteilt, EMV-Anforderungen sind kritisch. Wenn der Bauherr mid-Projekt die Netzwerk-Topologie ändert, ist das eine echte Mehrleistung, die oft als kleine Anpassung behandelt wird.`,
      `Mit 30 Mitarbeitern und zwei Standorten verliert man schnell den Überblick, welche Mail-Anweisungen tatsächlich abgerechnet wurden. Mehrleistungen pro Projekt summieren sich zu fünfstelligen Beträgen, die keiner systematisch zuordnet.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "menzel",
    companyName: "Elektrotechnik Menzel GmbH",
    gfFirstName: "Matthias",
    gfLastName: "Menzel",
    city: "Heidelberg",
    employeeCount: 12,
    projectReference: "eure Spezialisierung auf Altbausanierung in Heidelberg mit Fokus auf E-Mobilität, Smart Home, Siedle-Sprechanlagen und Netzwerktechnik",
    painBullets: [
      `Altbausanierung in Heidelberg bringt Überraschungen pro Wand: Verteilerstandorte ändern sich, Trassenführung muss um Bestandsleitungen geplant werden. Diese Mehrarbeit wird ad-hoc entschieden und nie ins Aufmaß übertragen.`,
      `Siedle-Sprechanlagen mit Video und Smart-Home-Integration sind beratungsintensiv. Kunden wechseln mid-Projekt von einfacher Sprechanlage auf vernetzte Lösung, ohne dass die Mehrleistung neu kalkuliert wird.`,
      `E-Mobilität bedeutet Lastmanagement und Verteilerumbau. Wenn ein Bauherr nachträglich eine zweite Wallbox oder PV-Kopplung will, ist das eine echte Mehrleistung, die oft als kleine Erweiterung gehandhabt wird.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "richard-mueller",
    companyName: "Richard Müller Elektrotechnik GmbH",
    gfFirstName: "Andreas",
    gfLastName: "Köhler",
    city: "Heidelberg",
    employeeCount: 8,
    projectReference: "euren Familientraditionsbetrieb seit 1949 mit drei Säulen Elektrotechnik, Gebäudetechnik und Sicherheitstechnik plus Fachbetriebszertifizierung für Ladeinfrastruktur",
    painBullets: [
      `Drei Säulen parallel anbieten heißt: Kunden vermischen die Aufträge. Eine Sicherheitstechnik-Erweiterung wird als kleine Ergänzung zur Elektroinstallation kommuniziert, fällt aber kalkulatorisch durchs Raster.`,
      `Fachbetriebszertifizierung Ladeinfrastruktur ist beratungsintensiv. Förderanträge, Lastmanagement-Konzepte, Netzbetreiber-Anmeldung: jeder Schritt erzeugt Mehraufwand, der selten als separate Leistungsposition kalkuliert ist.`,
      `Mit 8 Mitarbeitern und 75 Jahren Familienbetrieb ist Vertrauen euer Kapital. Genau das führt dazu, dass Kunden zusätzliche Wünsche per Mail platzieren, die ihr aus Kulanz mitmacht und nicht abrechnet.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "arnold-elek",
    companyName: "Wolfgang Arnold Elektrotechnik",
    gfFirstName: "Wolfgang",
    gfLastName: "Arnold",
    city: "Heidelberg",
    employeeCount: 8,
    projectReference: "euren Meisterbetrieb in Heidelberg-Weststadt seit 1990 mit E-CHECK-Befähigung und Fokus auf Elektromobilität und Gebäudesystemtechnik",
    painBullets: [
      `E-CHECK ist eine Routine-Prüfung, aber wenn dabei Mängel sichtbar werden, weitet sich der Auftrag zur Sanierung aus. Der Übergang von Prüfung zu Reparatur wird oft per Telefon entschieden, ohne dass die Zusatzleistung kalkulatorisch erfasst wird.`,
      `Elektromobilität in Heidelberger Altbauten erfordert oft komplette Verteiler-Erneuerung. Die Mehrarbeit gegenüber einer Standard-Wallbox-Installation ist erheblich, wird aber selten als separate Position dokumentiert.`,
      `Gebäudesystemtechnik (KNX, Smart Home) ist konfigurations- und beratungsintensiv. Anpassungen an der Programmierung nach der Erstinbetriebnahme werden routinemäßig dabei gemacht, ohne separate Abrechnung.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "kuebler-elek",
    companyName: "Albert Kübler Elektro-GmbH",
    gfFirstName: "Peter",
    gfLastName: "Börner",
    city: "Mannheim",
    employeeCount: 15,
    projectReference: "eure Aufstellung mit zwei Geschäftsfeldern Elektrotechnik und Sanitär-Heizung-Klima in Mannheim-Lindenhof",
    painBullets: [
      `Elektro plus Sanitär-Heizung-Klima in einer Hand: ihr koordiniert die Schnittstellen selbst. Genau das wird zum Falle, weil Kunden davon ausgehen, dass kleine Anpassungen zwischen den Gewerken im Pauschalpreis stecken.`,
      `Heizungs-Modernisierungen mit Wärmepumpe brauchen Elektro-Vorarbeiten (Lastmanagement, Zähler). Wenn die Pumpenleistung mid-Projekt nach oben angepasst wird, ist die elektrische Mehrleistung selten dokumentiert.`,
      `Euer Motto nicht zu groß für kleinste Aufträge bedeutet, dass Klein-Aufträge mit Bestandskunden über Mail laufen. Diese Aufträge entwickeln sich oft zu größeren Projekten, ohne dass die Erweiterungen formal erfasst werden.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "scholl-elek",
    companyName: "Elektro-Scholl GmbH",
    city: "Dossenheim",
    employeeCount: 12,
    projectReference: "euren Innungsbetrieb in dritter Generation seit 1930 mit Spezialisierung auf KNX Smart Home, Lichtplanung, Multiroom-Audio und CAD-Planung für Architekten",
    painBullets: [
      `KNX-Programmierung wird als kleine Anpassung wahrgenommen, ist aber zeitintensiv. Architekten und Bauherren ändern Szenen und Logiken nach der Inbetriebnahme, jede Anpassung kostet Stunden, die selten abgerechnet werden.`,
      `Lichtplanung mit CAD für Architekten: ihr liefert die Vorlage, der Architekt ändert das Layout, ihr planst nach. Diese Iterations-Schleifen werden im Pauschalpreis selten kalkuliert.`,
      `Multiroom-Audio-Installation kollidiert mit anderen Gewerken (Trockenbau-Aussparungen, Möbel-Anschlüsse). Die Koordinationsarbeit gegenüber Standardausführung wird routinemäßig dabei gemacht, ohne separate Position.`,
    ],
  }),
  buildEnriched({
    tradePath: "elektriker",
    nameSlug: "jordine",
    companyName: "ELEKTRO Jordine GBP GmbH",
    gfFirstName: "Kevin",
    gfLastName: "Gohlke",
    city: "Mannheim",
    employeeCount: 10,
    projectReference: "euren KNX-zertifizierten Innungsbetrieb in Mannheim-Friedrichsfeld mit Schwerpunkten Smart Home (HomeMatic, KNX), Wallbox-Installation und Photovoltaik",
    painBullets: [
      `KNX und HomeMatic parallel anbieten heißt: Kunden vermischen die Systeme oder wechseln mid-Projekt. Die zusätzliche Programmierung und Abstimmung wird als kleine Anpassung gehandhabt, statt als echte Mehrleistung kalkuliert.`,
      `Wallbox-Installation klingt einfach, ist aber von Lastmanagement, Zähler-Konzept und Netzbetreiber-Anmeldung abhängig. Erweiterungen während der Installation (zweite Wallbox, PV-Kopplung) werden im Pauschalpreis nie sauber abgegrenzt.`,
      `Photovoltaik mit Speicher: jede Komponente hat eigene Liefer- und Förder-Zyklen. Wenn der Bauherr mid-Projekt die Speichergröße anpasst, verschiebt sich die gesamte Kalkulation, ohne dass die Mehrleistung dokumentiert wird.`,
    ],
  }),

  // ----- Bodenleger (4) -----
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "hsh-boden",
    companyName: "HSH Handwerkerservice Heidelberg",
    gfFirstName: "Johann",
    gfLastName: "Gardt",
    city: "Sandhausen",
    employeeCount: 8,
    projectReference: "euren Bodenleger-Service im Raum Heidelberg, Wiesloch, Walldorf, Leimen mit Fokus auf Laminat, Parkett, Vinyl und Teppich",
    painBullets: [
      `Vier Bodenarten parallel anbieten heißt: Kunden wechseln mid-Beratung das gewünschte Material. Aufmaß und Untergrundvorbereitung mussten oft neu gerechnet werden, ohne dass die Vor-Beratung abgerechnet wird.`,
      `Untergrundprobleme bei Bestandsböden (Feuchte, Estrich-Risse, Höhenunterschiede) werden erst beim Aufmaß erkannt. Die Nachbehandlung ist nirgends kalkuliert, weil das Original-Angebot vom planmäßigen Untergrund ausging.`,
      `Sockelleisten und Übergangsschienen bei Mehrraum-Projekten: bei jedem Türübergang andere Höhen oder Materialien. Das Drumherum wird routinemäßig dabei gemacht, ohne separate Kalkulation.`,
    ],
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "mch-boden",
    companyName: "MCH Bodendesign",
    city: "Eberbach",
    employeeCount: 8,
    projectReference: "eure über 250 abgeschlossenen Projekte und Spezialisierung auf Vinyl, PVC, Linoleum, Kautschuk, Teppich und Industriebeschichtungen",
    painBullets: [
      `Industriebeschichtungen erfordern exakte Untergrundvorbereitung (Strahlen, Grundieren, Spachtelung). Wenn der Bauherr mid-Projekt die Belastungsklasse anpasst, ändert sich der gesamte Aufbau, ohne dass die Mehrleistung erfasst wird.`,
      `Kautschuk- und Linoleum-Verlegung in Schulen oder Pflegeeinrichtungen: jede Pflegeklasse hat eigene Materialanforderungen. Wenn der Auftraggeber während der Bauphase die Pflegeklasse ändert, ist das eine echte Mehrleistung, die selten dokumentiert wird.`,
      `Mit 250+ abgeschlossenen Projekten habt ihr Routine: Standardabläufe laufen schnell. Genau dadurch werden Sondermehrleistungen (komplexe Kanten, Aussparungen, Folge-Aufträge per Mail) leicht im Tagesgeschäft übersehen.`,
    ],
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "asm-raum",
    companyName: "ASM Raumausstatter GmbH",
    city: "Mannheim",
    employeeCount: 8,
    projectReference: "eure Spezialität Fischgrät-Verlegung sowie individuelle Wandgestaltung und Verputztechniken in Mannheim-Käfertal",
    painBullets: [
      `Fischgrät-Verlegung ist deutlich aufwändiger als Standardverlegung. Wenn der Bauherr mid-Projekt das Verlegemuster ändert (von Englisch zu Französisch zum Beispiel), ist das eine echte Mehrleistung, die selten als Nachtrag gestellt wird.`,
      `Individuelle Wandgestaltung mit Spezial-Verputztechniken erfordert Bemusterung. Wenn der Kunde nach der ersten Probefläche andere Strukturen will, geht die Mehrarbeit als Beratungsleistung durch und wird nicht abgerechnet.`,
      `Boden plus Wand kombiniert anbieten heißt: Schnittstellen werden intern gelöst. Die Sondervarianten (Sockel-Anschluss, Wand-Boden-Übergang bei Designwänden) werden routinemäßig dabei gemacht, ohne separate Position.`,
    ],
  }),
  buildEnriched({
    tradePath: "bodenleger",
    nameSlug: "parkettdesign-bs",
    companyName: "Parkettdesign Bergstraße",
    gfFirstName: "Denny",
    gfLastName: "Urlaß",
    city: "Bensheim",
    employeeCount: 6,
    projectReference: "eure Spezialisierung als Parkettlegermeister auf Parkett, Designestrich und Treppen mit Markenpartnerschaften zu Mafi, Scheucher, Meister und Hinterseer",
    painBullets: [
      `Designestrich erfordert Abstimmung mit anderen Gewerken (Heizung, Bodenleger danach). Wenn der GU mid-Projekt die Estrich-Stärke ändert, hat das Folgekosten für eure Parkett-Verlegung, die selten als Mehrleistung erfasst werden.`,
      `Treppen-Belag mit Parkett ist hochpreisig und detail-intensiv. Jede Stufe ist anders, jede Ecke ein individuelles Maß. Wenn der Kunde mid-Projekt eine andere Holzart oder Verlegerichtung wählt, fehlt die Kalkulationslogik dafür.`,
      `Mit 6 Mitarbeitern und Premium-Markenpartnerschaften (Mafi, Scheucher) ist eure Marge eng. Jede nicht erfasste Mehrleistung schlägt direkt durch, weil der Materialeinkauf bereits hochpreisig ist.`,
    ],
  }),

  // ----- Maler (3) -----
  buildEnriched({
    tradePath: "maler",
    nameSlug: "coloris",
    companyName: "Coloris Maler- und Ausbauwerkstätten GmbH",
    gfFirstName: "Thomas",
    gfLastName: "Bienroth",
    city: "Mannheim",
    employeeCount: 20,
    projectReference: "eure Spezialisierung auf Sanierungsarbeiten mit Fokus Brand- und Wasserschadensanierung, Fassade, Betonsanierung und energetische Modernisierung",
    painBullets: [
      `Brand- und Wasserschadensanierung beginnt mit unklarem Schadensbild. Was als 50-qm-Sanierung beginnt, wächst nach dem ersten Aufmaß zu 150 qm. Diese Erweiterungen werden mit der Versicherung verhandelt, aber selten als formaler Nachtrag dokumentiert.`,
      `Energetische Fassadenmodernisierung kollidiert mit Bestand: alte Putzschichten, Risse, Hohlstellen werden erst beim Abklopfen sichtbar. Die Sanierungs-Mehrleistung wird als kleine Anpassung gehandhabt, statt als separate Leistungsposition kalkuliert.`,
      `Betonsanierung erfordert Material-Tests und Trocknungsphasen. Verzögerungen durch Witterung oder Materialwartezeiten werden als Puffer eingeplant, statt als terminliche Mehrleistung erfasst.`,
    ],
  }),
  buildEnriched({
    tradePath: "maler",
    nameSlug: "maler-eck",
    companyName: "Karl Eck GmbH",
    gfFirstName: "Sebastian",
    gfLastName: "Eck",
    city: "Dossenheim",
    employeeCount: 30,
    projectReference: "euren Familienbetrieb seit 1905 mit über 30 Spezialisten und aktiver Förderung von Frauen im Handwerk inklusive weiblicher Malermeister",
    painBullets: [
      `Mit 30 Mitarbeitern und mehreren parallel laufenden Baustellen verliert man schnell den Überblick, welche Mail-Anweisungen tatsächlich abgerechnet wurden. Mehrleistungen pro Projekt summieren sich zu fünfstelligen Beträgen, die keiner systematisch zuordnet.`,
      `Familienbetrieb seit 1905 heißt: viele Bestandskunden, viele Aufträge per Telefon und Mail ohne formales LV. Genau diese vertrauensbasierten Aufträge entwickeln sich oft zu größeren Projekten, ohne dass die Erweiterungen sauber dokumentiert werden.`,
      `Tapezier- und Streich-Kombi in einem Raum, der nur als Streichen bestellt war: diese Mehrleistungen schlüpfen durch, weil keiner alle Räume mit dem Original-LV abgleicht. Bei 30 Mitarbeitern auf 10 Baustellen passiert das pro Monat mehrfach.`,
    ],
  }),
  buildEnriched({
    tradePath: "maler",
    nameSlug: "weisbrod",
    companyName: "Malerfachbetrieb Weisbrod GmbH",
    gfFirstName: "Frank",
    gfLastName: "Weisbrod",
    city: "Wiesloch",
    employeeCount: 12,
    projectReference: "euren Familienbetrieb in dritter Generation seit 1929 mit Spezialität fugenlose Oberflächen, Designwände und allergenfreie Materialoptionen",
    painBullets: [
      `Fugenlose Oberflächen (Spachtel-Stuck, Beton-Cire, mineralische Putze) sind detail- und beratungsintensiv. Bemusterungen werden mehrfach geändert, jede Iteration kostet Stunden, die selten abgerechnet werden.`,
      `Designwände erfordern Abstimmung mit Architekt und Lichtplaner: die Wirkung der Oberfläche hängt von Lichteinfall ab. Anpassungen an der Struktur nach erster Ausführung werden routinemäßig dabei gemacht, ohne separate Position.`,
      `Allergenfreie Materialoptionen haben längere Lieferzeiten und höhere Materialpreise. Wenn ein Kunde mid-Projekt auf allergenfrei wechselt, ist das eine echte Mehrleistung, die als kleine Materialumstellung gehandhabt wird.`,
    ],
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
