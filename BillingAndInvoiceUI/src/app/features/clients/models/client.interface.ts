export interface ClientResponse {
name: any;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export type Client = ClientResponse;// alias for convenience across components