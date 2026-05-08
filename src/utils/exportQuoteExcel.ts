import type { Cell, Worksheet } from 'exceljs';
import type { QuoteData, Totals } from '../types/quote';
import { calculateItemSubtotal } from './calculation';
import { clampNonNegative, formatCurrency } from './currency';
import { addDays } from './date';

type CellValue = string | number;
type BorderStyle = 'thin' | 'medium';

const documentDark = '1F2B24';
const mutedFill = 'F5F5F2';
const lineColor = 'C9CBC2';
const totalFill = 'EEF2EA';

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

function applyFont(cell: Cell, options: Partial<NonNullable<Cell['font']>>): void {
  cell.font = { name: 'Noto Sans TC', ...cell.font, ...options };
}

function applyFill(cell: Cell, color: string): void {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: color },
  };
}

function applyBorder(cell: Cell, style: BorderStyle = 'thin'): void {
  const border = { style, color: { argb: lineColor } };
  cell.border = {
    top: border,
    right: border,
    bottom: border,
    left: border,
  };
}

function styleRange(
  worksheet: Worksheet,
  startRow: number,
  endRow: number,
  startColumn = 1,
  endColumn = 8,
  callback: (cell: Cell) => void,
): void {
  for (let rowNumber = startRow; rowNumber <= endRow; rowNumber += 1) {
    for (let columnNumber = startColumn; columnNumber <= endColumn; columnNumber += 1) {
      callback(worksheet.getCell(rowNumber, columnNumber));
    }
  }
}

function setRowValues(
  worksheet: Worksheet,
  rowNumber: number,
  values: CellValue[],
): void {
  worksheet.getRow(rowNumber).values = [undefined, ...values];
}

function addSectionTitle(
  worksheet: Worksheet,
  rowNumber: number,
  title: string,
): void {
  worksheet.mergeCells(rowNumber, 1, rowNumber, 8);
  const cell = worksheet.getCell(rowNumber, 1);
  cell.value = title;
  applyFill(cell, documentDark);
  applyFont(cell, { color: { argb: 'FFFFFF' }, bold: true, size: 12 });
  cell.alignment = { vertical: 'middle' };
  worksheet.getRow(rowNumber).height = 24;
}

function addKeyValueRow(
  worksheet: Worksheet,
  rowNumber: number,
  label: string,
  value: CellValue,
  startColumn = 1,
  endColumn = 4,
): void {
  const labelCell = worksheet.getCell(rowNumber, startColumn);
  const valueCell = worksheet.getCell(rowNumber, startColumn + 1);
  labelCell.value = label;
  valueCell.value = value;
  worksheet.mergeCells(rowNumber, startColumn + 1, rowNumber, endColumn);
  applyFont(labelCell, { bold: true, color: { argb: '555951' } });
  valueCell.alignment = { wrapText: true, vertical: 'top' };
}

function addPartyBlock(
  worksheet: Worksheet,
  startRow: number,
  leftTitle: string,
  rightTitle: string,
  leftRows: CellValue[][],
  rightRows: CellValue[][],
): number {
  worksheet.mergeCells(startRow, 1, startRow, 4);
  worksheet.mergeCells(startRow, 5, startRow, 8);
  worksheet.getCell(startRow, 1).value = leftTitle;
  worksheet.getCell(startRow, 5).value = rightTitle;
  styleRange(worksheet, startRow, startRow, 1, 8, (cell) => {
    applyFill(cell, mutedFill);
    applyFont(cell, { bold: true, color: { argb: documentDark } });
    cell.alignment = { vertical: 'middle' };
    applyBorder(cell);
  });

  const rowCount = Math.max(leftRows.length, rightRows.length);
  for (let index = 0; index < rowCount; index += 1) {
    const rowNumber = startRow + index + 1;
    const leftRow = leftRows[index] ?? ['', ''];
    const rightRow = rightRows[index] ?? ['', ''];
    setRowValues(worksheet, rowNumber, [
      leftRow[0],
      leftRow[1],
      '',
      '',
      rightRow[0],
      rightRow[1],
      '',
      '',
    ]);
    worksheet.mergeCells(rowNumber, 2, rowNumber, 4);
    worksheet.mergeCells(rowNumber, 6, rowNumber, 8);
    applyFont(worksheet.getCell(rowNumber, 1), { bold: true, color: { argb: '555951' } });
    applyFont(worksheet.getCell(rowNumber, 5), { bold: true, color: { argb: '555951' } });
    styleRange(worksheet, rowNumber, rowNumber, 1, 8, (cell) => {
      applyBorder(cell);
      cell.alignment = { wrapText: true, vertical: 'top' };
    });
  }

  return startRow + rowCount + 1;
}

