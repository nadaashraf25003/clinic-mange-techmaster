using MedicalRecords.Application;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clinic.Api.Endpoints;

public static class MedicalRecordEndpoints
{
    public static void MapMedicalRecordEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/medical-records")
            .WithTags("Medical Records - الروشتات والتحاليل والملاحظات الطبية");

        // Prescriptions
        group.MapGet("/prescriptions", async (
            [FromQuery] Guid? patientId,
            [FromQuery] Guid? doctorId,
            [FromQuery] Guid? appointmentId,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(new GetPrescriptionsQuery(patientId, doctorId, appointmentId), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetPrescriptions")
        .WithSummary("عرض قائمة الروشتات الطبية مع تفاصيل الأدوية والجرعات");

        group.MapGet("/prescriptions/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetPrescriptionByIdQuery(id), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("GetPrescriptionById")
        .WithSummary("عرض تفاصيل روشتة طبية محددة");

        group.MapPost("/prescriptions", async ([FromBody] CreatePrescriptionCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/medical-records/prescriptions/{result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("CreatePrescription")
        .WithSummary("إصدار روشتة علاجية جديدة للمريض");

        // Lab Reports
        group.MapGet("/lab-reports", async ([FromQuery] Guid? patientId, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetLabReportsQuery(patientId), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetLabReports")
        .WithSummary("عرض قائمة تقارير التحاليل الطبية والأشعة");

        group.MapGet("/lab-reports/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetLabReportByIdQuery(id), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("GetLabReportById")
        .WithSummary("عرض نتائج ومؤشرات تقرير معملي محدد");

        // Consultations
        group.MapPost("/consultations", async ([FromBody] CreateConsultationNoteCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/medical-records/consultations/{result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("CreateConsultationNote")
        .WithSummary("حفظ ملاحظات الكشف والتشخيص الطبي للطبيب");
    }
}
