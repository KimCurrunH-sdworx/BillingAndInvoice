using Domain.Entities;

namespace BillingAndInvoice.Infrastructure.Data;

public class InMemoryDatabase
{
    public List<Client> Clients { get; } = [];
    public List<Invoice> Invoices { get; } = [];

    public int ClientCounter { get; set; } = 1;
    public int InvoiceCounter { get; set; } = 1;
    public int LineItemCounter { get; set; } = 1;
    public int PaymentCounter { get; set; } = 1;
}
