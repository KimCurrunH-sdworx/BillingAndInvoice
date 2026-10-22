import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientService } from '../../../clients/services/client.service';
import { InvoiceService } from '../../../invoices/services/invoice.service';
import type { ClientResponse } from '../../../clients/models/client.interface';
import type { InvoiceResponse } from '../../../invoices/models/invoice.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly invoiceService = inject(InvoiceService);

  // Mark template members as public
  public readonly clients = signal<ClientResponse[]>([]);
  public readonly invoices = signal<InvoiceResponse[]>([]);
  public readonly isLoading = signal<boolean>(true);

  // --- Derived Computed Signals ---
  public readonly totalClients = computed(() => this.clients().length);
  public readonly totalInvoices = computed(() => this.invoices().length);

  public readonly totalRevenue = computed(() =>
    this.invoices().reduce((acc, inv) => acc + (inv.amountPaid || 0), 0)
  );

  public readonly totalOutstanding = computed(() =>
    this.invoices().reduce((acc, inv) => acc + (inv.amountOutstanding || 0), 0)
  );

  public readonly draftCount = computed(() =>
    this.invoices().filter((i) => i.status?.toString().toLowerCase() === 'draft').length
  );

  public readonly paidCount = computed(() =>
    this.invoices().filter((i) => i.status?.toString().toLowerCase() === 'paid').length
  );

  public readonly overdueCount = computed(() =>
    this.invoices().filter((i) => i.status?.toString().toLowerCase() === 'overdue').length
  );

  public readonly recentInvoices = computed(() =>
    [...this.invoices()].slice(0, 5)
  );

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);

    forkJoin({
      clients: this.clientService.getAll(),
      invoices: this.invoiceService.getAll()
    }).subscribe({
      next: ({ clients, invoices }) => {
        this.clients.set(clients);
        this.invoices.set(invoices);
      },
      error: (err) => console.error('Failed to load dashboard metrics:', err),
      complete: () => this.isLoading.set(false)
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