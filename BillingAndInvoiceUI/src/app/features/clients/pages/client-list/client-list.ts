import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../services/client.service';
import type { Client, CreateClientRequest } from '../../models/client.interface';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss'
})
export class ClientList implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(NgbModal);

  public readonly clients = signal<Client[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly searchFilter = signal<string>('');
  public readonly filteredClients = computed(() => {
    const search = this.searchFilter().trim().toLowerCase();

    if (!search) {
      return this.clients();
    }

    return this.clients().filter((client) =>
      [client.name, client.firstName, client.lastName, client.email]
        .filter((value) => value != null)
        .some((value) => value.toString().toLowerCase().includes(search))
    );
  });

  // Reactive Form with Validation rules
  public clientForm: FormGroup = this.fb.group({
    firstName: ['', [
    Validators.required, 
    Validators.pattern(/^[a-zA-Z\s'-]+$/)
  ]],
  lastName: ['', [
    Validators.required, 
    Validators.pattern(/^[a-zA-Z\s'-]+$/)
  ]],
  // Strict Email pattern: Ensures name@domain.ext format
  email: ['', [
    Validators.required, 
    Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ]]
  });

  ngOnInit(): void {
    this.loadClients();
  }

  protected loadClients(): void {
    this.isLoading.set(true);
    this.clientService.getAll().subscribe({
      next: (data) => this.clients.set(data),
      error: (err) => console.error('Failed to load clients:', err),
      complete: () => this.isLoading.set(false)
    });
  }

  public openCreateModal(content: unknown): void {
    this.clientForm.reset();
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  public updateSearch(event: Event): void {
    this.searchFilter.set((event.target as HTMLInputElement).value);
  }

  public onSubmit(modal: { close: () => void }): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const formValue = this.clientForm.value;
  
    const payload: CreateClientRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email
    };

    this.clientService.create(payload).subscribe({
      next: () => {
        this.loadClients();
        modal.close();
      },
      error: (err) => console.error('Validation/Server Error:', err)
    });
  }
}