function addTable(
  worksheet: Worksheet,
  startRow: number,
  headers: CellValue[],
  rows: CellValue[][],
): number {
  setRowValues(worksheet, startRow, headers);
  worksheet.getRow(startRow).height = 22;
  styleRange(worksheet, startRow, startRow, 1, headers.length, (cell) => {
    applyFill(cell, mutedFill);
    applyFont(cell, { bold: true, color: { argb: documentDark } });
    applyBorder(cell);
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });

  rows.forEach((row, index) => {
    const rowNumber = startRow + index + 1;
    setRowValues(worksheet, rowNumber, row);
    worksheet.getRow(rowNumber).height = 30;
    styleRange(worksheet, rowNumber, rowNumber, 1, headers.length, (cell) => {
      applyBorder(cell);
      cell.alignment = { vertical: 'top', wrapText: true };
    });
  });

  return startRow + rows.length + 1;
}

function addTotalsBlock(
  worksheet: Worksheet,
  startRow: number,
  rows: CellValue[][],
): number {
  rows.forEach((row, index) => {
    const rowNumber = startRow + index;
    setRowValues(worksheet, rowNumber, ['', '', '', '', row[0], '', row[1], '']);
    worksheet.mergeCells(rowNumber, 5, rowNumber, 6);
    worksheet.mergeCells(rowNumber, 7, rowNumber, 8);
    const labelCell = worksheet.getCell(rowNumber, 5);
    const valueCell = worksheet.getCell(rowNumber, 7);
    applyFont(labelCell, { bold: true, color: { argb: '555951' } });
    applyFont(valueCell, { bold: index === rows.length - 1, color: { argb: documentDark } });
    valueCell.alignment = { horizontal: 'right' };
    styleRange(worksheet, rowNumber, rowNumber, 5, 8, (cell) => {
      applyBorder(cell);
      if (index === rows.length - 1) {
        applyFill(cell, totalFill);
      }
    });
  });

  return startRow + rows.length;
}

function addWideNote(
  worksheet: Worksheet,
  rowNumber: number,
  label: string,
  value: string,
): number {
  setRowValues(worksheet, rowNumber, [label, value, '', '', '', '', '', '']);
  worksheet.mergeCells(rowNumber, 2, rowNumber, 8);
  worksheet.getRow(rowNumber).height = Math.max(24, Math.ceil(value.length / 48) * 18);
  applyFont(worksheet.getCell(rowNumber, 1), { bold: true, color: { argb: '555951' } });
  styleRange(worksheet, rowNumber, rowNumber, 1, 8, (cell) => {
    applyBorder(cell);
    cell.alignment = { wrapText: true, vertical: 'top' };
  });

  return rowNumber + 1;
}

