import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- Add this import
import { ClientService } from './features/clients/services/client.service';
import type { Client } from './features/clients/models/client.interface';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly clientService = inject(ClientService);
  
  protected readonly clients = signal<Client[]>([]);
  protected readonly isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadClients();
  }

  private loadClients(): void {
    this.isLoading.set(true);
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients.set(data);
        console.log('Successfully fetched clients from API:', data);
      },
      error: (err) => console.error('API Error:', err),
      complete: () => this.isLoading.set(false)
    });
  }
}