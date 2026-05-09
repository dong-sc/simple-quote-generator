export type Currency = 'TWD' | 'USD' | 'JPY' | 'HKD' | 'CNY';
export type NumericInputValue = number | '';
export type ReimbursableTaxTreatment = 'separate' | 'included';

export interface QuoteItem {
  id: string;
  category: string;
  name: string;
  description: string;
  quantity: NumericInputValue;
  unit: string;
  unitPrice: NumericInputValue;
}

export interface ReimbursableExpenses {
  enabled: boolean;
  description: string;
  hasEstimate: boolean;
  estimatedAmount: NumericInputValue;
  taxTreatment: ReimbursableTaxTreatment;
}

export interface QuoteData {
  title: string;
  quoteNumber: string;
  issueDate: string;
  validUntilDays: NumericInputValue;
  currency: Currency;
  issuerName: string;
  issuerCompany: string;
  issuerTaxId: string;
  issuerEmail: string;
  issuerPhone: string;
  issuerAddress: string;
  issuerWebsite: string;
  issuerLogoImage: string;
  clientName: string;
  clientCompany: string;
  clientTaxId: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientWebsite: string;
  items: QuoteItem[];
  discountAmount: NumericInputValue;
  taxRate: NumericInputValue;
  reimbursableExpenses: ReimbursableExpenses;
  paymentTerms: string;
  deliveryNotes: string;
  notes: string;
  terms: string;
  issuerSignatureImage: string;
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
