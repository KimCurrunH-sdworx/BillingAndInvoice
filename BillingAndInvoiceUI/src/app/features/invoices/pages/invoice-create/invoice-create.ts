import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { ClientService } from '../../../clients/services/client.service';
import type { ClientResponse } from '../../../clients/models/client.interface';

@Component({
  selector: 'app-invoice-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './invoice-create.html',
  styleUrl: './invoice-create.scss'
})
export class InvoiceCreate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly invoiceService = inject(InvoiceService);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly clients = signal<ClientResponse[]>([]);
  protected readonly isLoadingClients = signal<boolean>(false);
  protected readonly isSubmitting = signal<boolean>(false);

  // Set default dates (Issue Date = today, Due Date = 30 days from today)
  private readonly todayStr = new Date().toISOString().split('T')[0];
  private readonly defaultDueStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  protected invoiceForm: FormGroup = this.fb.group({
    clientId: ['', [Validators.required]],
    issueDate: [this.todayStr, [Validators.required]],
    dueDate: [this.defaultDueStr, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadClients();

    // Check if a clientId query parameter was passed (e.g., from Client Detail page)
    const preselectedClientId = this.route.snapshot.queryParamMap.get('clientId');
    if (preselectedClientId) {
      this.invoiceForm.patchValue({ clientId: Number(preselectedClientId) });
    }
  }

  private loadClients(): void {
    this.isLoadingClients.set(true);
    this.clientService.getAll().subscribe({
      next: (data) => this.clients.set(data),
      error: (err) => console.error('Failed to load clients dropdown:', err),
      complete: () => this.isLoadingClients.set(false)
    });
  }

  protected onSubmit(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.invoiceForm.value;

    const payload = {
      clientId: Number(formValue.clientId),
      issueDate: new Date(formValue.issueDate).toISOString(),
      dueDate: new Date(formValue.dueDate).toISOString()
    };

    this.invoiceService.create(payload).subscribe({
      next: (createdInvoice) => {
        // Redirect directly to the newly created invoice hub page to add line items & payments
        this.router.navigate(['/invoices', createdInvoice.id]);
      },
      error: (err) => {
        console.error('Failed to create invoice:', err);
        this.isSubmitting.set(false);
      }
    });
  }
}