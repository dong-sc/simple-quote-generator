export function AuthorPromoSection() {
  return (
    <section className="author-promo-section" aria-labelledby="author-promo-title">
      <div className="author-promo-card">
        <div className="author-promo-content">
          <p className="author-promo-label">Dong Lin Photo</p>

          <h2 id="author-promo-title">需要拍攝，或想把工作流程整理得更順？</h2>

          <p>
            這些小工具由 Dong Lin Photo 製作。平常主要工作是活動攝影、舞台攝影、
            記者會與各類現場影像紀錄，也持續把接案、報價、預約、交付等重複流程，
            整理成更容易使用的工具。
          </p>

          <p>
            如果你正在找攝影師，或對預約系統、報價流程、接案文件與小型工作工具有興趣，
            可以到我的網站看看。
          </p>
        </div>

        <div className="author-promo-actions">
          <a
            className="author-promo-button"
            href="https://donglinphoto.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            看作品與合作方式
          </a>

          <p className="author-promo-note">
            攝影服務、作品集、預約入口與工作流程工具整理
          </p>
        </div>
      </div>
    </section>
  );
}
