import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceService } from '../../services/invoice.service';
import type { InvoiceResponse } from '../../models/invoice.interface';

@Component({
  selector: 'app-invoice-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.scss'
})
export class InvoiceDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly invoiceService = inject(InvoiceService);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(NgbModal);

  protected readonly invoice = signal<InvoiceResponse | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly submitError = signal<string | null>(null);

  // Form matching AddLineItemRequest(string Description, decimal UnitPrice, int Quantity)
  public itemForm: FormGroup = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(2)]],
    unitPrice: [0.1, [Validators.required, Validators.min(0.01)]],
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  // Form matching AddPaymentRequest(decimal Amount, string Reference)
  public paymentForm: FormGroup = this.fb.group({
    amount: [1, [Validators.required, Validators.min(0.01)]],
    reference: ['', [Validators.required, Validators.minLength(2)]]
  });

  public invoiceId!: number;

  public saveChanges(): void {
    this.isSubmitting.set(true);
    this.invoiceService.saveChanges(this.invoiceId).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: (err) => {
        console.error('Failed to save invoice changes:', err);
        this.isSubmitting.set(false);
        this.submitError.set('Unable to save invoice changes.');
      },
      complete: () => this.isSubmitting.set(false)
    });
  }

  ngOnInit(): void {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.invoiceId) {
      this.beginEditing();
    }
  }

  private beginEditing(): void {
    this.isLoading.set(true);
    this.invoiceService.beginEditing(this.invoiceId).subscribe({
      next: (data) => this.invoice.set(data),
      error: (err) => console.error('Failed to open invoice for editing:', err),
      complete: () => this.isLoading.set(false)
    });
  }

  protected loadInvoice(): void {
    this.isLoading.set(true);
    this.invoiceService.getById(this.invoiceId).subscribe({
      next: (data) => this.invoice.set(data),
      error: (err) => console.error('Failed to load invoice:', err),
      complete: () => this.isLoading.set(false)
    });
  }

  // --- Line Item Modal Actions ---
  public openAddItemModal(content: unknown): void {
    this.itemForm.reset({ unitPrice: 1, quantity: 1 });
    this.submitError.set(null);
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  public onAddItemSubmit(modal: { close: () => void }): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    const formVal = this.itemForm.value;
    const request = {
      description: formVal.description,
      unitPrice: Number(formVal.unitPrice),
      quantity: Number(formVal.quantity)
    };

    this.invoiceService.addLineItem(this.invoiceId, request).subscribe({
      next: () => {
        this.loadInvoice();
        modal.close();
      },
      error: (err) => {
        console.error('Failed to add line item:', err);
        this.isSubmitting.set(false);
        this.submitError.set('Unable to add the line item. Please check that the invoice service is running and try again.');
      },
      complete: () => this.isSubmitting.set(false)
    });
  }

  // --- Payment Modal Actions ---
  public openAddPaymentModal(content: unknown): void {
    const outstanding = this.invoice()?.amountOutstanding || 1;
    this.paymentForm.reset({ amount: outstanding, reference: 'Bank Transfer' });
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  public onAddPaymentSubmit(modal: { close: () => void }): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.paymentForm.value;
    const request = {
      amount: Number(formVal.amount),
      reference: formVal.reference
    };

    this.invoiceService.addPayment(this.invoiceId, request).subscribe({
      next: () => {
        this.loadInvoice();
        modal.close();
      },
      error: (err) => console.error('Failed to log payment:', err),
      complete: () => this.isSubmitting.set(false)
    });
  }

  public getStatusBadgeClass(status?: string): string {
    if (!status) return 'bg-secondary';
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-success';
      case 'sent': return 'bg-info text-dark';
      case 'overdue': return 'bg-danger';
      case 'draft': default: return 'bg-secondary';
    }
  }
}