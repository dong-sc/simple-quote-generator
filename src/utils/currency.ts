import type { Currency } from '../types/quote';

const currencyPrefixes: Record<Currency, string> = {
  TWD: 'NT$',
  USD: 'USD ',
  JPY: 'JPY ',
  HKD: 'HKD ',
  CNY: 'CNY ',
};

export function parseSafeNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return 0;
    }

    const parsed = Number(trimmed.replaceAll(',', ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function clampNonNegative(value: unknown): number {
  return Math.max(0, parseSafeNumber(value));
}

export function formatCurrency(amount: number, currency: Currency): string {
  const safeAmount = clampNonNegative(amount);
  const roundedAmount = Math.round(safeAmount);
  const formattedAmount = roundedAmount.toLocaleString('en-US');

  return `${currencyPrefixes[currency]}${formattedAmount}`;
}
