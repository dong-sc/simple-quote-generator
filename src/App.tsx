import { useEffect, useMemo, useState } from 'react';
import { ActionBar } from './components/ActionBar';
import { Header } from './components/Header';
import { QuoteForm } from './components/QuoteForm';
import { QuotePreview } from './components/QuotePreview';
import { calculateTotals } from './utils/calculation';
import { clearQuoteData, loadQuoteData, saveQuoteData } from './utils/storage';
import { generateQuotePlainText } from './utils/quoteText';
import type { QuoteData } from './types/quote';

function getPrintableTitle(title: string): string {
  const normalizedTitle = title.trim() || '報價單';
  const safeTitle = normalizedTitle.replace(/[\\/:*?"<>|]/g, '-');

  return `${safeTitle}_報價單`;
}

function detectSecondPrintPage(): boolean {
  const preview = document.querySelector<HTMLElement>('.quote-preview');
  if (!preview) {
    return false;
  }

  const measuringContainer = document.createElement('div');
  measuringContainer.className = 'print-measure-container';

  const clonedPreview = preview.cloneNode(true) as HTMLElement;
  clonedPreview.querySelector('.print-next-page-notice')?.remove();
  measuringContainer.append(clonedPreview);
  document.body.append(measuringContainer);

  const printablePageHeightPx = (274 / 25.4) * 96;
  const measuredHeight = clonedPreview.scrollHeight;
  measuringContainer.remove();

  return measuredHeight > printablePageHeightPx;
}

function setSecondPageNotice(hasSecondPage: boolean): void {
  const notice = document.querySelector<HTMLElement>('.print-next-page-notice');
  if (notice) {
    notice.dataset.hasSecondPage = String(hasSecondPage);
  }
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

  function handlePrint() {
    const originalTitle = document.title;
    const hasSecondPage = detectSecondPrintPage();

    document.title = getPrintableTitle(quoteData.title);
    setSecondPageNotice(hasSecondPage);

    const restoreTitle = () => {
      document.title = originalTitle;
      setSecondPageNotice(false);
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    window.print();
    window.setTimeout(restoreTitle, 1000);
  }

  return (
    <>
      <Header />
      <main className="app-shell">
        <section className="workspace" aria-label="報價單製作工作區">
          <div className="form-pane">
            <ActionBar
              copyMessage={copyMessage}
              onClear={handleClear}
              onCopyText={handleCopyText}
              onPrint={handlePrint}
            />
            <QuoteForm data={quoteData} onChange={setQuoteData} totals={totals} />
          </div>
          <QuotePreview data={quoteData} totals={totals} />
        </section>
      </main>
    </>
  );
}
