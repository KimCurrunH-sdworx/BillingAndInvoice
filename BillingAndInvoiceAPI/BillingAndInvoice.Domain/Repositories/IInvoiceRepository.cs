using Domain.Entities;

namespace BillingAndInvoice.Domain.Repositories;

public interface IInvoiceRepository
{
    Task<Invoice> AddAsync(Invoice invoice);
    Task<IEnumerable<Invoice>> GetAllAsync();
    Task<Invoice?> GetByIdAsync(int id);
    Task<IEnumerable<Invoice>> GetByClientIdAsync(int clientId);
    Task<IEnumerable<Invoice>> GetOverdueAsync();
    Task UpdateAsync(Invoice invoice);
    Task<string> GenerateInvoiceNumberAsync();
}
