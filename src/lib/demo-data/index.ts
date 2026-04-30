import type { Trade } from "../trades";
import { TROCKENBAU_LV_TEXT, TROCKENBAU_EMAILS } from "./trockenbau";

// V1: only Trockenbau is filled in. Other trades use Trockenbau as fallback
// until we generate trade-specific synthetic data sets (TODO).
export interface DemoDataSet {
  lvText: string;
  emails: Array<{
    id: string;
    date: string;
    from: string;
    to: string;
    subject: string;
    body: string;
  }>;
}

export function getDemoDataForTrade(trade: Trade): DemoDataSet {
  switch (trade) {
    case "trockenbau":
      return { lvText: TROCKENBAU_LV_TEXT, emails: TROCKENBAU_EMAILS };
    case "elektriker":
    case "bodenleger":
    case "maler":
    default:
      // Fallback to Trockenbau until trade-specific data sets are written.
      return { lvText: TROCKENBAU_LV_TEXT, emails: TROCKENBAU_EMAILS };
  }
}
