// Content model for the per-trade Rebelz AI explainer pages at /handwerk/[gewerk].
// One page component renders any Gewerk from this data. No fabricated numbers,
// no fake testimonials. Clarence's real claim (11 Jahre Bauleiter, Hochbau bis
// 100 Mio.) is the only credential used.

export const BRAND = {
  primary: "#009966",
  primaryDark: "#007a52",
  calendly: "https://calendly.com/clarencejohnson/rebelz-ai-schlachtplan-gesprach",
  phone: "+49 151 5773 1682",
  phoneHref: "tel:+4915157731682",
  site: "www.rebelzai.com",
};

export interface Gewerk {
  slug: string;
  label: string; // page H1 trade name, e.g. "Trockenbau & Innenausbau"
  verbPlural: string; // "Trockenbauer"
  heroHeadline: string;
  heroSub: string;
  painPoints: { title: string; body: string }[];
  // which trade-slugs from the lead list map onto this page
  leadTrades: string[];
}

export const GEWERKE: Record<string, Gewerk> = {
  trockenbau: {
    slug: "trockenbau",
    label: "Trockenbau & Innenausbau",
    verbPlural: "Trockenbauer",
    heroHeadline: "Jede Mehrleistung abgerechnet. Jede Stunde belegt. Ohne Diskussion mit der Bauleitung.",
    heroSub:
      "Q-Klassen-Wechsel mitten im Projekt, F30 wird zu F90, der Bauherr ändert die Decke zum dritten Mal. Ihr macht es mit, aber abgerechnet wird es selten. Wir bauen euch die Prozesse, die jede Änderung automatisch festhalten.",
    painPoints: [
      {
        title: "Mehrleistungen verschwinden im Pauschalpreis",
        body: "Die nachträglich gespachtelte Q3-Fläche, die zusätzliche Revisionsklappe, der Umbau nach Planänderung. Mündlich zugesagt, nie sauber dokumentiert, am Monatsende nicht in der Rechnung.",
      },
      {
        title: "Schnittstellen zu Maler und Elektrik kosten Stunden",
        body: "Wer war zuerst dran, wer hat was beschädigt, wann war die Fläche frei. Diese Klärung läuft über Anrufe und Zuruf, nichts davon ist später nachweisbar.",
      },
      {
        title: "Aufmaß nach Baufortschritt ist Handarbeit",
        body: "Laufende Meter Ständerwerk, Quadratmeter Beplankung, Stück Eckschutz. Auf Zetteln notiert, abends abgetippt, fehleranfällig.",
      },
    ],
    leadTrades: ["trockenbauer", "stuckateur", "innenausbau", "estrich"],
  },
  elektro: {
    slug: "elektro",
    label: "Elektrotechnik & Smart Home",
    verbPlural: "Elektriker",
    heroHeadline: "Vom E-Check zur Sanierung, von KNX zur fünften Iteration. Alles abgerechnet, nichts vergessen.",
    heroSub:
      "Jede Programmier-Schleife, jede zusätzliche Dose, jeder Verteiler, der mitten im Altbau plötzlich woanders sitzt. Wir bauen euch die Prozesse, die diese Mehrleistungen automatisch erfassen, bevor sie im Tagesgeschäft untergehen.",
    painPoints: [
      {
        title: "Programmier-Iterationen werden nicht bezahlt",
        body: "Der Architekt ändert die KNX-Szenen nach der Inbetriebnahme zum vierten Mal. Jede Iteration kostet Stunden, gilt aber als kleine Anpassung und landet nie auf einer Rechnung.",
      },
      {
        title: "Förder- und Doku-Bürokratie frisst die Marge",
        body: "Wallbox, PV, Speicher: drei Komponenten, drei Förder-Zyklen, Netzbetreiber-Anmeldung. Stunden an Papierkram pro Auftrag, bevor das erste Kabel liegt.",
      },
      {
        title: "Altbau-Überraschungen ändern den ganzen Auftrag",
        body: "Hinter jeder Wand eine andere Lage. Verteiler wandert, Trasse muss um den Bestand. Entschieden wird per Telefon, dokumentiert fast nie.",
      },
    ],
    leadTrades: ["elektriker"],
  },
  shk: {
    slug: "shk",
    label: "Sanitär, Heizung & Klima",
    verbPlural: "SHK-Betriebe",
    heroHeadline: "Wärmepumpe, Bad, Heizungstausch. Jede Anpassung mitten im Projekt sauber belegt.",
    heroSub:
      "Lastmanagement wird angepasst, der Kunde wechselt die Armatur, das alte Rohr ist maroder als gedacht. Ihr löst es auf der Baustelle, wir sorgen dafür, dass es auch auf der Rechnung steht.",
    painPoints: [
      {
        title: "Mehrleistung verschwindet im 'ist doch alles wir'",
        body: "Elektro plus Sanitär plus Heizung in einer Hand. Schnittstellen werden intern gelöst, die Zusatzstunden im Pauschalpreis verschluckt.",
      },
      {
        title: "Heizungsgesetz und Förderung heißt Doku ohne Ende",
        body: "Jeder geförderte Tausch braucht Nachweise, Fotos, Protokolle. Sammelt heute jeder Monteur anders, geht halb verloren.",
      },
      {
        title: "Notdienst und Folgeauftrag laufen unstrukturiert",
        body: "Aus der schnellen Reparatur wird die Sanierung. Der Übergang wird mündlich vereinbart, die Leistung nie sauber aufgenommen.",
      },
    ],
    leadTrades: ["shk"],
  },
  boden: {
    slug: "boden",
    label: "Bodenleger & Fliesen",
    verbPlural: "Bodenleger",
    heroHeadline: "Parkett bis Vinyl, Fischgrät bis Industriebeschichtung. Jeder Muster-Wechsel landet in der Abrechnung.",
    heroSub:
      "Der Bauherr wechselt mitten im Projekt das Verlegemuster, die Belastungsklasse, die Holzart. Aufmaß muss neu, Untergrund anders kalkuliert. Wir bauen euch die Prozesse, die jede Änderung automatisch erfassen.",
    painPoints: [
      {
        title: "Aufmaß und Verschnitt sind reine Handarbeit",
        body: "Quadratmeter, Sockelleisten, Verschnitt nach Verlegerichtung. Auf der Baustelle notiert, abends gerechnet, beim Fischgrät-Muster regelmäßig daneben.",
      },
      {
        title: "Material- und Muster-Wechsel kosten unbezahlte Beratung",
        body: "Vier Beläge zur Auswahl, der Kunde wechselt zweimal. Jede Runde Beratung, neues Aufmaß, neue Kalkulation. Abgerechnet wird am Ende nur der Boden.",
      },
      {
        title: "Untergrund-Überraschungen ändern den Aufbau",
        body: "Estrich zu feucht, Altbelag fester als gedacht. Mehraufwand für Vorbereitung, mündlich abgenickt, selten als Nachtrag erfasst.",
      },
    ],
    leadTrades: ["bodenleger", "fliesenleger"],
  },
  maler: {
    slug: "maler",
    label: "Maler & Lackierer",
    verbPlural: "Maler",
    heroHeadline: "Bemusterung in der fünften Runde, Schaden größer als gedacht. Jede Zusatzstunde belegt.",
    heroSub:
      "Aus 50 Quadratmeter Wasserschaden werden 150. Die fugenlose Oberfläche wird dreimal neu bemustert. Ihr macht die Arbeit, wir sorgen dafür, dass die Mehrleistung dokumentiert und abgerechnet wird.",
    painPoints: [
      {
        title: "Bemusterungs-Schleifen werden nie bezahlt",
        body: "Spachteltechnik, Effektputz, Farbton. Jede Iteration kostet Material und Zeit, gilt aber als Service und landet nicht auf der Rechnung.",
      },
      {
        title: "Sanierungs-Doku für Versicherungen frisst Stunden",
        body: "Brand- und Wasserschaden heißt: Fotos, Aufmaß-Anpassung, Schadensbericht. Pro Projekt Stunden an Verwaltung, oft unter Zeitdruck zusammengesucht.",
      },
      {
        title: "Der Auftrag wächst, das Aufmaß bleibt alt",
        body: "Was als ein Raum beginnt, wird zur ganzen Etage. Die zusätzliche Fläche wird gestrichen, aber das ursprüngliche Aufmaß nie nachgezogen.",
      },
    ],
    leadTrades: ["maler"],
  },
  rohbau: {
    slug: "rohbau",
    label: "Rohbau & Zimmerei",
    verbPlural: "Bauunternehmen",
    heroHeadline: "Erschwernis, Bauzeitverzögerung, Planänderung. Jede Stunde nachweisbar, jeder Nachtrag begründet.",
    heroSub:
      "Bodengutachten stimmt nicht, der Bauherr ändert die Statik, das Wetter kostet Wochen. Wir bauen euch die Prozesse, die Behinderungsanzeigen und Nachträge sauber und fristgerecht dokumentieren.",
    painPoints: [
      {
        title: "Behinderungsanzeigen kommen zu spät oder gar nicht",
        body: "Wer am Bau steht, schreibt keine fristgerechte Anzeige. Später fehlt der Nachweis und die Mehrkosten bleiben bei euch hängen.",
      },
      {
        title: "Stunden auf der Baustelle landen verspätet im Büro",
        body: "Poliere notieren auf Zetteln, das Büro tippt Tage später ab. Bis dahin weiß keiner mehr genau, wer wo wie lange war.",
      },
      {
        title: "Nachträge nach VOB sind aufwendig zu begründen",
        body: "Jeder Nachtrag braucht Bezug zum LV, Mengen, Begründung. Diese Arbeit macht abends der Chef, oft unvollständig.",
      },
    ],
    leadTrades: ["bauunternehmen", "zimmerei", "dachdecker"],
  },
  bautraeger: {
    slug: "bautraeger",
    label: "Bauträger & Generalunternehmer",
    verbPlural: "Bauträger",
    heroHeadline: "Zehn Gewerke, ein Termin, kein Überblick. Wir bündeln Stundenzettel, Nachträge und Doku an einer Stelle.",
    heroSub:
      "Sonderwünsche der Käufer, Gewerke, die aufeinander warten, Nachunternehmer mit eigenem Papierkram. Wir bauen euch die Prozesse, die alle Fäden zusammenführen, ohne dass ihr in Mails ertrinkt.",
    painPoints: [
      {
        title: "Käufer-Sonderwünsche sind ein Abrechnungs-Chaos",
        body: "Jede Wohnung anders, jeder Wunsch ein eigener Nachtrag an ein anderes Gewerk. Der Überblick, was bestellt, gebaut und berechnet ist, geht verloren.",
      },
      {
        title: "Nachunternehmer-Koordination läuft über Zuruf",
        body: "Wer ist fertig, wer wartet, wer hat Verzug. Status über Telefon eingesammelt, nichts davon dokumentiert.",
      },
      {
        title: "Gewährleistung und Doku sind unvollständig",
        body: "Wenn Jahre später ein Mangel auftaucht, fehlt die lückenlose Bau- und Abnahme-Doku. Das wird teuer.",
      },
    ],
    leadTrades: ["bautraeger", "galabau"],
  },
};

