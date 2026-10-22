using Domain.Enums;

namespace Domain.Entities;

public class Invoice
{
    public Client? Client;

    public int Id { get; set; }
    public int ClientId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;   // e.g. "INV-0001"
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public InvoiceStatus Status { get; set; }

    public List<InvoiceLineItem> LineItems { get; set; } = [];
    public List<Payment> Payments { get; set; } = [];

    public decimal Subtotal => LineItems.Sum(li => li.LineTotal);
    public decimal VatAmount => Subtotal * 0.20m;
    public decimal TotalDue => Subtotal + VatAmount;
    public decimal AmountPaid => Payments.Sum(p => p.Amount);
    public decimal AmountOutstanding => TotalDue - AmountPaid;

    public void RecalculateStatus()
    {
        if (TotalDue > 0 && AmountOutstanding <= 0)
        {
            Status = InvoiceStatus.Paid;
        }
        else if (AmountOutstanding > 0 && DueDate < DateTime.UtcNow)
        {
            Status = InvoiceStatus.Overdue;
        }
        else if (AmountPaid > 0 && AmountOutstanding > 0)
        {
            Status = InvoiceStatus.PartiallyPaid;
        }
    }
}
