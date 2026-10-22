using BillingAndInvoice.Domain.Repositories;
using BillingAndInvoice.Infrastructure.Data;
using Domain.Entities;

namespace BillingAndInvoice.Infrastructure.Repositories;

internal class ClientRepository(InMemoryDatabase db) : IClientRepository
{
    public Task<Client> AddAsync(Client client)
    {
        client.Id = db.ClientCounter++;
        db.Clients.Add(client);
        return Task.FromResult(client);
    }

    public Task<IEnumerable<Client>> GetAllAsync()
    {
        return Task.FromResult(db.Clients.AsEnumerable());
    }

    public Task<Client?> GetByIdAsync(int id)
    {
        var client = db.Clients.FirstOrDefault(c => c.Id == id);
        return Task.FromResult(client);
    }
}
