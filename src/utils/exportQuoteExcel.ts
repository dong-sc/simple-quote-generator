import type { WorkBook } from 'xlsx';
import type { QuoteData, Totals } from '../types/quote';
import { calculateItemSubtotal } from './calculation';
import { clampNonNegative, formatCurrency } from './currency';
import { addDays } from './date';

type CellValue = string | number;
type XlsxModule = typeof import('xlsx');

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function safeFilePart(value: string): string {
  return cleanText(value).replace(/[\\/:*?"<>|]/g, '-');
}

function appendSheet(
  XLSX: XlsxModule,
  workbook: WorkBook,
  name: string,
  rows: CellValue[][],
): void {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
}

function fieldRows(title: string, rows: CellValue[][]): CellValue[][] {
  return [[title, ''], ...rows, ['', '']];
}

function getExportFileName(data: QuoteData): string {
  const date = cleanText(data.issueDate) || new Date().toISOString().slice(0, 10);
  const clientName = safeFilePart(data.clientName || data.clientCompany);
  const datePart = safeFilePart(date);

  return clientName
    ? `報價單_${clientName}_${datePart}.xlsx`
    : `報價單_${datePart}.xlsx`;
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

  appendSheet(XLSX, workbook, '報價資訊', [
    ['欄位', '內容'],
    ['報價單標題', cleanText(data.title)],
    ['報價單編號', cleanText(data.quoteNumber)],
    ['報價日期', cleanText(data.issueDate)],
    ['有效期限', `${data.validUntilDays || 0} 天（至 ${validUntil}）`],
    ['幣別', data.currency],
    ['', ''],
    ...fieldRows('報價方資訊', [
      ['聯絡人', cleanText(data.issuerName)],
      ['公司名稱', cleanText(data.issuerCompany)],
      ['統編', cleanText(data.issuerTaxId)],
      ['Email', cleanText(data.issuerEmail)],
      ['電話', cleanText(data.issuerPhone)],
      ['地址', cleanText(data.issuerAddress)],
      ['網站', cleanText(data.issuerWebsite)],
    ]),
    ...fieldRows('客戶資訊', [
      ['聯絡人', cleanText(data.clientName)],
      ['公司名稱', cleanText(data.clientCompany)],
      ['統編', cleanText(data.clientTaxId)],
      ['Email', cleanText(data.clientEmail)],
      ['電話', cleanText(data.clientPhone)],
      ['地址', cleanText(data.clientAddress)],
      ['網站', cleanText(data.clientWebsite)],
    ]),
  ]);

  appendSheet(XLSX, workbook, '報價項目', [
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
  ]);

  appendSheet(XLSX, workbook, '金額摘要', [
    ['欄位', '金額 / 內容'],
    ['服務費小計', formatCurrency(totals.serviceSubtotal, data.currency)],
    ['折扣', formatCurrency(totals.discountAmount, data.currency)],
    ['折扣後金額', formatCurrency(Math.max(0, totals.serviceSubtotal - totals.discountAmount), data.currency)],
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
  ]);

  appendSheet(XLSX, workbook, '備註與條款', [
    ['欄位', '內容'],
    ['付款方式', cleanText(data.paymentTerms)],
    ['交付說明', cleanText(data.deliveryNotes)],
    ['備註', cleanText(data.notes)],
    ['條款', cleanText(data.terms)],
    ...(reimbursableEnabled
      ? [['實報實銷說明', cleanText(data.reimbursableExpenses.description)]]
      : []),
  ]);

  XLSX.writeFile(workbook, getExportFileName(data), { compression: true });
}