function downloadWorkbook(buffer: ArrayBuffer, fileName: string): void {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function exportQuoteExcel(
  data: QuoteData,
  totals: Totals,
): Promise<void> {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Simple Quote Generator';
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet('報價單資料', {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.35,
        right: 0.35,
        top: 0.45,
        bottom: 0.45,
        header: 0.2,
        footer: 0.2,
      },
    },
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  worksheet.columns = [
    { width: 13 },
    { width: 17 },
    { width: 24 },
    { width: 8 },
    { width: 12 },
    { width: 16 },
    { width: 17 },
    { width: 12 },
  ];

  const validUntil = addDays(data.issueDate, data.validUntilDays);
  const taxRate = clampNonNegative(data.taxRate);
  const reimbursableEnabled = data.reimbursableExpenses.enabled;
  const hasReimbursableEstimate =
    reimbursableEnabled && data.reimbursableExpenses.hasEstimate;
  const reimbursableTreatment =
    data.reimbursableExpenses.taxTreatment === 'included'
      ? '併入報價金額計算稅額'
      : '另列，不納入本次服務費稅額計算';

  worksheet.mergeCells(1, 1, 1, 5);
  worksheet.getCell(1, 1).value = cleanText(data.title) || '報價單';
  applyFont(worksheet.getCell(1, 1), { bold: true, size: 24, color: { argb: documentDark } });
  worksheet.getCell(1, 1).alignment = { vertical: 'middle' };
  worksheet.mergeCells(1, 6, 1, 8);
  worksheet.getCell(1, 6).value = 'Quotation';
  applyFont(worksheet.getCell(1, 6), { bold: true, size: 12, color: { argb: '767A71' } });
  worksheet.getCell(1, 6).alignment = { horizontal: 'right', vertical: 'middle' };
  worksheet.getRow(1).height = 34;

  addKeyValueRow(worksheet, 3, '報價單編號', cleanText(data.quoteNumber), 1, 4);
  addKeyValueRow(worksheet, 3, '報價日期', cleanText(data.issueDate), 5, 8);
  addKeyValueRow(worksheet, 4, '有效至', validUntil, 1, 4);
  addKeyValueRow(worksheet, 4, '幣別', data.currency, 5, 8);

  let rowNumber = 6;
  rowNumber = addPartyBlock(
    worksheet,
    rowNumber,
    '報價方',
    '客戶',
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

  rowNumber += 1;
  addSectionTitle(worksheet, rowNumber, '報價項目');
  rowNumber += 1;
  rowNumber = addTable(
    worksheet,
    rowNumber,
    ['序號', '品項名稱', '說明', '數量', '單位', '單價', '小計', ''],
    data.items.map((item, index) => [
      index + 1,
      cleanText(item.name),
      cleanText(item.description),
      clampNonNegative(item.quantity),
      cleanText(item.unit),
      formatCurrency(item.unitPrice, data.currency),
      formatCurrency(calculateItemSubtotal(item), data.currency),
      '',
    ]),
  );

  rowNumber += 1;
  addSectionTitle(worksheet, rowNumber, '金額摘要');
  rowNumber += 1;
  const totalsRows: CellValue[][] = [
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
  ];
  if (reimbursableEnabled) {
    totalsRows.push(['實報實銷處理方式', reimbursableTreatment]);
  }
  if (hasReimbursableEstimate) {
    totalsRows.push([
      '實報實銷預估',
      formatCurrency(totals.reimbursableEstimate, data.currency),
    ]);
  }
  if (totals.estimatedTotal !== null) {
    totalsRows.push(['預估總額', formatCurrency(totals.estimatedTotal, data.currency)]);
  }
  rowNumber = addTotalsBlock(worksheet, rowNumber, totalsRows);

  rowNumber += 1;
  addSectionTitle(worksheet, rowNumber, '備註與條款');
  rowNumber += 1;
  rowNumber = addWideNote(worksheet, rowNumber, '付款方式', cleanText(data.paymentTerms));
  rowNumber = addWideNote(worksheet, rowNumber, '交付說明', cleanText(data.deliveryNotes));
  rowNumber = addWideNote(worksheet, rowNumber, '備註', cleanText(data.notes));
  rowNumber = addWideNote(worksheet, rowNumber, '條款', cleanText(data.terms));
  if (reimbursableEnabled) {
    rowNumber = addWideNote(
      worksheet,
      rowNumber,
      '實報實銷說明',
      cleanText(data.reimbursableExpenses.description),
    );
  }

  worksheet.getCell(rowNumber + 1, 1).value = '此 Excel 為資料表匯出，正式對外文件仍建議使用列印 / PDF。';
  worksheet.mergeCells(rowNumber + 1, 1, rowNumber + 1, 8);
  applyFont(worksheet.getCell(rowNumber + 1, 1), { italic: true, color: { argb: '767A71' } });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadWorkbook(buffer as ArrayBuffer, getExportFileName(data));
}
