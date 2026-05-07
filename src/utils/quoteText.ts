import type { QuoteData, Totals } from '../types/quote';
import { addDays } from './date';
import { calculateItemSubtotal } from './calculation';
import { clampNonNegative, formatCurrency } from './currency';

function optionalLine(label: string, value: string): string[] {
  return value.trim() ? [`${label}：${value.trim()}`] : [];
}

export function generateQuotePlainText(data: QuoteData, totals: Totals): string {
  const validUntil = addDays(data.issueDate, data.validUntilDays);
  const taxRate = clampNonNegative(data.taxRate);
  const taxLabel = taxRate > 0 ? `稅額（${taxRate}%）` : '稅額（未稅 / 免稅）';
  const itemLines = data.items.map((item, index) => {
    const name = item.name.trim() || `品項 ${index + 1}`;
    const description = item.description.trim()
      ? `，說明：${item.description.trim()}`
      : '';
    const subtotal = formatCurrency(calculateItemSubtotal(item), data.currency);

    return `${index + 1}. ${name}${description}，數量：${item.quantity || 0} ${
      item.unit || ''
    }，單價：${formatCurrency(item.unitPrice || 0, data.currency)}，小計：${subtotal}`;
  });

  const reimbursableLines = data.reimbursableExpenses.enabled
    ? [
        '',
        '實報實銷',
        data.reimbursableExpenses.hasEstimate
          ? `實報實銷預估：${formatCurrency(
              totals.reimbursableEstimate,
              data.currency,
            )}`
          : '實報實銷：另計，依實際支出憑證請款',
        ...(totals.estimatedTotal !== null
          ? [
              `預估總額：${formatCurrency(
                totals.estimatedTotal,
                data.currency,
              )}`,
            ]
          : []),
        ...optionalLine('實報實銷說明', data.reimbursableExpenses.description),
      ]
    : [];

  return [
    data.title,
    ...optionalLine('報價單編號', data.quoteNumber),
    '',
    '報價方',
    ...optionalLine('聯絡人', data.issuerName),
    ...optionalLine('公司名稱', data.issuerCompany),
    ...optionalLine('統編', data.issuerTaxId),
    ...optionalLine('Email', data.issuerEmail),
    ...optionalLine('電話', data.issuerPhone),
    ...optionalLine('地址', data.issuerAddress),
    ...optionalLine('網站', data.issuerWebsite),
    '',
    '客戶',
    ...optionalLine('聯絡人', data.clientName),
    ...optionalLine('公司名稱', data.clientCompany),
    ...optionalLine('統編', data.clientTaxId),
    ...optionalLine('Email', data.clientEmail),
    ...optionalLine('電話', data.clientPhone),
    ...optionalLine('地址', data.clientAddress),
    ...optionalLine('網站', data.clientWebsite),
    '',
    `報價日期：${data.issueDate}`,
    `有效期限：${data.validUntilDays} 天（至 ${validUntil}）`,
    '',
    '報價項目',
    ...itemLines,
    '',
    `服務費小計：${formatCurrency(totals.serviceSubtotal, data.currency)}`,
    `折扣：${formatCurrency(totals.discountAmount, data.currency)}`,
    `${taxLabel}：${formatCurrency(totals.taxAmount, data.currency)}`,
    `本次報價小計：${formatCurrency(totals.quoteSubtotal, data.currency)}`,
    ...reimbursableLines,
    '',
    ...optionalLine('付款方式', data.paymentTerms),
    ...optionalLine('交付說明', data.deliveryNotes),
    ...optionalLine('備註', data.notes),
    ...optionalLine('條款', data.terms),
  ]
    .filter((line, index, lines) => !(line === '' && lines[index - 1] === ''))
    .join('\n');
}
