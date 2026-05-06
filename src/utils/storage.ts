import type { QuoteData } from '../types/quote';
import { createDefaultQuoteData } from './defaultQuote';

const storageKey = 'simple-quote-generator.quote-data';

function normalizeQuoteData(value: unknown): QuoteData {
  const fallback = createDefaultQuoteData();

  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const data = value as Partial<QuoteData>;
  const issuerCompany =
    data.issuerCompany ??
    (!data.issuerTaxId && !data.issuerEmail && !data.issuerPhone
      ? (data.issuerName ?? '')
      : '');

  return {
    ...fallback,
    ...data,
    issuerCompany,
    items:
      Array.isArray(data.items) && data.items.length > 0
        ? data.items.map((item) => ({ ...fallback.items[0], ...item }))
        : fallback.items,
    reimbursableExpenses: {
      ...fallback.reimbursableExpenses,
      ...data.reimbursableExpenses,
    },
  };
}

export function loadQuoteData(): QuoteData {
  try {
    const storedValue = localStorage.getItem(storageKey);
    if (!storedValue) {
      return createDefaultQuoteData();
    }

    return normalizeQuoteData(JSON.parse(storedValue));
  } catch {
    return createDefaultQuoteData();
  }
}

export function saveQuoteData(data: QuoteData): void {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export function clearQuoteData(): QuoteData {
  localStorage.removeItem(storageKey);
  return createDefaultQuoteData();
}
