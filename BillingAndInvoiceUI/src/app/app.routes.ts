// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard')
      .then(m => m.Dashboard) 
  },
  { 
    path: 'clients', 
    loadComponent: () => import('./features/clients/pages/client-list/client-list')
      .then(m => m.ClientList) 
  },
  { 
    path: 'clients/:id', 
    loadComponent: () => import('./features/clients/pages/client-detail/client-detail')
      .then(m => m.ClientDetail) 
  },
  { 
    path: 'invoices', 
    loadComponent: () => import('./features/invoices/pages/invoice-list/invoice-list')
      .then(m => m.InvoiceList) 
  },
  { 
    path: 'invoices/new', 
    loadComponent: () => import('./features/invoices/pages/invoice-create/invoice-create')
      .then(m => m.InvoiceCreate) 
  },
  { 
    path: 'invoices/:id', 
    loadComponent: () => import('./features/invoices/pages/invoice-detail/invoice-detail')
      .then(m => m.InvoiceDetail) 
  },
  { path: '**', redirectTo: 'dashboard' }
];