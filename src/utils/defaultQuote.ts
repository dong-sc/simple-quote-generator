import type { QuoteData, QuoteItem } from '../types/quote';
import { getTodayString } from './date';

export const defaultReimbursableDescription =
  '交通、住宿、材料或其他代墊費用，依實際支出憑證另行請款。';

export const termTemplates = [
  '報價有效期限內確認後方可保留檔期。',
  '專案內容若有新增或變更，將依實際需求另行報價。',
  '款項確認後開始執行專案。',
  '報價未包含未列明之額外服務。',
  '實報實銷項目將依實際支出憑證另行請款。',
  '如需開立發票，請提前提供完整抬頭與統編資訊。',
];

export function createEmptyItem(): QuoteItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    quantity: 1,
    unit: '式',
    unitPrice: 0,
  };
}

export function createDefaultQuoteData(): QuoteData {
  return {
    title: '報價單',
    quoteNumber: '',
    issueDate: getTodayString(),
    validUntilDays: 14,
    currency: 'TWD',
    issuerName: '',
    issuerCompany: '',
    issuerTaxId: '',
    issuerEmail: '',
    issuerPhone: '',
    issuerAddress: '',
    issuerWebsite: '',
    clientName: '',
    clientCompany: '',
    clientTaxId: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientWebsite: '',
    items: [createEmptyItem()],
    discountAmount: 0,
    taxRate: 5,
    reimbursableExpenses: {
      enabled: false,
      description: defaultReimbursableDescription,
      hasEstimate: false,
      estimatedAmount: 0,
    },
    paymentTerms: '',
    deliveryNotes: '',
    notes: '',
    terms: '',
  };
}
