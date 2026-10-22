using BillingAndInvoice.Application.DTOs;

namespace BillingAndInvoice.Application.Interfaces;

public interface IInvoiceService
{
    Task<InvoiceResponse> CreateInvoiceAsync(CreateInvoiceRequest request);
    Task<IEnumerable<InvoiceResponse>> GetAllInvoicesAsync();
    Task<InvoiceResponse?> GetInvoiceByIdAsync(int id);
    Task<InvoiceResponse> BeginEditingAsync(int invoiceId);
    Task<InvoiceResponse> SaveChangesAsync(int invoiceId);

    Task<IEnumerable<InvoiceResponse>> GetClientInvoicesAsync(int clientID);
    Task<InvoiceResponse> AddLineItemAsync(int invoiceId, AddLineItemRequest request);
    Task RemoveLineItemAsync(int invoiceID, int lineItemId);
    Task<InvoiceResponse> MarkAsSentAsync(int invoiceId);
    Task<InvoiceResponse> AddPaymentAsync(int invoiceId, AddPaymentRequest request);
    Task<IEnumerable<InvoiceResponse>> GetOverdueInvoicesAsync();
}
