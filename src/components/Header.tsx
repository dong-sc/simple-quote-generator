export function Header() {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Simple Quote Generator</p>
        <h1>報價單製作工具</h1>
        <p className="intro">
          一個給自由工作者與小型工作室使用的簡易報價單製作工具。不用登入、不需安裝，填寫資料後即可產生可列印、可另存 PDF 的報價單。
        </p>
      </div>
      <p className="privacy-note">資料僅儲存在你的瀏覽器，不會上傳到任何伺服器。</p>
    </header>
  );
}