// The five solution stories shown on EVERY Gewerk page, in order.
// "stundenzettel" is the flagship (WhatsApp voice note story).
export const STORIES = {
  stundenzettel: {
    kicker: "Der Klassiker",
    title: "Stundenzettel ohne Diskussion. Auch wenn der Mann kein Deutsch spricht.",
    lead:
      "Dein Mitarbeiter steht auf der Baustelle und spricht kein Deutsch. Heute heißt das: Zettel verloren, Stunden geschätzt, am Freitag Diskussion mit dem Bauleiter, wer wann da war. Mit unserem Prozess schickt er einfach eine Sprachnachricht per WhatsApp, in seiner Sprache.",
    // chat steps for the visual
    chat: [
      { from: "worker", text: "🎤 Sprachnachricht (0:14)", note: "auf Türkisch, Polnisch, Rumänisch, egal" },
      { from: "system", text: "Verstanden: Mo, Baustelle Lindenhof, 7:00 bis 15:30, Trockenbau OG2, plus 1h Materialfahrt." },
      { from: "system", text: "Stundenzettel erstellt und an den Chef geschickt. ✅" },
    ],
    outcome:
      "Aus der Sprachnachricht wird automatisch ein sauberer Stundenzettel: Datum, Baustelle, Zeiten, Tätigkeit. Direkt beim Firmeneigentümer im Postfach, fertig zur Abrechnung. Keine Zettel mehr, keine Schätzungen, keine Freitags-Diskussion.",
  },
  aufmass: {
    kicker: "Das Nerv-Thema",
    title: "Aufmaß automatisch und fehlerfrei.",
    lead:
      "Aufmaß ist für die meisten Betriebe der größte Zeitfresser und die häufigste Fehlerquelle. Falsch gemessen heißt falsch kalkuliert, und am Ende fehlt das Geld. Wir verbinden eure Aufmaß-Erfassung mit Tools, die die Mengen direkt sauber rechnen und in die Kalkulation übergeben.",
    bullets: [
      "Erfassung direkt auf der Baustelle, ohne abends abtippen",
      "Mengen, Verschnitt und Zuschläge werden automatisch gerechnet",
      "Direkt anschlussfähig an euer Angebot und die Rechnung",
      "Nachträgliches Aufmaß nach Bauänderung wird mitgeführt, nicht vergessen",
    ],
  },
  nachtraege: {
    kicker: "Das Geld, das liegen bleibt",
    title: "Nachträge, die nicht untergehen.",
    lead:
      "Jede Mehrleistung, die ihr mündlich zusagt und nie sauber festhaltet, ist verschenktes Geld. Unser Prozess erkennt aus der laufenden Kommunikation, was eine Mehrleistung ist, und erstellt den Nachtrag mit fertigem Begründungstext, bezogen auf euer Leistungsverzeichnis.",
    bullets: [
      "Mehrleistungen werden erkannt, sobald sie besprochen werden",
      "Nachtrag mit Begründung, fertig zum Senden an den Auftraggeber",
      "Bezug zum LV und zu den Mengen wird automatisch hergestellt",
      "Wöchentliche Übersicht, was offen ist und abgerechnet werden kann",
    ],
  },
  termine: {
    kicker: "Weniger Telefonieren",
    title: "Termine und Mitarbeiter-Koordination an einem Ort.",
    lead:
      "Wer ist auf welcher Baustelle, welches Gewerk wartet auf wen, was verschiebt sich. Statt diese Fragen den ganzen Tag am Telefon zu klären, laufen sie über einen Ort zusammen, auf den dein Team Zugriff hat.",
    bullets: [
      "Klarer Überblick, wer wann auf welcher Baustelle ist",
      "Verschiebungen werden ans Team weitergegeben, ohne Telefonkette",
      "Schnittstellen zwischen Gewerken werden sichtbar, bevor sie kollidieren",
    ],
  },
  doku: {
    kicker: "Der Rücken-frei-Faktor",
    title: "Dokumentation, die im Streitfall hält.",
    lead:
      "Wenn der Auftraggeber später etwas bestreitet oder Jahre nach Abnahme ein Mangel auftaucht, entscheidet die Doku. Wir sorgen dafür, dass Fotos, Stunden, Änderungen und Abnahmen lückenlos und auffindbar festgehalten werden, ohne dass jemand abends Ordner pflegt.",
    bullets: [
      "Baustellen-Fotos und Notizen automatisch dem Projekt zugeordnet",
      "Lückenlose Historie von Änderungen und Zusagen",
      "Im Streitfall in Minuten auffindbar statt in Aktenbergen",
    ],
  },
};

export const ABLAUF = [
  {
    step: "01",
    title: "Kennenlern-Gespräch, 30 Minuten",
    body: "Wir schauen uns euren konkreten Ablauf an: Wo geht heute Zeit und Geld verloren. Kein Verkaufsgespräch, sondern eine ehrliche Einschätzung, ob sich KI bei euch lohnt.",
  },
  {
    step: "02",
    title: "Wir bauen einen Prozess, nicht zehn",
    body: "Wir fangen an einer Stelle an, die bei euch am meisten weh tut, meistens Stundenzettel oder Aufmaß. Kein Umbau eurer ganzen IT, kein Zwang, eure Tools zu wechseln.",
  },
  {
    step: "03",
    title: "Test mit echten Projekten",
    body: "Wir laufen parallel zu eurem normalen Ablauf. Ihr seht an euren echten Baustellen, ob es trägt, bevor ihr euch festlegt.",
  },
  {
    step: "04",
    title: "Ihr entscheidet nach Zahlen",
    body: "Wir schauen gemeinsam, was der Prozess gebracht hat, in Euro und in gesparten Stunden. Läuft es nicht, läuft es nicht. Kein Lock-in.",
  },
];
