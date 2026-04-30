export type Trade = "trockenbau" | "elektriker" | "bodenleger" | "maler";

export const TRADE_LABELS: Record<Trade, string> = {
  trockenbau: "Trockenbau",
  elektriker: "Elektrotechnik",
  bodenleger: "Bodenbeläge",
  maler: "Malerei",
};

export const TRADE_VERB: Record<Trade, string> = {
  trockenbau: "Trockenbauer",
  elektriker: "Elektriker",
  bodenleger: "Bodenleger",
  maler: "Maler",
};
