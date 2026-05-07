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
  );
}
