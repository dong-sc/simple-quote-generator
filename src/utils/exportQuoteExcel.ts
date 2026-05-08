import type { QuoteData, Totals } from '../types/quote';
import { calculateItemSubtotal } from './calculation';
import { clampNonNegative, formatCurrency } from './currency';
import { addDays } from './date';

type CellValue = string | number;
type MergeRange = {
  s: { r: number; c: number };
  e: { r: number; c: number };
};

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function safeFilePart(value: string): string {
  return cleanText(value).replace(/[\\/:*?"<>|]/g, '-');
}

function getExportFileName(data: QuoteData): string {
  const date = cleanText(data.issueDate) || new Date().toISOString().slice(0, 10);
  const clientName = safeFilePart(data.clientName || data.clientCompany);
  const datePart = safeFilePart(date);

  return clientName
    ? `報價單_${clientName}_${datePart}.xlsx`
    : `報價單_${datePart}.xlsx`;
}

function pushMergedRow(
  rows: CellValue[][],
  merges: MergeRange[],
  values: CellValue[],
  endColumn: number,
): void {
  const rowIndex = rows.length;
  rows.push(values);
  merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: endColumn } });
}

function pushSectionTitle(
  rows: CellValue[][],
  merges: MergeRange[],
  title: string,
): void {
  if (rows.length > 0) {
    rows.push([]);
  }

  pushMergedRow(rows, merges, [title], 6);
}

function pushPartyInfo(
  rows: CellValue[][],
  merges: MergeRange[],
  leftRows: CellValue[][],
  rightRows: CellValue[][],
): void {
  const headingRowIndex = rows.length;
  rows.push(['報價方資訊', '', '', '客戶資訊', '', '', '']);
  merges.push({ s: { r: headingRowIndex, c: 0 }, e: { r: headingRowIndex, c: 2 } });
  merges.push({ s: { r: headingRowIndex, c: 3 }, e: { r: headingRowIndex, c: 6 } });

  const rowCount = Math.max(leftRows.length, rightRows.length);
  for (let index = 0; index < rowCount; index += 1) {
    const leftRow = leftRows[index] ?? ['', ''];
    const rightRow = rightRows[index] ?? ['', ''];
    rows.push([leftRow[0], leftRow[1], '', rightRow[0], rightRow[1], '', '']);
  }
}

export async function exportQuoteExcel(
  data: QuoteData,
  totals: Totals,
): Promise<void> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();
  const validUntil = addDays(data.issueDate, data.validUntilDays);
  const taxRate = clampNonNegative(data.taxRate);
  const reimbursableEnabled = data.reimbursableExpenses.enabled;
  const hasReimbursableEstimate =
    reimbursableEnabled && data.reimbursableExpenses.hasEstimate;
  const reimbursableTreatment =
    data.reimbursableExpenses.taxTreatment === 'included'
      ? '併入報價金額計算稅額'
      : '另列，不納入本次服務費稅額計算';

  const rows: CellValue[][] = [];
  const merges: MergeRange[] = [];

  pushMergedRow(rows, merges, [cleanText(data.title) || '報價單'], 6);
  rows.push(['匯出類型', 'Excel 資料表', '', '匯出日期', new Date().toISOString().slice(0, 10)]);
  pushSectionTitle(rows, merges, '報價資訊');
  rows.push(
    ['報價單標題', cleanText(data.title)],
    ['報價單編號', cleanText(data.quoteNumber)],
    ['報價日期', cleanText(data.issueDate)],
    ['有效期限', `${data.validUntilDays || 0} 天（至 ${validUntil}）`],
    ['幣別', data.currency],
  );
  rows.push([]);
  pushPartyInfo(
    rows,
    merges,
    [
      ['聯絡人', cleanText(data.issuerName)],
      ['公司名稱', cleanText(data.issuerCompany)],
      ['統編', cleanText(data.issuerTaxId)],
      ['Email', cleanText(data.issuerEmail)],
      ['電話', cleanText(data.issuerPhone)],
      ['地址', cleanText(data.issuerAddress)],
      ['網站', cleanText(data.issuerWebsite)],
    ],
    [
      ['聯絡人', cleanText(data.clientName)],
      ['公司名稱', cleanText(data.clientCompany)],
      ['統編', cleanText(data.clientTaxId)],
      ['Email', cleanText(data.clientEmail)],
      ['電話', cleanText(data.clientPhone)],
      ['地址', cleanText(data.clientAddress)],
      ['網站', cleanText(data.clientWebsite)],
    ],
  );

  pushSectionTitle(rows, merges, '報價項目');
  rows.push(
    ['序號', '品項名稱', '說明', '數量', '單位', '單價', '小計'],
    ...data.items.map((item, index) => [
      index + 1,
      cleanText(item.name),
      cleanText(item.description),
      clampNonNegative(item.quantity),
      cleanText(item.unit),
      formatCurrency(item.unitPrice, data.currency),
      formatCurrency(calculateItemSubtotal(item), data.currency),
    ]),
  );

  pushSectionTitle(rows, merges, '金額摘要');
  rows.push(
    ['欄位', '金額 / 內容'],
    ['服務費小計', formatCurrency(totals.serviceSubtotal, data.currency)],
    ['折扣', formatCurrency(totals.discountAmount, data.currency)],
    [
      '折扣後金額',
      formatCurrency(
        Math.max(0, totals.serviceSubtotal - totals.discountAmount),
        data.currency,
      ),
    ],
    ['稅率', `${taxRate}%`],
    ['稅額', formatCurrency(totals.taxAmount, data.currency)],
    ['本次報價小計', formatCurrency(totals.quoteSubtotal, data.currency)],
    ['實報實銷狀態', reimbursableEnabled ? '啟用' : '未啟用'],
    ...(reimbursableEnabled ? [['實報實銷處理方式', reimbursableTreatment]] : []),
    ...(hasReimbursableEstimate
      ? [
          [
            '實報實銷預估',
            formatCurrency(totals.reimbursableEstimate, data.currency),
          ],
        ]
      : []),
    ...(totals.estimatedTotal !== null
      ? [['預估總額', formatCurrency(totals.estimatedTotal, data.currency)]]
      : []),
  );

  pushSectionTitle(rows, merges, '備註與條款');
  rows.push(
    ['欄位', '內容'],
    ['付款方式', cleanText(data.paymentTerms)],
    ['交付說明', cleanText(data.deliveryNotes)],
    ['備註', cleanText(data.notes)],
    ['條款', cleanText(data.terms)],
    ...(reimbursableEnabled
      ? [['實報實銷說明', cleanText(data.reimbursableExpenses.description)]]
      : []),
  );

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 18 },
    { wch: 28 },
    { wch: 4 },
    { wch: 18 },
    { wch: 28 },
    { wch: 16 },
    { wch: 18 },
  ];
  worksheet['!merges'] = merges;
  XLSX.utils.book_append_sheet(workbook, worksheet, '報價單資料');

  XLSX.writeFile(workbook, getExportFileName(data), { compression: true });
}
