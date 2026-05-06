import { useEffect, useMemo, useState } from 'react';
import { ActionBar } from './components/ActionBar';
import { Header } from './components/Header';
import { QuoteForm } from './components/QuoteForm';
import { QuotePreview } from './components/QuotePreview';
import { calculateTotals } from './utils/calculation';
import { clearQuoteData, loadQuoteData, saveQuoteData } from './utils/storage';
import { generateQuotePlainText } from './utils/quoteText';
import type { QuoteData } from './types/quote';

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
              onPrint={() => window.print()}
            />
            <QuoteForm data={quoteData} onChange={setQuoteData} totals={totals} />
          </div>
          <QuotePreview data={quoteData} totals={totals} />
        </section>
      </main>
    </>
  );
}
