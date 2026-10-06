import { TotalsSummary } from './TotalsSummary';
import type { QuoteData, Totals } from '../types/quote';
import { parseNumberInput } from '../utils/currency';

interface TotalsEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
  totals: Totals;
}

export function TotalsEditor({ data, onChange, totals }: TotalsEditorProps) {
  return (
    <section className="form-section">
      <h2>金額計算</h2>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={data.discountEnabled}
          onChange={(event) =>
            onChange({ ...data, discountEnabled: event.target.checked })
          }
        />
        是否套用折扣
      </label>
      <div className="field-grid two-columns">
        {data.discountEnabled ? (
          <label>
            折扣金額
            <input
              min="0"
              type="number"
              value={data.discountAmount}
              onChange={(event) =>
                onChange({
                  ...data,
                  discountAmount: parseNumberInput(event.target.value),
                })
              }
            />
          </label>
        ) : null}
        <label>
          稅率（%）
          <input
            min="0"
            type="number"
            value={data.taxRate}
            onChange={(event) =>
              onChange({ ...data, taxRate: parseNumberInput(event.target.value) })
            }
          />
        </label>
      </div>
      <TotalsSummary data={data} totals={totals} />
    </section>
  );
}
