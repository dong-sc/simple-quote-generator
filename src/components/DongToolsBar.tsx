const hubUrl = 'https://tools.donglinphoto.com/';

export function DongToolsBar() {
  return (
    <nav className="dong-tools-bar" aria-label="Dong Tools 品牌導覽">
      <div className="dong-tools-bar-inner">
        <a
          className="dong-tools-brand"
          href={hubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={`${hubUrl}favicon.ico`} alt="" />
          <span>Dong Tools</span>
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
