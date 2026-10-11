const hubUrl = 'https://tools.donglinphoto.com/';

export function DongToolsBar() {
  return (
    <nav className="dong-tools-bar" aria-label="Dong Tools 品牌導覽">
      <div className="dong-tools-bar-inner">
        <a
          className="dong-tools-brand"
          aria-label="Quote · Dong Tools（前往工具總站）"
          href={hubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/identity/logo-white.svg" alt="" width="32" height="32" />
          <span>Quote</span>
          <span className="dong-tools-family">Dong Tools</span>
          <span className="sr-only">（另開新分頁）</span>
        </a>
        <a
          className="dong-tools-hub-link"
          href={hubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          所有工具 <span aria-hidden="true">↗</span>
          <span className="sr-only">（另開新分頁）</span>
        </a>
      </div>
    </nav>
  );
}
