import type { QuoteData } from '../types/quote';

interface IssuerSectionProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

const signatureImageMaxWidth = 900;
const signatureImageMaxHeight = 360;

function resizeSignatureImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          1,
          signatureImageMaxWidth / image.width,
          signatureImageMaxHeight / image.height,
        );
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Canvas is not supported.'));
          return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => reject(new Error('Unable to load image.'));
      image.src = String(reader.result || '');
    };

    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  });
}

export function IssuerSection({ data, onChange }: IssuerSectionProps) {
  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    onChange({ ...data, [key]: value });
  }

  async function handleSignatureUpload(file: File | null) {
    if (!file) {
      return;
    }

    try {
      update('issuerSignatureImage', await resizeSignatureImage(file));
    } catch {
      update('issuerSignatureImage', '');
    }
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
        <div className="signature-upload-card span-two">
          <label>
            報價方簽名檔
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) =>
                void handleSignatureUpload(event.currentTarget.files?.[0] ?? null)
              }
            />
          </label>
          <div className="signature-upload-preview" aria-label="報價方簽名預覽">
            {data.issuerSignatureImage ? (
              <img src={data.issuerSignatureImage} alt="報價方簽名" />
            ) : (
              <span>尚未上傳</span>
            )}
          </div>
          <button
            className="text-button danger"
            type="button"
            disabled={!data.issuerSignatureImage}
            onClick={() => update('issuerSignatureImage', '')}
          >
            移除簽名檔
          </button>
        </div>
      </div>
    </section>
  );
}
