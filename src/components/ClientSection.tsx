import type { QuoteData } from '../types/quote';

interface ClientSectionProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export function ClientSection({ data, onChange }: ClientSectionProps) {
  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <section className="form-section">
      <h2>客戶資訊</h2>
      <div className="field-grid two-columns">
        <label>
          客戶名稱
          <input
            value={data.clientName}
            onChange={(event) => update('clientName', event.target.value)}
          />
        </label>
        <label>
          客戶公司
          <input
            value={data.clientCompany}
            onChange={(event) => update('clientCompany', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          客戶統編
          <input
            value={data.clientTaxId}
            onChange={(event) => update('clientTaxId', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          客戶 Email
          <input
            type="email"
            value={data.clientEmail}
            onChange={(event) => update('clientEmail', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          客戶電話
          <input
            value={data.clientPhone}
            onChange={(event) => update('clientPhone', event.target.value)}
            placeholder="可留空"
          />
        </label>
      </div>
    </section>
  );
}
