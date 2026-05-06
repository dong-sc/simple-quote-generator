import type { QuoteData } from '../types/quote';

interface IssuerSectionProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export function IssuerSection({ data, onChange }: IssuerSectionProps) {
  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <section className="form-section">
      <h2>報價方資訊</h2>
      <div className="field-grid two-columns">
        <label>
          聯絡人 / 姓名
          <input
            value={data.issuerName}
            onChange={(event) => update('issuerName', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          公司名稱
          <input
            value={data.issuerCompany}
            onChange={(event) => update('issuerCompany', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          統編
          <input
            value={data.issuerTaxId}
            onChange={(event) => update('issuerTaxId', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label>
          聯絡 Email
          <input
            type="email"
            value={data.issuerEmail}
            onChange={(event) => update('issuerEmail', event.target.value)}
          />
        </label>
        <label>
          聯絡電話
          <input
            value={data.issuerPhone}
            onChange={(event) => update('issuerPhone', event.target.value)}
          />
        </label>
        <label className="span-two">
          地址
          <input
            value={data.issuerAddress}
            onChange={(event) => update('issuerAddress', event.target.value)}
            placeholder="可留空"
          />
        </label>
        <label className="span-two">
          網站
          <input
            value={data.issuerWebsite}
            onChange={(event) => update('issuerWebsite', event.target.value)}
            placeholder="可留空"
          />
        </label>
      </div>
    </section>
  );
}
