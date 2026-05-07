const shortcuts = [
  {
    label: '報價單',
    href: 'https://dong-sc.github.io/simple-quote-generator/',
    current: true,
  },
  {
    label: '請款單',
    href: 'https://dong-sc.github.io/simple-payment-request-generator/',
    current: false,
  },
  {
    label: '服務範圍確認',
    href: 'https://dong-sc.github.io/simple-scope-confirmation-generator/',
    current: false,
  },
];

export function Header() {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Simple Quote Generator</p>
        <h1>報價單製作工具</h1>
        <p className="intro">
          一個給自由工作者與小型工作室使用的簡易報價單製作工具。不用登入、不需安裝，填寫資料後即可產生可列印、可另存 PDF 的報價單。
        </p>
        <nav className="header-tool-shortcuts" aria-label="其他接案文件工具">
          {shortcuts.map((shortcut) => (
            <a
              aria-current={shortcut.current ? 'page' : undefined}
              href={shortcut.href}
              key={shortcut.href}
            >
              {shortcut.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="privacy-note">資料僅儲存在你的瀏覽器，不會上傳到任何伺服器。</p>
    </header>
  );
}
