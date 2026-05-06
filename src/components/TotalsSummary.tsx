import type { QuoteData, Totals } from '../types/quote';
import { formatCurrency } from '../utils/currency';

interface TotalsSummaryProps {
  data: QuoteData;
  totals: Totals;
}

export function TotalsSummary({ data, totals }: TotalsSummaryProps) {
  const taxLabel = data.taxRate > 0 ? `稅額（${data.taxRate}%）` : '稅額（未稅 / 免稅）';

  return (
    <div className="totals-summary">
      <div>
        <span>服務費小計</span>
        <strong>{formatCurrency(totals.serviceSubtotal, data.currency)}</strong>
      </div>
      <div>
        <span>折扣</span>
        <strong>{formatCurrency(totals.discountAmount, data.currency)}</strong>
      </div>
      <div>
        <span>{taxLabel}</span>
        <strong>{formatCurrency(totals.taxAmount, data.currency)}</strong>
      </div>
      <div className="grand-row">
        <span>本次報價小計</span>
        <strong>{formatCurrency(totals.quoteSubtotal, data.currency)}</strong>
      </div>
    </div>
  );
}
