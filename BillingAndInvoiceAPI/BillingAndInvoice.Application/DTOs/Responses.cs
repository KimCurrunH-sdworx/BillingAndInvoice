namespace BillingAndInvoice.Application.DTOs;

public record ClientResponse(int Id, string FirstName, string LastName, string Email);
public record LineItemResponse(int Id, string Description, decimal UnitPrice, int Quantity, decimal LineTotal);
public record PaymentResponse(int Id, decimal Amount, DateTime PaidAt, String Reference);
public record InvoiceResponse(int Id, string InvoiceNumber, string ClientName,
    DateTime IssueDate, DateTime DueDate, string Status, decimal SubTotal, decimal VatAmount,
    decimal TotalAmount, decimal AmountPaid, decimal AmountOutstanding, 
    IEnumerable<LineItemResponse> LineItems, IEnumerable<PaymentResponse> Payments
    );