import { TotalsSummary } from './TotalsSummary';
import type { QuoteData, Totals } from '../types/quote';
import { clampNonNegative } from '../utils/currency';

interface TotalsEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
  totals: Totals;
}

export function TotalsEditor({ data, onChange, totals }: TotalsEditorProps) {
  return (
    <section className="form-section">
      <h2>金額計算</h2>
      <div className="field-grid two-columns">
        <label>
          折扣金額
          <input
            min="0"
            type="number"
            value={data.discountAmount}
            onChange={(event) =>
              onChange({
                ...data,
                discountAmount: clampNonNegative(event.target.value),
              })
            }
          />
        </label>
        <label>
          稅率（%）
          <input
            min="0"
            type="number"
            value={data.taxRate}
            onChange={(event) =>
              onChange({ ...data, taxRate: clampNonNegative(event.target.value) })
            }
          />
        </label>
      </div>
      <TotalsSummary data={data} totals={totals} />
    </section>
  );
}
