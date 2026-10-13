using Billing.Application;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clinic.Api.Endpoints;

public static class FinanceEndpoints
{
    public static void MapFinanceEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/finances")
            .WithTags("Finances & Billing - الفواتير والإيرادات والتأمين");

        group.MapGet("/", async (
            [FromQuery] Guid? patientId,
            [FromQuery] Guid? doctorId,
            [FromQuery] string? status,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(new GetFinancialRecordsQuery(patientId, doctorId, status), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetFinancialRecords")
        .WithSummary("عرض السجلات المالية وفواتير المرضى والمطالبات التأمينية");

        group.MapPost("/", async ([FromBody] CreateFinancialRecordCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/finances/{result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("CreateFinancialRecord")
        .WithSummary("إصدار فاتورة أو سند مالي جديد");
    }
}
