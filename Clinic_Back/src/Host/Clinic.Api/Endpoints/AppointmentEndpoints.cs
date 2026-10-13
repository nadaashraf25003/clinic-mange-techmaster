using Appointments.Application;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clinic.Api.Endpoints;

public static class AppointmentEndpoints
{
    public static void MapAppointmentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/appointments")
            .WithTags("Appointments - حجوزات المواعيد والعيادات");

        group.MapGet("/", async (
            [FromQuery] Guid? patientId,
            [FromQuery] Guid? doctorId,
            [FromQuery] string? status,
            [FromQuery] string? date,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(new GetAppointmentsQuery(patientId, doctorId, status, date), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetAppointments")
        .WithSummary("عرض المواعيد مع إمكانية الفلترة بالمريض أو الطبيب أو التاريخ أو الحالة");

        group.MapGet("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetAppointmentByIdQuery(id), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("GetAppointmentById")
        .WithSummary("عرض تفاصيل حجز موعد محدد");

        group.MapPost("/quick-book", async ([FromBody] QuickBookAppointmentCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("QuickBookAppointment")
        .WithSummary("حجز موعد سريع من الصفحة الرئيسية للعيادة");

        group.MapPost("/book", async ([FromBody] BookPatientAppointmentCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/appointments/{result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("BookPatientAppointment")
        .WithSummary("حجز موعد جديد من بوابة المريض أو لوحة الإدارة");

        group.MapPost("/{id:guid}/cancel", async (Guid id, [FromBody] CancelAppointmentRequest? req, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CancelAppointmentCommand(id, req?.Reason), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("CancelAppointment")
        .WithSummary("إلغاء حجز موعد مع تحديد السبب");

        group.MapPost("/{id:guid}/reschedule", async (Guid id, [FromBody] RescheduleAppointmentRequest req, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new RescheduleAppointmentCommand(id, req.NewDate, req.NewTime), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("RescheduleAppointment")
        .WithSummary("تعديل تاريخ وتوقيت حجز موعد");

        group.MapPut("/{id:guid}/status", async (Guid id, [FromBody] UpdateAppointmentStatusRequest req, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new UpdateAppointmentStatusCommand(id, req.Status), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("UpdateAppointmentStatus")
        .WithSummary("تحديث حالة الموعد (upcoming, completed, cancelled)");

        group.MapDelete("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new DeleteAppointmentCommand(id), ct);
            return result.IsSuccess ? Results.NoContent() : Results.NotFound(result.Error);
        })
        .WithName("DeleteAppointment")
        .WithSummary("حذف موعد من النظام");
    }
}

public record CancelAppointmentRequest(string? Reason);
public record RescheduleAppointmentRequest(string NewDate, string NewTime);
public record UpdateAppointmentStatusRequest(string Status);
