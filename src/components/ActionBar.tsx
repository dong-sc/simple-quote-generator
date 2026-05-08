interface ActionBarProps {
  copyMessage: string;
  onClear: () => void;
  onCopyText: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export function ActionBar({
  copyMessage,
  onClear,
  onCopyText,
  onExportExcel,
  onPrint,
}: ActionBarProps) {
  return (
    <div className="action-bar">
      <div>
        <button className="button secondary" type="button" onClick={onClear}>
          清空表單
        </button>
      </div>
      <div className="action-group">
        <button className="button" type="button" onClick={onCopyText}>
          複製文字版
        </button>
        <button className="button" type="button" onClick={onExportExcel}>
          匯出 Excel 資料表
        </button>
        <button className="button primary" type="button" onClick={onPrint}>
          列印 / 另存 PDF
        </button>
      </div>
      <span className="copy-message" role="status" aria-live="polite">
        {copyMessage}
      </span>
    </div>
  );
}
