import type { QuoteData } from '../types/quote';
import { createDefaultQuoteData } from './defaultQuote';

const storageKey = 'simple-quote-generator.quote-data';

// Do not let mount autosave overwrite a draft that could not be read.
let preserveUnreadDraft = false;
let expectedStoredValue: string | null | undefined;

function normalizeQuoteData(value: unknown): QuoteData {
  const fallback = createDefaultQuoteData();

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid stored draft');
  }

  if ('title' in value && typeof value.title !== 'string') {
    throw new Error('Invalid stored draft title');
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
    discountEnabled:
      typeof data.discountEnabled === 'boolean' ? data.discountEnabled : true,
    showSignatures:
      typeof data.showSignatures === 'boolean' ? data.showSignatures : true,
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
    expectedStoredValue = storedValue;
    if (!storedValue) {
      return createDefaultQuoteData();
    }

    return normalizeQuoteData(JSON.parse(storedValue));
  } catch {
    preserveUnreadDraft = true;
    return createDefaultQuoteData();
  }
}

export function saveQuoteData(data: QuoteData): boolean {
  if (preserveUnreadDraft) return false;

  try {
    // Best-effort conflict detection; localStorage has no atomic compare-and-swap.
    if (localStorage.getItem(storageKey) !== expectedStoredValue) {
      preserveUnreadDraft = true;
      return false;
    }
    const serialized = JSON.stringify(data);
    localStorage.setItem(storageKey, serialized);
    expectedStoredValue = serialized;
    return true;
  } catch {
    // Keep the current document usable when browser storage is unavailable or full.
    return false;
  }
}

export function clearQuoteData(): QuoteData {
  // An explicit reset authorizes replacing an unread draft.
  preserveUnreadDraft = false;
  try {
    localStorage.removeItem(storageKey);
    expectedStoredValue = null;
  } catch {
    // Reset the in-memory document even when browser storage is unavailable.
  }
  return createDefaultQuoteData();
}
