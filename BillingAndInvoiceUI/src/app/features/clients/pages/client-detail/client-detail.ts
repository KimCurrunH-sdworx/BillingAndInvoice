import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import type { ClientResponse } from '../../models/client.interface';

@Component({
  selector: 'app-client-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss'
})
export class ClientDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);

  protected readonly client = signal<ClientResponse | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    if (clientId) {
      this.loadClient(clientId);
    } else {
      this.errorMessage.set('Invalid Client ID');
      this.isLoading.set(false);
    }
  }

  private loadClient(id: number): void {
    this.isLoading.set(true);
    this.clientService.getById(id).subscribe({
      next: (data) => this.client.set(data),
      error: (err) => {
        console.error('Failed to fetch client details:', err);
        this.errorMessage.set('Could not load client details.');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}