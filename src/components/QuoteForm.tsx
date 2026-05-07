import { ClientSection } from './ClientSection';
import { IssuerSection } from './IssuerSection';
import { QuoteItemsEditor } from './QuoteItemsEditor';
import { ReimbursableExpensesEditor } from './ReimbursableExpensesEditor';
import { TermsEditor } from './TermsEditor';
import { TotalsEditor } from './TotalsEditor';
import type { Currency, QuoteData, Totals } from '../types/quote';
import { parseNumberInput } from '../utils/currency';

interface QuoteFormProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
  totals: Totals;
}

const currencies: Currency[] = ['TWD', 'USD', 'JPY', 'HKD', 'CNY'];

export function QuoteForm({ data, onChange, totals }: QuoteFormProps) {
  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <form className="quote-form">
      <section className="form-section">
        <h2>報價單資訊</h2>
        <div className="field-grid two-columns">
          <label>
            報價單標題
            <input
              value={data.title}
              onChange={(event) => update('title', event.target.value)}
            />
          </label>
          <label>
            報價單編號
            <input
              value={data.quoteNumber}
              onChange={(event) => update('quoteNumber', event.target.value)}
              placeholder="可留空"
            />
          </label>
          <label>
            報價日期
            <input
              type="date"
              value={data.issueDate}
              onChange={(event) => update('issueDate', event.target.value)}
            />
          </label>
          <label>
            報價有效期限（天）
            <input
              type="number"
              min="0"
              value={data.validUntilDays}
              onChange={(event) =>
                update('validUntilDays', parseNumberInput(event.target.value))
              }
            />
          </label>
          <label>
            幣別
            <select
              value={data.currency}
              onChange={(event) => update('currency', event.target.value as Currency)}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <IssuerSection data={data} onChange={onChange} />
      <ClientSection data={data} onChange={onChange} />
      <QuoteItemsEditor data={data} onChange={onChange} />
      <TotalsEditor data={data} onChange={onChange} totals={totals} />
      <ReimbursableExpensesEditor data={data} onChange={onChange} totals={totals} />
      <TermsEditor data={data} onChange={onChange} />
    </form>
  );
}
