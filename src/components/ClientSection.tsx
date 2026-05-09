import type { QuoteData } from '../types/quote';
import { CollapsibleFieldGroup } from './CollapsibleFieldGroup';

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
          聯絡人 / 姓名
          <input
            value={data.clientName}
            onChange={(event) => update('clientName', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          公司名稱
          <input
            value={data.clientCompany}
            onChange={(event) => update('clientCompany', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          統編
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
        <CollapsibleFieldGroup title="地址、網站">
          <div className="field-grid two-columns nested-field-grid">
            <label className="span-two">
              地址
              <input
                value={data.clientAddress}
                onChange={(event) => update('clientAddress', event.target.value)}
                placeholder="可留空"
              />
            </label>
            <label className="span-two">
              網站
              <input
                value={data.clientWebsite}
                onChange={(event) => update('clientWebsite', event.target.value)}
                placeholder="可留空"
              />
            </label>
          </div>
        </CollapsibleFieldGroup>
      </div>
    </section>
  );
}
