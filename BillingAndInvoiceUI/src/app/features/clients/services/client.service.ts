import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/services/base.service';
import { environment } from '../../../../environments/environment';
import type { ClientResponse, CreateClientRequest } from '../models/client.interface';

@Injectable({ providedIn: 'root' })
export class ClientService extends BaseService<ClientResponse, CreateClientRequest> {
  // Point directly to your backend Client controller endpoint
  protected override readonly resourceUrl = `${environment.apiBaseUrl}/client`;
}