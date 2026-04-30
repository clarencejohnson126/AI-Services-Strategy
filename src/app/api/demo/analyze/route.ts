import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getDemoDataForTrade } from "@/lib/demo-data";
import type { Trade } from "@/lib/trades";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Du bist NachtragsAgent - ein KI-Assistent für deutsche Bauunternehmer (Nachunternehmer/Subunternehmer im Hochbau).

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

Sei realistisch und konservativ - keine erfundenen Beträge. Stütze dich nur auf das, was in den Mails steht.`;

export async function POST(request: NextRequest) {
  try {
    const { trade, companyName } = (await request.json()) as {
      trade: Trade;
      companyName: string;
    };

    if (!trade) {
      return Response.json(
        { error: "trade is required" },
        { status: 400 },
      );
    }

    const data = getDemoDataForTrade(trade);

    const userMessage = `Firma: ${companyName ?? "Mustermann GmbH"}
Gewerk: ${trade}

LEISTUNGSVERZEICHNIS:
${data.lvText}

E-MAIL-KORRESPONDENZ (chronologisch):
${data.emails
  .map(
    (e) =>
      `--- Mail ID: ${e.id} ---
Datum: ${e.date}
Von: ${e.from}
An: ${e.to}
Betreff: ${e.subject}

${e.body}
`,
  )
  .join("\n")}

Bitte analysiere und antworte als JSON gemäß Anweisung.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return Response.json(
        { error: "No content from model" },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(content);
    return Response.json(parsed);
  } catch (error) {
    console.error("[/api/demo/analyze] error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
