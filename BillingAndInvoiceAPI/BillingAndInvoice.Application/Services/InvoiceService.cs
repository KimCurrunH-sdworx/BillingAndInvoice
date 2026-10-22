using BillingAndInvoice.Application.DTOs;
using BillingAndInvoice.Application.Interfaces;
using BillingAndInvoice.Domain.Repositories;
using Domain.Entities;
using Domain.Enums;
namespace BillingAndInvoice.Application.Services;

public class InvoiceService(IInvoiceRepository invoiceRepository, IClientRepository clientRepository): IInvoiceService
{
    public async Task<InvoiceResponse> CreateInvoiceAsync(CreateInvoiceRequest request)
    {
        var client = await clientRepository.GetByIdAsync(request.ClientId)
            ?? throw new ArgumentException("Client not found");

        var invoiceNumber = await invoiceRepository.GenerateInvoiceNumberAsync();

        var invoice = new Invoice
        {
            ClientId = request.ClientId,
            Client = client,
            InvoiceNumber = invoiceNumber,
            IssueDate = request.IssueDate,
            DueDate = request.DueDate,
            Status = InvoiceStatus.Draft
        };

        var created = await invoiceRepository.AddAsync(invoice);
        return MapToResponse(created);
    }

    public async Task<InvoiceResponse?> GetInvoiceByIdAsync(int id)
    {
        var invoice = await invoiceRepository.GetByIdAsync(id);
        if (invoice == null) return null;

        invoice.RecalculateStatus(); // Refresh status based on time (Overdue logic)
        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse> BeginEditingAsync(int invoiceId)
    {
        var invoice = await invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new ArgumentException("Invoice not found");

        invoice.Status = InvoiceStatus.Draft;
        await invoiceRepository.UpdateAsync(invoice);
        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse> SaveChangesAsync(int invoiceId)
    {
        var invoice = await invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new ArgumentException("Invoice not found");

        invoice.RecalculateStatus();
        await invoiceRepository.UpdateAsync(invoice);
        return MapToResponse(invoice);
    }

    public async Task<IEnumerable<InvoiceResponse>> GetAllInvoicesAsync()
    {
        var invoices = await invoiceRepository.GetAllAsync();
        foreach (var invoice in invoices)
        {
            invoice.RecalculateStatus();
        }

        return invoices.Select(MapToResponse);
    }

    public async Task<IEnumerable<InvoiceResponse>> GetClientInvoicesAsync(int clientId)
    {
        var invoices = await invoiceRepository.GetByClientIdAsync(clientId);
        foreach (var inv in invoices) inv.RecalculateStatus();
        return invoices.Select(MapToResponse);
    }

    public async Task<InvoiceResponse> AddLineItemAsync(int invoiceId, AddLineItemRequest request)
    {
        var invoice = await invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new ArgumentException("Invoice not found");

        if (invoice.Status != InvoiceStatus.Draft)
            throw new InvalidOperationException("Line items can only be added to Draft invoices.");

        var lineItem = new InvoiceLineItem
        {
            Description = request.Description,
            UnitPrice = request.UnitPrice,
            Quantity = request.Quantity
        };

        invoice.LineItems.Add(lineItem);
        await invoiceRepository.UpdateAsync(invoice);

        return MapToResponse(invoice);
    }

    public async Task RemoveLineItemAsync(int invoiceId, int lineItemId)
    {
        var invoice = await invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new ArgumentException("Invoice not found");

        if (invoice.Status != InvoiceStatus.Draft)
            throw new InvalidOperationException("Line items can only be removed from Draft invoices.");

        var item = invoice.LineItems.FirstOrDefault(li => li.Id == lineItemId);
        if (item != null)
        {
            invoice.LineItems.Remove(item);
            await invoiceRepository.UpdateAsync(invoice);
        }
    }

    public async Task<InvoiceResponse> MarkAsSentAsync(int invoiceId)
    {
        var invoice = await invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new ArgumentException("Invoice not found");

        if (!invoice.LineItems.Any())
            throw new InvalidOperationException("Cannot send an invoice without line items.");

        invoice.Status = InvoiceStatus.Sent;
        await invoiceRepository.UpdateAsync(invoice);

        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse> AddPaymentAsync(int invoiceId, AddPaymentRequest request)
    {
        var invoice = await invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new ArgumentException("Invoice not found");

        var payment = new Payment
        {
            Amount = request.Amount,
            Reference = request.Reference,
            PaidAt = DateTime.UtcNow
        };

        invoice.Payments.Add(payment);

        await invoiceRepository.UpdateAsync(invoice);
        return MapToResponse(invoice);
    }

    public async Task<IEnumerable<InvoiceResponse>> GetOverdueInvoicesAsync()
    {
        var invoices = await invoiceRepository.GetOverdueAsync();
        foreach (var inv in invoices) inv.RecalculateStatus(); // Ensure fresh check
        return invoices.Where(i => i.Status == InvoiceStatus.Overdue).Select(MapToResponse);
    }

    private static InvoiceResponse MapToResponse(Invoice invoice)
    {
        return new InvoiceResponse(
            invoice.Id,
            invoice.InvoiceNumber,
            invoice.Client?.FirstName ?? "Unknown",
            invoice.IssueDate,
            invoice.DueDate,
            invoice.Status.ToString(),
            invoice.Subtotal,
            invoice.VatAmount,
            invoice.TotalDue,
            invoice.AmountPaid,
            invoice.AmountOutstanding,
            invoice.LineItems.Select(li => new LineItemResponse(li.Id, li.Description, li.UnitPrice, li.Quantity, li.LineTotal)),
            invoice.Payments.Select(p => new PaymentResponse(p.Id, p.Amount, p.PaidAt, p.Reference))
        );
    }
}
