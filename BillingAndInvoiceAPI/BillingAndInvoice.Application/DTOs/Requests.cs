using System.ComponentModel.DataAnnotations;

namespace BillingAndInvoice.Application.DTOs;

public record CreateClientRequest(
    [Required(ErrorMessage = "First name is required.")]
    [RegularExpression(@"^[a-zA-Z\s'-]+$", ErrorMessage = "First name can only contain letters, spaces, hyphens, and apostrophes.")]
    string FirstName,

    [Required(ErrorMessage = "Last name is required.")]
    [RegularExpression(@"^[a-zA-Z\s'-]+$", ErrorMessage = "Last name can only contain letters, spaces, hyphens, and apostrophes.")]
    string LastName,

    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Email must be a valid format (e.g., name@email.com).")]
    [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Email must follow format name@email.com.")]
    string Email);
public record CreateInvoiceRequest(int ClientId, DateTime IssueDate, DateTime DueDate);
public record AddLineItemRequest(
    [Required(ErrorMessage = "Description is required.")]
    string Description,

    [Required(ErrorMessage = "Unit price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0 and cannot be negative.")]
    decimal UnitPrice,

    [Required(ErrorMessage = "Quantity is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
    int Quantity);
public record AddPaymentRequest([Required(ErrorMessage = "Amount paid is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Payment amount must be greater than 0 and cannot be negative.")]
    decimal Amount,
    [StringLength(100,ErrorMessage = "Reference cannot exceed 100 characters.")]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_]+$",ErrorMessage = "Reference may only contain letters, numbers, spaces, hyphens, and underscores.")]
    string Reference);
