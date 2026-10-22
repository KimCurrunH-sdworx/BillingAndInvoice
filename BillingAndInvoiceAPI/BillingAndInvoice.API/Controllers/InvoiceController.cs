using BillingAndInvoice.Application.DTOs;
using BillingAndInvoice.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BillingAndInvoice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoiceController(IInvoiceService invoiceService) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetAllInvoices()
    {
        var result = await invoiceService.GetAllInvoicesAsync();
        return Ok(result);
    }

    [HttpGet("client/{clientId}")]
    public async Task<IActionResult> GetClientInvoices(int clientId)
    {
        var result = await invoiceService.GetClientInvoicesAsync(clientId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        var result = await invoiceService.GetInvoiceByIdAsync(id);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("{id}/edit")]
    public async Task<IActionResult> BeginEditing(int id)
    {
        try
        {
            return Ok(await invoiceService.BeginEditingAsync(id));
        }
        catch (ArgumentException ex) { return NotFound(ex.Message); }
    }

    [HttpPut("{id}/save")]
    public async Task<IActionResult> SaveChanges(int id)
    {
        try
        {
            return Ok(await invoiceService.SaveChangesAsync(id));
        }
        catch (ArgumentException ex) { return NotFound(ex.Message); }
    }

    [HttpGet("overdue")]
    public async Task<IActionResult> GetOverdueInvoices()
    {
        var result = await invoiceService.GetOverdueInvoicesAsync();
        return Ok(result);
    }
    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        try
        {
            var result = await invoiceService.CreateInvoiceAsync(request);
            return CreatedAtAction(nameof(GetInvoice), new { id = result.Id }, result);
        }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
    }


    [HttpPost("{id}/line-items")]
    public async Task<IActionResult> AddLineItem(int id, [FromBody] AddLineItemRequest request)
    {
        try
        {
            var result = await invoiceService.AddLineItemAsync(id, request);
            return Ok(result);
        }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpPost("{id}/payments")]
    public async Task<IActionResult> AddPayment(int id, [FromBody] AddPaymentRequest request)
    {
        try
        {
            var result = await invoiceService.AddPaymentAsync(id, request);
            return Ok(result);
        }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpPut("{id}/send")]
    public async Task<IActionResult> SendInvoice(int id)
    {
        try
        {
            var result = await invoiceService.MarkAsSentAsync(id);
            return Ok(result);
        }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpDelete("{id}/line-items/{lineItemId}")]
    public async Task<IActionResult> RemoveLineItem(int id, int lineItemId)
    {
        try
        {
            await invoiceService.RemoveLineItemAsync(id, lineItemId);
            return NoContent();
        }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }


}
