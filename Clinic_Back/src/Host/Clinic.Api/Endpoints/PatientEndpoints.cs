using MediatR;
using Microsoft.AspNetCore.Mvc;
using Patients.Application;

namespace Clinic.Api.Endpoints;

public static class PatientEndpoints
{
    public static void MapPatientEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/patients")
            .WithTags("Patients - بوابة وملف المريض");

        group.MapGet("/me", async ([FromQuery] Guid? patientId, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetPatientProfileQuery(patientId), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("GetPatientProfile")
        .WithSummary("عرض الملف الطبي والبيانات الشخصية للمريض الحالي");

        group.MapPut("/me", async ([FromBody] UpdatePatientProfileCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("UpdatePatientProfile")
        .WithSummary("تحديث الملف الطبي والبيانات الشخصية للمريض");

        group.MapGet("/me/vitals", async ([FromQuery] Guid? patientId, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetPatientVitalsQuery(patientId), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetPatientVitals")
        .WithSummary("عرض سجل المؤشرات الحيوية وضغط الدم والسكر للمريض");

        group.MapPost("/me/vitals", async ([FromBody] AddVitalRecordCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/patients/me/vitals/{result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("AddPatientVitalRecord")
        .WithSummary("تسجيل قياس مؤشرات حيوية جديدة للمريض");

        group.MapGet("/me/notifications", async ([FromQuery] Guid? patientId, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetPatientNotificationsQuery(patientId), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetPatientNotifications")
        .WithSummary("عرض الإشعارات وتنبيهات المواعيد والتحاليل");

        group.MapPut("/me/notifications/{id:guid}/read", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new MarkNotificationReadCommand(id), ct);
            return result.IsSuccess ? Results.Ok(new { success = true }) : Results.NotFound(result.Error);
        })
        .WithName("MarkNotificationRead")
        .WithSummary("تحديد إشعار كمقروء");

        group.MapPut("/me/notifications/read-all", async ([FromQuery] Guid? patientId, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new MarkAllNotificationsReadCommand(patientId), ct);
            return result.IsSuccess ? Results.Ok(new { success = true }) : Results.BadRequest(result.Error);
        })
        .WithName("MarkAllNotificationsRead")
        .WithSummary("تحديد جميع الإشعارات كمقروءة");
    }
}
