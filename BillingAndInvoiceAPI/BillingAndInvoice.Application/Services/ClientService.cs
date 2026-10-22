using BillingAndInvoice.Application.DTOs;
using BillingAndInvoice.Application.Interfaces;
using BillingAndInvoice.Domain.Repositories;
using Domain.Entities;

namespace BillingAndInvoice.Application.Services;

public class ClientService(IClientRepository clientRepository) : IClientService
{
    public async Task<ClientResponse> CreateClientAsync(CreateClientRequest request)
    {
        var client = new Client
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            ContactEmail = request.Email
        };

        var created = await clientRepository.AddAsync(client);
        return new ClientResponse(created.Id, created.FirstName, created.LastName, created.ContactEmail);
    }

    public async Task<IEnumerable<ClientResponse>> GetAllClientAsync()
    {
        var clients = await clientRepository.GetAllAsync();
        return clients.Select(c => new ClientResponse(c.Id, c.FirstName, c.LastName, c.ContactEmail));
    }

    public async Task<ClientResponse> GetClientByIdAsync(int id)
    {
        var client = await clientRepository.GetByIdAsync(id);
        if (client == null)
            throw new KeyNotFoundException($"Client with id {id} was not found.");

        return new ClientResponse(client.Id, client.FirstName, client.LastName, client.ContactEmail);
    }

}
