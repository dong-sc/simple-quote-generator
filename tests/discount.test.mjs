import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true } });
const stored = new Map();
globalThis.localStorage = {
  getItem: (key) => stored.get(key) ?? null,
  setItem: (key, value) => stored.set(key, value),
  removeItem: (key) => stored.delete(key),
};
try {
  const { createDefaultQuoteData } = await server.ssrLoadModule('/src/utils/defaultQuote.ts');
  const { calculateTotals } = await server.ssrLoadModule('/src/utils/calculation.ts');
  const { generateQuotePlainText } = await server.ssrLoadModule('/src/utils/quoteText.ts');
  const { loadQuoteData, saveQuoteData, clearQuoteData } = await server.ssrLoadModule('/src/utils/storage.ts');
  const { QuotePreview } = await server.ssrLoadModule('/src/components/QuotePreview.tsx');
  const { TotalsSummary } = await server.ssrLoadModule('/src/components/TotalsSummary.tsx');
  const { TotalsEditor } = await server.ssrLoadModule('/src/components/TotalsEditor.tsx');
  const { exportQuoteExcel } = await server.ssrLoadModule('/src/utils/exportQuoteExcel.ts');
  const XLSX = createRequire(import.meta.url)('xlsx');
  let exported;
  const originalWriteFile = XLSX.writeFile;
  XLSX.writeFile = (workbook) => { exported = workbook; };
  try {
    const data = createDefaultQuoteData();
    assert.equal(data.discountEnabled, false);
    data.items[0].quantity = 2;
    data.items[0].unitPrice = 500;
    data.discountAmount = 100;
    for (const enabled of [true, false, true]) {
      data.discountEnabled = enabled;
      const totals = calculateTotals(data);
      assert.equal(totals.quoteSubtotal, enabled ? 945 : 1050);
      assert.equal(totals.discountAmount, enabled ? 100 : 0);
      assert.equal(data.discountAmount, 100);
      for (const Component of [QuotePreview, TotalsSummary]) {
        const html = renderToStaticMarkup(createElement(Component, { data, totals }));
        assert.equal(html.includes('折扣'), enabled);
      }
      const form = renderToStaticMarkup(createElement(TotalsEditor, { data, totals, onChange() {} }));
      assert.ok(form.includes('是否套用折扣'));
      assert.equal(form.includes('折扣金額'), enabled);
      assert.equal(generateQuotePlainText(data, totals).includes('折扣：'), enabled);
      await exportQuoteExcel(data, totals);
      const rows = XLSX.utils.sheet_to_json(exported.Sheets['報價單資料'], { header: 1 });
      assert.equal(rows.some((row) => row.includes('折扣')), enabled);
      assert.equal(rows.some((row) => row.includes('折扣後金額')), enabled);
      saveQuoteData(data);
      assert.equal(loadQuoteData().discountEnabled, enabled);
    }
    const signatureImage = 'data:image/png;base64,c2lnbmF0dXJl';
    data.issuerSignatureImage = signatureImage;
    for (const showSignatures of [false, true]) {
      data.showSignatures = showSignatures;
      const html = renderToStaticMarkup(createElement(QuotePreview, { data, totals: calculateTotals(data) }));
      assert.equal(html.includes('報價方簽名簽章'), showSignatures);
      assert.equal(html.includes('客戶簽名簽章'), showSignatures);
      assert.equal(html.includes(signatureImage), showSignatures);
      saveQuoteData(data);
      assert.equal(loadQuoteData().showSignatures, showSignatures);
      assert.equal(loadQuoteData().issuerSignatureImage, signatureImage);
    }
    const oldSignatureData = { ...data };
    delete oldSignatureData.showSignatures;
    saveQuoteData(oldSignatureData);
    assert.equal(loadQuoteData().showSignatures, true);
    assert.equal(clearQuoteData().showSignatures, true);
    const legacy = { ...data };
    delete legacy.discountEnabled;
    saveQuoteData(legacy);
    assert.equal(loadQuoteData().discountEnabled, true);
    assert.equal(calculateTotals(loadQuoteData()).quoteSubtotal, 945);
    assert.equal(clearQuoteData().discountEnabled, false);
    data.discountEnabled = true;
    data.discountAmount = 2000;
    assert.equal(calculateTotals(data).quoteSubtotal, 0);
    data.discountEnabled = false;
    data.reimbursableExpenses = { enabled: true, hasEstimate: true, estimatedAmount: 200, taxTreatment: 'included', description: '' };
    assert.equal(calculateTotals(data).quoteSubtotal, 1260);
    console.log('Discount calculation, UI, text, Excel, and storage checks passed.');
  } finally {
    XLSX.writeFile = originalWriteFile;
  }
} finally {
  await server.close();
  delete globalThis.localStorage;
}
