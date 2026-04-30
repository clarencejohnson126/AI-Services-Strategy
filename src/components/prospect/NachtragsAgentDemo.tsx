"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Prospect } from "@/lib/prospects";

interface AnalyzeResponse {
  clearNachtraege: Array<{
    value: number;
    currency: string;
    source: string;
    begruendung: string;
  }>;
  borderlineCases: Array<{
    description: string;
    source: string;
    recommendation: string;
  }>;
  cleanItems: number;
  meta?: {
    lvTruncated?: boolean;
    emailsTruncated?: boolean;
  };
  error?: string;
}

interface Props {
  prospect: Prospect;
}

const MAX_BYTES = Math.floor(4.5 * 1024 * 1024);

interface FilePickerProps {
  label: string;
  helpText: string;
  file: File | null;
  onPick: (f: File | null) => void;
  primaryColor: string;
}

function FilePicker({ label, helpText, file, onPick, primaryColor }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const sizeMb = file ? (file.size / 1024 / 1024).toFixed(1) : null;
  const tooBig = !!file && file.size > MAX_BYTES;
  const wrongType = !!file && file.type !== "application/pdf";

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1">
        {label}
      </label>
      <div className="text-xs text-gray-500 mb-2">{helpText}</div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 rounded-md border-2 border-dashed text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          style={{ borderColor: primaryColor }}
        >
          📎 PDF auswählen
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
        {file && (
          <div className="flex-1 text-sm">
            <div className="font-mono text-gray-700 truncate">{file.name}</div>
            <div
              className={`text-xs ${tooBig || wrongType ? "text-red-600" : "text-gray-500"}`}
            >
              {sizeMb} MB
              {tooBig && " - zu groß (max 4,5 MB)"}
              {wrongType && " - falscher Dateityp (nur PDF)"}
            </div>
          </div>
        )}
        {file && (
          <button
            type="button"
            onClick={() => onPick(null)}
            className="text-gray-400 hover:text-gray-700 text-xl"
            aria-label="Entfernen"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default function NachtragsAgentDemo({ prospect }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [resultMode, setResultMode] = useState<"sample" | "user" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [lvFile, setLvFile] = useState<File | null>(null);
  const [emailsFile, setEmailsFile] = useState<File | null>(null);

  async function runSample() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/demo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trade: prospect.trade,
          companyName: prospect.companyName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data);
      setResultMode("sample");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function runUpload(e: FormEvent) {
    e.preventDefault();
    if (!lvFile || !emailsFile) {
      setError("Bitte beide PDFs auswählen");
      return;
    }
    if (lvFile.size > MAX_BYTES || emailsFile.size > MAX_BYTES) {
      setError("Datei zu groß. Maximal 4,5 MB pro PDF.");
      return;
    }
    if (lvFile.type !== "application/pdf" || emailsFile.type !== "application/pdf") {
      setError("Nur PDF-Dateien erlaubt.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("lv", lvFile);
      fd.append("emails", emailsFile);
      fd.append("companyName", prospect.companyName);
      const res = await fetch("/api/demo/analyze-upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unbekannter Fehler");
      setResult(data);
      setResultMode("user");
      // Scroll to result smoothly
      setTimeout(
        () => document.getElementById("demo-result")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="nachtragsagent-demo"
      className="px-6 py-20"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Live-Demo · läuft auf echtem Sample-Projekt
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          style={{ fontFamily: prospect.fontFamily }}
        >
          NachtragsAgent für {prospect.companyName}
        </h2>
        <p className="text-gray-700 text-lg mb-10">
          Ich hab einen Beispiel-LV (Bürobau Augustaanlage) und 7 typische
          Bauleiter-Mails vorbereitet. Klick auf{" "}
          <strong>„Analyse starten"</strong> - der Agent liest beides und sagt
          dir, was an Nachträgen liegen geblieben wäre.
        </p>

        {/* Visual: agent flow */}
        <div className="mb-8 rounded-xl overflow-hidden bg-white border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/shared/ai-agent-flow.png"
            alt="E-Mails fließen in den NachtragsAgent und werden zu strukturierten Nachträgen"
            className="w-full h-auto"
          />
        </div>

        {/* Sample panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                📎 Beispiel-LV
              </div>
              <div className="font-mono text-gray-700">
                Bürobau Augustaanlage 32, Mannheim
                <br />
                Auftragssumme: 142.500 €<br />
                6 Positionen · 4 Ausschlüsse
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                📧 Beispiel-Mails
              </div>
              <div className="font-mono text-gray-700">
                7 Mails · 4.-25.03.
                <br />
                Mix: Aufmaß-Anfragen, Behinderungsanzeigen,
                <br />
                Anweisungen vom GU
              </div>
            </div>
          </div>
        </div>

        {/* Sample action button (always visible) */}
        <button
          onClick={runSample}
          disabled={loading}
          className="w-full md:w-auto px-8 py-4 rounded-md font-semibold text-base transition hover:opacity-90 text-white disabled:opacity-50"
          style={{ backgroundColor: prospect.primaryColor }}
        >
          {loading && resultMode !== "user"
            ? "Agent liest LV und Mails..."
            : "▶ Analyse starten"}
        </button>

        {/* Result */}
        <div id="demo-result" className="scroll-mt-24">
          {loading && (
            <div className="mt-8 flex items-center gap-3 text-gray-700">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              {resultMode === "user"
                ? "Liest deine PDFs ... ~ 15-30 Sek je nach Größe"
                : "Liest LV und Mails ... ~ 10 Sek"}
            </div>
          )}

          {error && !loading && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
              <strong>Fehler:</strong> {error}
            </div>
          )}

          {result && !loading && (
            <div className="mt-8 space-y-6">
              {resultMode === "user" && (
                <div
                  className="rounded-md p-3 text-sm"
                  style={{
                    backgroundColor: `${prospect.primaryColor}10`,
                    color: prospect.primaryColor,
                  }}
                >
                  <strong>✓ Deine PDFs analysiert.</strong> Daten wurden nicht
                  gespeichert.
                  {(result.meta?.lvTruncated || result.meta?.emailsTruncated) && (
                    <div className="text-xs mt-1 opacity-80">
                      Hinweis: einer oder beide Texte waren zu lang und wurden
                      für die Demo-Analyse gekürzt. Vollanalyse erfolgt im
                      Pilot.
                    </div>
                  )}
                </div>
              )}

              {/* Clear nachtraege */}
              {result.clearNachtraege.length > 0 && (
                <div className="bg-white rounded-lg border-l-4 border-green-500 p-6">
                  <div className="text-sm uppercase tracking-widest text-green-700 mb-3 font-semibold">
                    ✅ {result.clearNachtraege.length} klarer Nachtrag erkannt
                  </div>
                  {result.clearNachtraege.map((n, i) => (
                    <div
                      key={i}
                      className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-0 border-gray-200"
                    >
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {n.currency === "EUR" ? "€" : n.currency}{" "}
                        {n.value.toLocaleString("de-DE")}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Quelle: {n.source}
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap">
                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                          Begründungstext (fertig zum Senden):
                        </div>
                        {n.begruendung}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Borderline */}
              {result.borderlineCases.length > 0 && (
                <div className="bg-white rounded-lg border-l-4 border-yellow-500 p-6">
                  <div className="text-sm uppercase tracking-widest text-yellow-700 mb-3 font-semibold">
                    🟡 {result.borderlineCases.length} grenzwertige Vorgänge
                  </div>
                  <ul className="space-y-3">
                    {result.borderlineCases.map((b, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        <strong>{b.description}</strong>
                        <div className="text-xs text-gray-500 mt-1">
                          Quelle: {b.source}
                        </div>
                        <div className="mt-1">→ {b.recommendation}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Clean */}
              <div className="text-sm text-gray-600">
                ✓ {result.cleanItems} weitere Vorgänge geprüft, sauber im
                Vertragsumfang.
              </div>

              {/* Conversion CTA */}
              <div
                className="rounded-lg p-6 text-white"
                style={{ backgroundColor: prospect.primaryColor }}
              >
                <h3 className="text-xl font-bold mb-2">
                  {resultMode === "user"
                    ? "Das war ein Auszug. Im Pilot läuft das wöchentlich automatisch."
                    : "Stell dir das mit deinen echten Mails vor."}
                </h3>
                <p className="opacity-90 mb-5">
                  Im Audit zeig ich dir, wie wir bei {prospect.companyName} mit
                  eurer echten Korrespondenz und ohne Truncierung arbeiten. 30
                  Min, kostenfrei.
                </p>
                <a
                  href={prospect.calendlyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-md font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: prospect.secondaryColor,
                    color: "#111",
                  }}
                >
                  30-Min Audit buchen →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Upload section */}
        <div className="mt-16 pt-12 border-t-2 border-dashed border-gray-300">
          <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            Oder: deine echten Daten testen
          </div>
          <h3
            className="text-2xl md:text-3xl font-bold mb-3 text-gray-900"
            style={{ fontFamily: prospect.fontFamily }}
          >
            Lad deinen LV + ein Email-PDF hoch
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl">
            Ich analysiere deine echten Daten mit derselben Engine. Daten werden{" "}
            <strong>nicht gespeichert</strong>, einmalige Analyse, danach
            gelöscht. Max 4,5 MB pro PDF, nur PDF-Format.
          </p>

          <form
            onSubmit={runUpload}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-5"
          >
            <FilePicker
              label="LV / Vertrag (PDF)"
              helpText="Dein Leistungsverzeichnis oder NU-Vertrag als PDF. Text-PDF (kein Scan), max 4,5 MB."
              file={lvFile}
              onPick={setLvFile}
              primaryColor={prospect.primaryColor}
            />
            <FilePicker
              label="Email-Korrespondenz (PDF)"
              helpText="Mails zum Projekt als PDF. Tipp: in deinem Mail-Programm 5-10 relevante Mails markieren und als PDF drucken/exportieren."
              file={emailsFile}
              onPick={setEmailsFile}
              primaryColor={prospect.primaryColor}
            />

            <button
              type="submit"
              disabled={loading || !lvFile || !emailsFile}
              className="w-full md:w-auto px-8 py-4 rounded-md font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: prospect.primaryColor }}
            >
              {loading && resultMode === "user"
                ? "Analysiere deine PDFs..."
                : "▶ Meine Daten analysieren"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
