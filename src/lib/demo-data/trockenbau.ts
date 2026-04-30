// Synthetic Trockenbau LV + email batch for the NachtragsAgent live demo.
// Realistic-looking sample with one clear Nachtrag, two borderline, four clean.

export const TROCKENBAU_LV_TEXT = `
LEISTUNGSVERZEICHNIS - TROCKENBAU
Bauvorhaben: Bürobau Augustaanlage 32, Mannheim
Auftraggeber: Schmitt & Partner GU GmbH
Auftragnehmer: [Mustermann Trockenbau GmbH]
Auftragssumme netto: 142.500,00 EUR

Pos. 01 - Trennwände GK F30, doppelt beplankt, gespachtelt Q2
            Menge: 480 m² · EP: 78,00 EUR · GP: 37.440,00 EUR

Pos. 02 - Akustikdecken abgehängt, Mineralfaserplatten 600x600
            Menge: 620 m² · EP: 62,00 EUR · GP: 38.440,00 EUR

Pos. 03 - Vorsatzschalen WC-Bereich, einfach beplankt, Q2
            Menge: 95 m² · EP: 54,00 EUR · GP: 5.130,00 EUR

Pos. 04 - Schachtwände inkl. Brandschutz F90
            Menge: 130 m² · EP: 92,00 EUR · GP: 11.960,00 EUR

Pos. 05 - Spachtelarbeiten Q3 für Sichtbeton-Anschluss Foyer
            Menge: 48 m² · EP: 35,00 EUR · GP: 1.680,00 EUR

Pos. 06 - Türzargen einbauen (Stahl-Umfassungszargen, Standard)
            Menge: 24 Stk · EP: 145,00 EUR · GP: 3.480,00 EUR

Ausschluss laut LV-Vorbemerkungen:
- Stahltüren-Sondermaße (>2,30 m Höhe) sind NICHT enthalten.
- Schallschutz-Anforderungen >Rw 47 dB sind NICHT enthalten.
- Schnittstellenkoordination zu HLS, Sprinkler und Elektro sind NICHT enthalten.
- Streichen / Tapezieren / Oberflächenbehandlung außerhalb Spachtel-Q2 sind NICHT enthalten.
`.trim();

export interface TrockenbauEmail {
  id: string;
  date: string;
  from: string;
  to: string;
  subject: string;
  body: string;
}

export const TROCKENBAU_EMAILS: TrockenbauEmail[] = [
  {
    id: "email-001",
    date: "2026-03-04",
    from: "j.weber@schmitt-gu.de",
    to: "buero@mustermann-trockenbau.de",
    subject: "Aufmaß Trennwände 2. OG",
    body: `Hallo Herr Müller,

bitte das Aufmaß der Trennwände im 2. OG bis Freitag.
Sind die Q2-Spachtelarbeiten an Pos. 1 wie geplant abgeschlossen?

Gruß
J. Weber, Bauleitung GU`,
  },
  {
    id: "email-002",
    date: "2026-03-11",
    from: "j.weber@schmitt-gu.de",
    to: "buero@mustermann-trockenbau.de",
    subject: "Re: Vinyl-Forum, kurze Frage",
    body: `Hallo Herr Müller,

können Sie im Foyer zusätzlich noch die Stahltür-Umfassung
(Tür T-12, Höhe 2,75 m, Sondermaß) mit GK-Anschluss einkleiden?
Bauherr hat heute morgen umgeplant. Dringt zeitlich.

Wäre super wenn das diese Woche noch ginge.

Gruß
J. Weber`,
  },
  {
    id: "email-003",
    date: "2026-03-12",
    from: "buero@mustermann-trockenbau.de",
    to: "j.weber@schmitt-gu.de",
    subject: "Re: Re: Vinyl-Forum, kurze Frage",
    body: `Hallo Herr Weber,

okay, machen wir. Mein Polier ist morgen vor Ort.

Gruß
S. Müller`,
  },
  {
    id: "email-004",
    date: "2026-03-15",
    from: "k.hoffmann@schmitt-gu.de",
    to: "buero@mustermann-trockenbau.de",
    subject: "Behinderungsanzeige Vorgewerk Estrich",
    body: `Sehr geehrter Herr Müller,

die Estricharbeiten im 1. OG haben sich um 5 Werktage verzögert.
Bitte planen Sie Ihre Mannschaft entsprechend um.

Mit freundlichen Grüßen
K. Hoffmann`,
  },
  {
    id: "email-005",
    date: "2026-03-19",
    from: "j.weber@schmitt-gu.de",
    to: "buero@mustermann-trockenbau.de",
    subject: "Akustikdecken Konferenzraum 4.OG - Anforderung",
    body: `Hallo Herr Müller,

der Bauherr verlangt für den Konferenzraum 4.OG eine Schallschutzklasse
von Rw 50 dB statt der ausgeschriebenen 44 dB. Können Sie das umsetzen?
Bitte kurz Rückmeldung.

J. Weber`,
  },
  {
    id: "email-006",
    date: "2026-03-22",
    from: "j.weber@schmitt-gu.de",
    to: "buero@mustermann-trockenbau.de",
    subject: "Q2 Spachtelung 3. OG fertig?",
    body: `Hi,

Status Q2 im 3. OG? Maler will Donnerstag rein.

Gruß J.W.`,
  },
  {
    id: "email-007",
    date: "2026-03-25",
    from: "buero@mustermann-trockenbau.de",
    to: "j.weber@schmitt-gu.de",
    subject: "Re: Q2 Spachtelung 3. OG fertig?",
    body: `Hallo Herr Weber,

Q2 im 3. OG ist seit gestern fertig. Schlüsselübergabe an Maler kann erfolgen.

Gruß
S. Müller`,
  },
];
