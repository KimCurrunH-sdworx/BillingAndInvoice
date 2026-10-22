using Domain.Entities;

namespace BillingAndInvoice.Domain.Repositories;

public interface IClientRepository
{
    Task<Client> AddAsync(Client client);
    Task<IEnumerable<Client>> GetAllAsync();
    Task<Client?> GetByIdAsync(int id);
}
