using Doctors.Application;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clinic.Api.Endpoints;

public static class DoctorEndpoints
{
    public static void MapDoctorEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/doctors")
            .WithTags("Doctors - الأطباء والاستشاريين");

        group.MapGet("/", async (
            [FromQuery] Guid? departmentId,
            [FromQuery] string? departmentCode,
            [FromQuery] string? search,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(new GetDoctorsQuery(departmentId, departmentCode, search), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetDoctors")
        .WithSummary("عرض قائمة الأطباء مع إمكانية الفلترة بالقسم أو البحث بالاسم");

        group.MapGet("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetDoctorByIdQuery(id), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("GetDoctorById")
        .WithSummary("عرض الملف التعريفي الكامل للطبيب");

        group.MapGet("/{id:guid}/queue", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetDoctorQueueQuery(id), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetDoctorQueue")
        .WithSummary("عرض طابور الانتظار وحالات المرضى لليوم الحالي للطبيب");

        group.MapGet("/{id:guid}/finances", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetDoctorFinancesQuery(id), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetDoctorFinances")
        .WithSummary("عرض إحصائيات الدخل المالي وجلسات الكشف للطبيب");

        group.MapPost("/", async ([FromBody] CreateDoctorCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/doctors/{result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("CreateDoctor")
        .WithSummary("إضافة طبيب جديد إلى المنظومة الطبية");

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateDoctorCommand command, ISender sender, CancellationToken ct) =>
        {
            if (id != command.Id)
            {
                command = command with { Id = id };
            }
            var result = await sender.Send(command, ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("UpdateDoctor")
        .WithSummary("تعديل بيانات وملف الطبيب");

        group.MapPut("/{id:guid}/toggle-status", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new ToggleDoctorStatusCommand(id), ct);
            return result.IsSuccess ? Results.Ok(new { isActive = result.Value }) : Results.NotFound(result.Error);
        })
        .WithName("ToggleDoctorStatus")
        .WithSummary("تفعيل أو تعطيل حساب الطبيب في المنظومة");

        group.MapPut("/{id:guid}/fee", async (Guid id, [FromBody] UpdateDoctorFeeRequest req, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new UpdateDoctorFeeCommand(id, req.NewFee), ct);
            return result.IsSuccess ? Results.Ok(new { newFee = result.Value }) : Results.NotFound(result.Error);
        })
        .WithName("UpdateDoctorFee")
        .WithSummary("تحديث سعر كشف الطبيب");

        group.MapDelete("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new DeleteDoctorCommand(id), ct);
            return result.IsSuccess ? Results.NoContent() : Results.NotFound(result.Error);
        })
        .WithName("DeleteDoctor")
        .WithSummary("حذف طبيب من المنظومة");
    }
}

public record UpdateDoctorFeeRequest(decimal NewFee);
