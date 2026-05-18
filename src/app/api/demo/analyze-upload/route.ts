import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
}

// Vercel Hobby/Pro default body limit is ~4.5 MB. This caps to that.
const MAX_BYTES = Math.floor(4.5 * 1024 * 1024);
// Truncate extracted text to fit gpt-4o-mini context safely.
// ~50K chars ≈ ~12K tokens. Both LV and emails get this budget independently.
const MAX_TEXT_PER_DOC = 50_000;

const SYSTEM_PROMPT = `Du bist NachtragsAgent, ein KI-Assistent für deutsche Bauunternehmer (Nachunternehmer/Subunternehmer im Hochbau).

Deine Aufgabe: Lies das übergebene Leistungsverzeichnis (LV) und die E-Mail-Korrespondenz zwischen Generalunternehmer (GU) und Nachunternehmer. Identifiziere:

1. Klare Nachträge (Mehrleistungen): Eindeutige Anweisungen vom GU, die NICHT im Vertragsumfang des LV enthalten sind. Schätze einen plausiblen Eurobetrag.
2. Grenzwertige Vorgänge: Mails, die möglicherweise eine Mehrleistung implizieren, aber unklar formuliert sind.
3. Zähle saubere Vorgänge (klar im Vertragsumfang).

Für jeden klaren Nachtrag liefere einen FERTIGEN, professionellen deutschen Begründungstext (Sie-Form, formell, knapp, mit Verweis auf Vertrag/LV-Pos. und Mail-Datum), den der Bauunternehmer direkt an den GU senden kann.

Antworte AUSSCHLIESSLICH als gültiges JSON in diesem Format:

{
  "clearNachtraege": [
    {
      "value": <number, geschätzter EUR-Betrag>,
      "currency": "EUR",
      "source": "<Mail-Datum + Betreff>",
      "begruendung": "<Fertiger Begründungstext, 80-150 Wörter, Sie-Form>"
    }
  ],
  "borderlineCases": [
    {
      "description": "<1 Satz, was der grenzwertige Vorgang ist>",
      "source": "<Mail-Datum + Betreff>",
      "recommendation": "<1 Satz Empfehlung>"
    }
  ],
  "cleanItems": <number>
}

Wichtig: Sei realistisch und konservativ, keine erfundenen Beträge. Stütze dich nur auf das, was in den Texten steht. Falls die Texte unklar oder unvollständig sind, gib lieber weniger Nachträge mit hoher Sicherheit zurück als viele unsichere.`;

async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse v2 is class-based; expects Uint8Array data.
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text ?? "";
  } finally {
    await parser.destroy().catch(() => {});
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json(
        { error: "Multipart/form-data required" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const lvFile = formData.get("lv");
    const emailsFile = formData.get("emails");
    const companyName = String(formData.get("companyName") ?? "Mustermann GmbH");

    if (!(lvFile instanceof File) || !(emailsFile instanceof File)) {
      return Response.json(
        { error: "Felder 'lv' und 'emails' (PDFs) sind erforderlich" },
        { status: 400 },
      );
    }

    if (lvFile.type !== "application/pdf" || emailsFile.type !== "application/pdf") {
      return Response.json(
        { error: "Nur PDF-Dateien erlaubt" },
        { status: 400 },
      );
    }

    if (lvFile.size > MAX_BYTES || emailsFile.size > MAX_BYTES) {
      return Response.json(
        {
          error: `Datei zu groß. Maximal 4,5 MB pro PDF.`,
        },
        { status: 413 },
      );
    }

    const lvBuffer = Buffer.from(await lvFile.arrayBuffer());
    const emailsBuffer = Buffer.from(await emailsFile.arrayBuffer());

    let lvText: string;
    let emailsText: string;
    try {
      [lvText, emailsText] = await Promise.all([
        extractPdfText(lvBuffer),
        extractPdfText(emailsBuffer),
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "PDF konnte nicht gelesen werden";
      return Response.json(
        {
          error: `PDF-Parsing fehlgeschlagen: ${msg}. Falls die PDFs gescannt sind (kein Text erkennbar), bitte als Text-PDF exportieren.`,
        },
        { status: 422 },
      );
    }

    if (!lvText.trim() || !emailsText.trim()) {
      return Response.json(
        {
          error:
            "Eines der PDFs enthält keinen lesbaren Text. Vermutlich ein gescanntes PDF. Bitte als Text-PDF aus Word/Excel exportieren.",
        },
        { status: 422 },
      );
    }

    const lvTruncated = lvText.slice(0, MAX_TEXT_PER_DOC);
    const emailsTruncated = emailsText.slice(0, MAX_TEXT_PER_DOC);

    const lvWasTruncated = lvText.length > MAX_TEXT_PER_DOC;
    const emailsWasTruncated = emailsText.length > MAX_TEXT_PER_DOC;

    const userMessage = `Firma: ${companyName}

LEISTUNGSVERZEICHNIS${lvWasTruncated ? " (Auszug, gekürzt für die Demo-Analyse)" : ""}:
${lvTruncated}

E-MAIL-KORRESPONDENZ${emailsWasTruncated ? " (Auszug, gekürzt für die Demo-Analyse)" : ""}:
${emailsTruncated}

Bitte analysiere und antworte als JSON gemäß Anweisung.`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return Response.json(
        { error: "Keine Antwort vom Modell" },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(content);
    return Response.json({
      ...parsed,
      meta: {
        lvCharsAnalyzed: lvTruncated.length,
        emailsCharsAnalyzed: emailsTruncated.length,
        lvTruncated: lvWasTruncated,
        emailsTruncated: emailsWasTruncated,
      },
    });
  } catch (error) {
    console.error("[/api/demo/analyze-upload] error:", error);
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return Response.json({ error: message }, { status: 500 });
  }
}
