import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import type { InvoiceResponse } from '../../models/invoice.interface';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss'
})
export class InvoiceList implements OnInit {
  private readonly invoiceService = inject(InvoiceService);

  public readonly invoices = signal<InvoiceResponse[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly searchFilter = signal<string>('');
  public readonly statusFilter = signal<string>('All');

  // Computed signal to handle search query and status filter tab state
  public readonly filteredInvoices = computed(() => {
    const search = this.searchFilter().toLowerCase().trim();
    const status = this.statusFilter();

    return this.invoices().filter((inv) => {
      const matchesSearch =
        !search ||
        inv.invoiceNumber.toLowerCase().includes(search) ||
        inv.clientName.toLowerCase().includes(search);

      const matchesStatus =
        status === 'All' ||
        inv.status.toString().replace(/\s/g, '').toLowerCase() === status.replace(/\s/g, '').toLowerCase();

      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit(): void {
    this.loadInvoices();
  }

  public loadInvoices(): void {
    this.isLoading.set(true);

    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.invoices.set(data ?? []);
        this.isLoading.set(false); // Clear spinner on success
      },
      error: (err) => {
        console.error('Failed to load invoices:', err);
        this.isLoading.set(false); // Clear spinner on error
      },
      complete: () => {
        this.isLoading.set(false); // Safeguard completion
      }
    });
  }

  public getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-success';
      case 'sent':
        return 'bg-info text-dark';
      case 'partiallypaid':
        return 'bg-warning text-dark';
      case 'overdue':
        return 'bg-danger';
      case 'draft':
      default:
        return 'bg-secondary';
    }
  }

  public updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchFilter.set(value);
  }

  public setFilter(status: string): void {
    this.statusFilter.set(status);
  }
}