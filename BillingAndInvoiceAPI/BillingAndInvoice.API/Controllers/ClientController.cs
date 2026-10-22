using BillingAndInvoice.Application.DTOs;
using BillingAndInvoice.Application.Services;
using BillingAndInvoice.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Domain.Entities;

namespace BillingAndInvoice.API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ClientController
{
    [HttpGet]
    public async Task<IActionResult> GetAllClients([FromServices] IClientService clientService)
    {
        try
        {
            var result = await clientService.GetAllClientAsync();
            return new OkObjectResult(result);
        }
        catch (ArgumentException ex)
        {
            return new BadRequestObjectResult(ex.Message);
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetClientById(int id, [FromServices] IClientService clientService)
    {
        try
        {
            var result = await clientService.GetClientByIdAsync(id);
            if (result == null)
            {
                return new NotFoundResult();
            }
            return new OkObjectResult(result);
        }
        catch (ArgumentException ex)
        {
            return new BadRequestObjectResult(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateClient([FromBody] CreateClientRequest request, [FromServices] IClientService clientService)
    {
        try
        {
            var result = await clientService.CreateClientAsync(request);
            return new CreatedAtActionResult(nameof(GetClientById), "Client", new { id = result.Id }, result);
        }
        catch (ArgumentException ex) { return new BadRequestObjectResult(ex.Message); }
    }
}
