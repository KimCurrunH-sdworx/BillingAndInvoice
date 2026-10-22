using BillingAndInvoice.Application.DTOs;

namespace BillingAndInvoice.Application.Interfaces;

public interface IClientService
{
    Task<ClientResponse> CreateClientAsync(CreateClientRequest request);
    Task<IEnumerable<ClientResponse>> GetAllClientAsync();
    Task<ClientResponse> GetClientByIdAsync(int id);
}
