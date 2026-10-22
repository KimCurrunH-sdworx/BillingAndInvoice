using BillingAndInvoice.Domain.Repositories;
using BillingAndInvoice.Infrastructure.Data;
using Domain.Entities;
using Domain.Enums;

namespace BillingAndInvoice.Infrastructure.Repositories;

internal class InvoiceRepository(InMemoryDatabase db) : IInvoiceRepository
{
    public Task<Invoice> AddAsync(Invoice invoice)
    {
        invoice.Id = db.InvoiceCounter++;
        db.Invoices.Add(invoice);
        return Task.FromResult(invoice);
    }

    public Task<string> GenerateInvoiceNumberAsync()
    {
        // Zero-padded format: INV-0001
        var number = $"INV-{db.InvoiceCounter:D4}";
        return Task.FromResult(number);
    }

    public Task<Invoice?> GetByIdAsync(int id)
    {
        var invoice = db.Invoices.FirstOrDefault(i => i.Id == id);
        return Task.FromResult(invoice);
    }

    public Task<IEnumerable<Invoice>> GetAllAsync()
    {
        return Task.FromResult(db.Invoices.AsEnumerable());
    }

    public Task<IEnumerable<Invoice>> GetByClientIdAsync(int clientId)
    {
        var invoices = db.Invoices.Where(i => i.ClientId == clientId);
        return Task.FromResult(invoices.AsEnumerable());
    }

    public Task<IEnumerable<Invoice>> GetOverdueAsync()
    {
        var now = DateTime.UtcNow;
        var invoices = db.Invoices.Where(i =>
            i.Status != InvoiceStatus.Paid &&
            i.DueDate < now);

        return Task.FromResult(invoices.AsEnumerable());
    }

    public Task UpdateAsync(Invoice invoice)
    {
        foreach (var item in invoice.LineItems.Where(i => i.Id == 0))
        {
            item.Id = db.LineItemCounter++;
            item.InvoiceId = invoice.Id;
        }
        foreach (var payment in invoice.Payments.Where(p => p.Id == 0))
        {
            payment.Id = db.PaymentCounter++;
            payment.InvoiceId = invoice.Id;
        }
        return Task.CompletedTask;
    }
}
