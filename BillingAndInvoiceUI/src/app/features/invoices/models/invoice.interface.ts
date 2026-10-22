// src/app/features/invoices/models/invoice.interface.ts
import { InvoiceStatus } from './invoice-status';

// --- Requests (Matching Requests.cs) ---

export interface CreateInvoiceRequest {
  clientId: number;
  issueDate: string;
  dueDate: string;
}

export interface AddLineItemRequest {
  description: string;
  unitPrice: number;
  quantity: number;
}

export interface AddPaymentRequest {
  amount: number;
  reference: string;
}

// --- Responses (Matching Responses.cs) ---

export interface LineItemResponse {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PaymentResponse {
  id: number;
  amount: number;
  paidAt: string;
  reference: string;
}

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus | string;
  subTotal: number;
  vatAmount: number;
  totalAmount: number;
  amountPaid: number;
  amountOutstanding: number;
  lineItems: LineItemResponse[];
  payments: PaymentResponse[];
}

// Alias for convenience across components
export type Invoice = InvoiceResponse;