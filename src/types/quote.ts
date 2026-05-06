export type Currency = 'TWD' | 'USD' | 'JPY' | 'HKD' | 'CNY';

export interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface ReimbursableExpenses {
  enabled: boolean;
  description: string;
  hasEstimate: boolean;
  estimatedAmount: number;
}

export interface QuoteData {
  title: string;
  quoteNumber: string;
  issueDate: string;
  validUntilDays: number;
  currency: Currency;
  issuerName: string;
  issuerTaxId: string;
  issuerEmail: string;
  issuerPhone: string;
  issuerAddress: string;
  issuerWebsite: string;
  clientName: string;
  clientCompany: string;
  clientTaxId: string;
  clientEmail: string;
  clientPhone: string;
  items: QuoteItem[];
  discountAmount: number;
  taxRate: number;
  reimbursableExpenses: ReimbursableExpenses;
  paymentTerms: string;
  deliveryNotes: string;
  notes: string;
  terms: string;
}

export interface Totals {
  serviceSubtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  quoteSubtotal: number;
  reimbursableEstimate: number;
  estimatedTotal: number | null;
}
