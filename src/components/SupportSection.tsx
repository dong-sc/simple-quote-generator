import { useState } from 'react';
import {
  bobaSponsorIconUrl,
  bobaSponsorUrl,
  buyMeACoffeeUrl,
  githubSponsorsUrl,
  projectUrl,
  shareText,
  shareTitle,
} from '../utils/projectLinks';

const tools = [
  {
    title: '報價單製作工具',
    description: '整理服務項目、費用、稅額與備註，快速產生正式報價單。',
    href: 'https://dong-sc.github.io/simple-quote-generator/',
    current: true,
  },
  {
    title: '請款單製作工具',
    description: '完成服務後整理請款項目、付款資訊與合計金額。',
    href: 'https://dong-sc.github.io/simple-payment-request-generator/',
    current: false,
  },
  {
    title: '服務範圍確認單',
    description: '接案前確認交付項目、修改規則與不包含項目，減少後續溝通落差。',
    href: 'https://dong-sc.github.io/simple-scope-confirmation-generator/',
    current: false,
  },
];

export function SupportSection() {
  const [message, setMessage] = useState('');
  const supportUrl = bobaSponsorUrl || buyMeACoffeeUrl || githubSponsorsUrl;

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(''), 2200);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: projectUrl,
      });
      return;
    }

    await handleCopyLink();
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${shareText}\n${projectUrl}`);
    showMessage('已複製分享文字與連結');
  }

  return (
    <>
      <section className="tool-links-section" aria-labelledby="business-tools-title">
        <div className="tool-links-intro">
          <p className="support-kicker">接案文件小工具</p>
          <h2 id="business-tools-title">從報價、確認範圍到請款，一次串起來</h2>
          <p>
            這組工具是為自由工作者、小型工作室與攝影接案流程設計。每個工具都維持免登入、免安裝、不上傳資料，適合在和客戶溝通時快速產生可列印、可另存 PDF 的文件。
          </p>
        </div>
        <div className="tool-card-grid">
          {tools.map((tool) => (
            <a
              aria-current={tool.current ? 'page' : undefined}
              className="tool-card"
              href={tool.href}
              key={tool.href}
            >
              <span>{tool.current ? '目前工具' : '相關工具'}</span>
              <strong>{tool.title}</strong>
              <p>{tool.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="support-section" aria-label="支持與分享">
        <div>
          <p className="support-kicker">覺得好用嗎？</p>
          <h2>分享給也需要快速做報價單的人</h2>
          <p>
            這個工具維持純前端、免登入、不上傳資料。如果它幫你省下一點時間，也歡迎分享給朋友，或之後用小額支持讓專案繼續維護。
          </p>
        </div>
        <div className="support-actions">
          {supportUrl ? (
            <a className="boba-button" href={supportUrl} rel="noreferrer" target="_blank">
              <img src={bobaSponsorIconUrl} alt="" aria-hidden="true" />
              <span>Give me a Boba!</span>
            </a>
          ) : (
            <button className="button primary" type="button" disabled>
              支持連結準備中
            </button>
          )}
          <button className="button" type="button" onClick={handleShare}>
            分享這個工具
          </button>
          <button className="button secondary" type="button" onClick={handleCopyLink}>
            複製分享連結
          </button>
          <span className="support-message" role="status" aria-live="polite">
            {message}
          </span>
        </div>
      </section>
    </>
  );
}
