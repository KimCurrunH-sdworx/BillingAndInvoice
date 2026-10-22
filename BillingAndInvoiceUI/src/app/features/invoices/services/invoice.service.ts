import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/services/base.service';
import { environment } from '../../../../environments/environment';
import type { 
  InvoiceResponse, 
  CreateInvoiceRequest, 
  AddLineItemRequest, 
  AddPaymentRequest 
} from '../models/invoice.interface';

@Injectable({ providedIn: 'root' })
export class InvoiceService extends BaseService<InvoiceResponse, CreateInvoiceRequest> {
  protected override readonly resourceUrl = `${environment.apiBaseUrl}/invoice`;

  // Custom endpoint to add line items to an existing invoice
  addLineItem(invoiceId: number, request: AddLineItemRequest) {
    return this.http.post<InvoiceResponse>(`${this.resourceUrl}/${invoiceId}/line-items`, request);
  }

  // Custom endpoint to add payments to an existing invoice
  addPayment(invoiceId: number, request: AddPaymentRequest) {
    return this.http.post(`${this.resourceUrl}/${invoiceId}/payments`, request);
  }

  beginEditing(invoiceId: number) {
    return this.http.put<InvoiceResponse>(`${this.resourceUrl}/${invoiceId}/edit`, {});
  }

  saveChanges(invoiceId: number) {
    return this.http.put<InvoiceResponse>(`${this.resourceUrl}/${invoiceId}/save`, {});
  }
}