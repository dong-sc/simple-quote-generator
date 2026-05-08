import type { QuoteData, Totals } from '../types/quote';
import { formatCurrency, parseNumberInput } from '../utils/currency';

interface ReimbursableExpensesEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
  totals: Totals;
}

export function ReimbursableExpensesEditor({
  data,
  onChange,
  totals,
}: ReimbursableExpensesEditorProps) {
  const expenses = data.reimbursableExpenses;

  function updateExpenses(
    patch: Partial<QuoteData['reimbursableExpenses']>,
  ) {
    onChange({
      ...data,
      reimbursableExpenses: { ...expenses, ...patch },
    });
  }

  return (
    <section className="form-section">
      <h2>實報實銷</h2>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={expenses.enabled}
          onChange={(event) => updateExpenses({ enabled: event.target.checked })}
        />
        啟用實報實銷
      </label>
      {expenses.enabled ? (
        <div className="stacked-fields">
          <label>
            實報實銷說明
            <textarea
              rows={3}
              value={expenses.description}
              onChange={(event) => updateExpenses({ description: event.target.value })}
            />
          </label>
          <fieldset className="radio-fieldset">
            <legend>實報實銷處理方式</legend>
            <label className="radio-field">
              <input
                type="radio"
                name="reimbursable-tax-treatment"
                checked={expenses.taxTreatment === 'separate'}
                onChange={() => updateExpenses({ taxTreatment: 'separate' })}
              />
              另列，不納入本次服務費稅額計算
            </label>
            <label className="radio-field">
              <input
                type="radio"
                name="reimbursable-tax-treatment"
                checked={expenses.taxTreatment === 'included'}
                onChange={() => updateExpenses({ taxTreatment: 'included' })}
              />
              併入報價金額計算稅額
            </label>
          </fieldset>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={expenses.hasEstimate}
              onChange={(event) =>
                updateExpenses({ hasEstimate: event.target.checked })
              }
            />
            提供預估金額
          </label>
          {expenses.hasEstimate ? (
            <label>
              實報實銷預估金額
              <input
                min="0"
                type="number"
                value={expenses.estimatedAmount}
                onChange={(event) =>
                  updateExpenses({
                    estimatedAmount: parseNumberInput(event.target.value),
                  })
                }
              />
            </label>
          ) : null}
          <div className="reimbursable-hint">
            {expenses.hasEstimate ? (
              expenses.taxTreatment === 'included' ? (
                <>
                  實報實銷預估：
                  {formatCurrency(totals.reimbursableEstimate, data.currency)}，將併入本次報價小計並計算稅額。
                </>
              ) : (
                <>
                  實報實銷預估：
                  {formatCurrency(totals.reimbursableEstimate, data.currency)}，預估總額：
                  {formatCurrency(totals.estimatedTotal ?? totals.quoteSubtotal, data.currency)}
                </>
              )
            ) : (
              '實報實銷會顯示為另計，依實際支出憑證請款。'
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
