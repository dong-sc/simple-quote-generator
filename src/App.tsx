import { useEffect, useMemo, useState } from 'react';
import { ActionBar } from './components/ActionBar';
import { AuthorPromoSection } from './components/AuthorPromoSection';
import { DongToolsBar } from './components/DongToolsBar';
import { Header } from './components/Header';
import { QuoteForm } from './components/QuoteForm';
import { QuotePreview } from './components/QuotePreview';
import { SupportSection } from './components/SupportSection';
import { VisitorCounter } from './components/VisitorCounter';
import { calculateTotals } from './utils/calculation';
import { exportQuoteExcel } from './utils/exportQuoteExcel';
import { clearQuoteData, loadQuoteData, saveQuoteData } from './utils/storage';
import { generateQuotePlainText } from './utils/quoteText';
import type { QuoteData } from './types/quote';

function getPrintableTitle(title: string): string {
  const normalizedTitle = title.trim() || '報價單';
  const safeTitle = normalizedTitle.replace(/[\\/:*?"<>|]/g, '-');

  return `${safeTitle}_報價單`;
}

export default function App() {
  const [quoteData, setQuoteData] = useState<QuoteData>(() => loadQuoteData());
  const [copyMessage, setCopyMessage] = useState('');
  const totals = useMemo(() => calculateTotals(quoteData), [quoteData]);

  useEffect(() => {
    saveQuoteData(quoteData);
  }, [quoteData]);

  function handleClear() {
    setQuoteData(clearQuoteData());
    setCopyMessage('');
  }

  async function handleCopyText() {
    const plainText = generateQuotePlainText(quoteData, totals);
    await navigator.clipboard.writeText(plainText);
    setCopyMessage('已複製文字版報價內容');
    window.setTimeout(() => setCopyMessage(''), 2200);
  }

  async function handleExportExcel() {
    try {
      await exportQuoteExcel(quoteData, totals);
      setCopyMessage('已匯出 Excel 資料表');
      window.setTimeout(() => setCopyMessage(''), 2200);
    } catch {
      setCopyMessage('匯出 Excel 失敗，請稍後再試');
      window.setTimeout(() => setCopyMessage(''), 2200);
    }
  }

  function handlePrint() {
    const originalTitle = document.title;

    document.title = getPrintableTitle(quoteData.title);

    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    window.print();
    window.setTimeout(restoreTitle, 1000);
  }

  return (
    <>
      <DongToolsBar />
      <Header />
      <main className="app-shell">
        <section className="workspace" aria-label="報價單製作工作區">
          <div className="form-pane">
            <ActionBar
              copyMessage={copyMessage}
              onClear={handleClear}
              onCopyText={handleCopyText}
              onExportExcel={handleExportExcel}
              onPrint={handlePrint}
            />
            <QuoteForm data={quoteData} onChange={setQuoteData} totals={totals} />
          </div>
          <QuotePreview data={quoteData} totals={totals} />
        </section>
        <SupportSection />
        <AuthorPromoSection />
        <VisitorCounter />
      </main>
    </>
  );
}
