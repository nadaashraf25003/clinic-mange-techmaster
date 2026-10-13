using BuildingBlocks.Domain;
using Departments.Application;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clinic.Api.Endpoints;

public static class DepartmentEndpoints
{
    public static void MapDepartmentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/departments")
            .WithTags("Departments - الأقسام والعيادات");

        group.MapGet("/", async (ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetDepartmentsQuery(), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetDepartments")
        .WithSummary("عرض جميع الأقسام الطبية والعيادات المتخصصة");

        group.MapGet("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetDepartmentByIdQuery(id), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("GetDepartmentById")
        .WithSummary("عرض تفاصيل قسم طبي محدد");

        group.MapPost("/", async ([FromBody] CreateDepartmentCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/departments/{result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("CreateDepartment")
        .WithSummary("إضافة قسم أو عيادة جديدة");

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateDepartmentCommand command, ISender sender, CancellationToken ct) =>
        {
            if (id != command.Id)
            {
                command = command with { Id = id };
            }
            var result = await sender.Send(command, ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("UpdateDepartment")
        .WithSummary("تعديل بيانات قسم طبي");

        group.MapDelete("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new DeleteDepartmentCommand(id), ct);
            return result.IsSuccess ? Results.NoContent() : Results.NotFound(result.Error);
        })
        .WithName("DeleteDepartment")
        .WithSummary("حذف قسم طبي");
    }
}
