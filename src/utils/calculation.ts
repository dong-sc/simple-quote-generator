import type { QuoteData, QuoteItem, Totals } from '../types/quote';
import { clampNonNegative, parseSafeNumber } from './currency';

export function calculateItemSubtotal(item: QuoteItem): number {
  const quantity = clampNonNegative(item.quantity);
  const unitPrice = clampNonNegative(item.unitPrice);

  return quantity * unitPrice;
}

export function calculateTotals(data: QuoteData): Totals {
  const serviceSubtotal = data.items.reduce(
    (sum, item) => sum + calculateItemSubtotal(item),
    0,
  );
  const discountAmount = clampNonNegative(data.discountAmount);
  const taxableAmount = Math.max(0, serviceSubtotal - discountAmount);
  const taxRate = clampNonNegative(data.taxRate);
  const taxAmount = taxableAmount * (taxRate / 100);
  const quoteSubtotal = taxableAmount + taxAmount;
  const reimbursableEstimate = data.reimbursableExpenses.hasEstimate
    ? clampNonNegative(parseSafeNumber(data.reimbursableExpenses.estimatedAmount))
    : 0;
  const estimatedTotal =
    data.reimbursableExpenses.enabled && data.reimbursableExpenses.hasEstimate
      ? quoteSubtotal + reimbursableEstimate
      : null;

  return {
    serviceSubtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    quoteSubtotal,
    reimbursableEstimate,
    estimatedTotal,
  };
}
