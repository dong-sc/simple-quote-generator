import type { QuoteData } from '../types/quote';
import { termTemplates } from '../utils/defaultQuote';

interface TermsEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export function TermsEditor({ data, onChange }: TermsEditorProps) {
  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    onChange({ ...data, [key]: value });
  }

  function appendTerm(term: string) {
    const nextTerms = data.terms.trim()
      ? `${data.terms.trim()}\n${term}`
      : term;
    update('terms', nextTerms);
  }

  return (
    <section className="form-section">
      <h2>備註與條款</h2>
      <div className="stacked-fields">
        <label>
          付款方式
          <input
            value={data.paymentTerms}
            onChange={(event) => update('paymentTerms', event.target.value)}
            placeholder="例如：確認報價後支付 50%，結案前支付尾款"
          />
        </label>
        <label>
          交付說明
          <textarea
            rows={2}
            value={data.deliveryNotes}
            onChange={(event) => update('deliveryNotes', event.target.value)}
          />
        </label>
        <label>
          備註
          <textarea
            rows={3}
            value={data.notes}
            onChange={(event) => update('notes', event.target.value)}
          />
        </label>
        <div>
          <p className="template-label">條款範本</p>
          <div className="template-buttons">
            {termTemplates.map((term) => (
              <button
                className="chip-button"
                type="button"
                key={term}
                onClick={() => appendTerm(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        <label>
          條款
          <textarea
            rows={6}
            value={data.terms}
            onChange={(event) => update('terms', event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
