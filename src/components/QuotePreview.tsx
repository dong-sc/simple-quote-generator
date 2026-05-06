import type { QuoteData, Totals } from '../types/quote';
import { calculateItemSubtotal } from '../utils/calculation';
import { formatCurrency } from '../utils/currency';
import { addDays } from '../utils/date';

interface QuotePreviewProps {
  data: QuoteData;
  totals: Totals;
}

function DetailLine({ label, value }: { label: string; value: string }) {
  if (!value.trim()) {
    return null;
  }

  return (
    <p>
      <span>{label}</span>
      {value}
    </p>
  );
}

function MultilineBlock({ title, value }: { title: string; value: string }) {
  if (!value.trim()) {
    return null;
  }

  return (
    <section className="preview-block">
      <h3>{title}</h3>
      <p className="multiline">{value}</p>
    </section>
  );
}

export function QuotePreview({ data, totals }: QuotePreviewProps) {
  const validUntil = addDays(data.issueDate, data.validUntilDays);
  const taxLabel = data.taxRate > 0 ? `稅額（${data.taxRate}%）` : '稅額（未稅 / 免稅）';
  const hasSupplementalInfo =
    data.reimbursableExpenses.enabled ||
    data.paymentTerms.trim() ||
    data.deliveryNotes.trim() ||
    data.notes.trim() ||
    data.terms.trim();

  return (
    <aside className="preview-pane" aria-label="報價單預覽">
      <article className="quote-preview">
        <header className="preview-header">
          <div>
            <p className="preview-label">Quotation</p>
            <h2>{data.title || '報價單'}</h2>
          </div>
          <div className="preview-meta">
            <DetailLine label="編號" value={data.quoteNumber} />
            <DetailLine label="日期" value={data.issueDate} />
            <DetailLine label="有效至" value={validUntil} />
          </div>
        </header>

        <section className="preview-party-grid">
          <div className="preview-party">
            <h3>報價方</h3>
            <strong>{data.issuerName || '公司 / 個人名稱'}</strong>
            <DetailLine label="統編" value={data.issuerTaxId} />
            <DetailLine label="Email" value={data.issuerEmail} />
            <DetailLine label="電話" value={data.issuerPhone} />
            <DetailLine label="地址" value={data.issuerAddress} />
            <DetailLine label="網站" value={data.issuerWebsite} />
          </div>
          <div className="preview-party">
            <h3>客戶</h3>
            <strong>{data.clientName || '客戶名稱'}</strong>
            <DetailLine label="公司" value={data.clientCompany} />
            <DetailLine label="統編" value={data.clientTaxId} />
            <DetailLine label="Email" value={data.clientEmail} />
            <DetailLine label="電話" value={data.clientPhone} />
          </div>
        </section>

        <section className="preview-block">
          <h3>報價項目</h3>
          <div className="preview-table-wrap">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>品項</th>
                  <th>說明</th>
                  <th className="number-cell">數量</th>
                  <th>單位</th>
                  <th className="number-cell">單價</th>
                  <th className="number-cell">小計</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.name || `品項 ${index + 1}`}</td>
                    <td>{item.description || '-'}</td>
                    <td className="number-cell">{item.quantity || 0}</td>
                    <td>{item.unit || '-'}</td>
                    <td className="number-cell">
                      {formatCurrency(item.unitPrice || 0, data.currency)}
                    </td>
                    <td className="number-cell">
                      {formatCurrency(calculateItemSubtotal(item), data.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="preview-totals" aria-label="金額摘要">
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
          <div className="preview-total-main">
            <span>本次報價小計</span>
            <strong>{formatCurrency(totals.quoteSubtotal, data.currency)}</strong>
          </div>
          {data.reimbursableExpenses.enabled ? (
            <>
              {data.reimbursableExpenses.hasEstimate ? (
                <>
                  <div>
                    <span>實報實銷預估</span>
                    <strong>
                      {formatCurrency(totals.reimbursableEstimate, data.currency)}
                    </strong>
                  </div>
                  <div className="preview-total-estimate">
                    <span>預估總額</span>
                    <strong>
                      {formatCurrency(
                        totals.estimatedTotal ?? totals.quoteSubtotal,
                        data.currency,
                      )}
                    </strong>
                  </div>
                </>
              ) : (
                <div>
                  <span>實報實銷</span>
                  <strong>另計，依實際支出憑證請款</strong>
                </div>
              )}
            </>
          ) : null}
        </section>

        {hasSupplementalInfo ? (
          <section className="preview-supplements">
            <h3>補充資訊</h3>
            {data.reimbursableExpenses.enabled ? (
              <section className="preview-block compact-block">
                <h4>實報實銷</h4>
                <p className="multiline">{data.reimbursableExpenses.description}</p>
              </section>
            ) : null}

            <MultilineBlock title="付款方式" value={data.paymentTerms} />
            <MultilineBlock title="交付說明" value={data.deliveryNotes} />
            <MultilineBlock title="備註" value={data.notes} />
            <MultilineBlock title="條款" value={data.terms} />
          </section>
        ) : null}
        <div className="print-page-footer" aria-hidden="true" />
      </article>
    </aside>
  );
}
