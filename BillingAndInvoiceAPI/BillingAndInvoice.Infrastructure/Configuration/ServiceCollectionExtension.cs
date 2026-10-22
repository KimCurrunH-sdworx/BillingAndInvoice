using BillingAndInvoice.Application.Interfaces;
using BillingAndInvoice.Application.Services;
using BillingAndInvoice.Domain.Repositories;
using BillingAndInvoice.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace BillingAndInvoice.Infrastructure.Configuration;

public static class ServiceCollectionExtension
{
    public static void RegisterServices(this IServiceCollection services)
    {
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        services.AddTransient<IInvoiceService, InvoiceService>();

        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddTransient<IClientService, ClientService>();

    }
}
