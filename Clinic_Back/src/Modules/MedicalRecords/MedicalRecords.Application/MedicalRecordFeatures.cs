using BuildingBlocks.Application.CQRS;
using BuildingBlocks.Domain;
using BuildingBlocks.Infrastructure.Persistence;
using FluentValidation;
using MedicalRecords.Domain;
using Microsoft.EntityFrameworkCore;

namespace MedicalRecords.Application;

public record PrescriptionDto(
    Guid Id,
    string PrescriptionNumber,
    Guid? AppointmentId,
    Guid? PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    string DoctorSpecialty,
    string DoctorImage,
    string Date,
    string Diagnosis,
    string Notes,
    string? NextVisitDate,
    List<MedicationItem> Medications);

public record LabReportDto(
    Guid Id,
    string ReportNumber,
    Guid? PatientId,
    string PatientName,
    string TestName,
    string Category,
    string Date,
    string OrderedByDoctor,
    string Status,
    string Summary,
    List<LabResultItem> Results);

public record ConsultationNoteDto(
    Guid Id,
    Guid? AppointmentId,
    Guid? PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    string Date,
    string ChiefComplaint,
    string Diagnosis,
    string ClinicalNotes,
    List<string> OrderedLabTests,
    string? PrescriptionNumber,
    string? NextFollowUpDate);

// Queries
public record GetPrescriptionsQuery(Guid? PatientId = null, Guid? DoctorId = null, Guid? AppointmentId = null) : IQuery<List<PrescriptionDto>>;

public class GetPrescriptionsQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetPrescriptionsQuery, List<PrescriptionDto>>
{
    public async Task<Result<List<PrescriptionDto>>> Handle(GetPrescriptionsQuery request, CancellationToken cancellationToken)
    {
        var query = context.Prescriptions.AsNoTracking().AsQueryable();

        if (request.PatientId.HasValue && request.PatientId.Value != Guid.Empty)
        {
            query = query.Where(p => p.PatientId == request.PatientId.Value);
        }

        if (request.DoctorId.HasValue && request.DoctorId.Value != Guid.Empty)
        {
            query = query.Where(p => p.DoctorId == request.DoctorId.Value);
        }

        if (request.AppointmentId.HasValue && request.AppointmentId.Value != Guid.Empty)
        {
            query = query.Where(p => p.AppointmentId == request.AppointmentId.Value);
        }

        var list = await query
            .OrderByDescending(p => p.Date)
            .Select(p => new PrescriptionDto(
                p.Id,
                p.PrescriptionNumber,
                p.AppointmentId,
                p.PatientId,
                p.PatientName,
                p.DoctorId,
                p.DoctorName,
                p.DoctorSpecialty,
                p.DoctorImage,
                p.Date,
                p.Diagnosis,
                p.Notes,
                p.NextVisitDate,
                p.Medications))
            .ToListAsync(cancellationToken);

        return Result.Success(list);
    }
}

public record GetPrescriptionByIdQuery(Guid Id) : IQuery<PrescriptionDto>;

public class GetPrescriptionByIdQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetPrescriptionByIdQuery, PrescriptionDto>
{
    public async Task<Result<PrescriptionDto>> Handle(GetPrescriptionByIdQuery request, CancellationToken cancellationToken)
    {
        var p = await context.Prescriptions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (p is null)
            return Result.Failure<PrescriptionDto>(Error.NotFound("Prescription.NotFound", "الروشتة غير موجودة"));

        return Result.Success(new PrescriptionDto(
            p.Id,
            p.PrescriptionNumber,
            p.AppointmentId,
            p.PatientId,
            p.PatientName,
            p.DoctorId,
            p.DoctorName,
            p.DoctorSpecialty,
            p.DoctorImage,
            p.Date,
            p.Diagnosis,
            p.Notes,
            p.NextVisitDate,
            p.Medications));
    }
}

public record GetLabReportsQuery(Guid? PatientId = null) : IQuery<List<LabReportDto>>;

public class GetLabReportsQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetLabReportsQuery, List<LabReportDto>>
{
    public async Task<Result<List<LabReportDto>>> Handle(GetLabReportsQuery request, CancellationToken cancellationToken)
    {
        var query = context.LabReports.AsNoTracking().AsQueryable();

        if (request.PatientId.HasValue && request.PatientId.Value != Guid.Empty)
        {
            query = query.Where(l => l.PatientId == request.PatientId.Value);
        }

        var list = await query
            .OrderByDescending(l => l.Date)
            .Select(l => new LabReportDto(
                l.Id,
                l.ReportNumber,
                l.PatientId,
                l.PatientName,
                l.TestName,
                l.Category,
                l.Date,
                l.OrderedByDoctor,
                l.Status,
                l.Summary,
                l.Results))
            .ToListAsync(cancellationToken);

        return Result.Success(list);
    }
}

public record GetLabReportByIdQuery(Guid Id) : IQuery<LabReportDto>;

public class GetLabReportByIdQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetLabReportByIdQuery, LabReportDto>
{
    public async Task<Result<LabReportDto>> Handle(GetLabReportByIdQuery request, CancellationToken cancellationToken)
    {
        var l = await context.LabReports.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (l is null)
            return Result.Failure<LabReportDto>(Error.NotFound("LabReport.NotFound", "تقرير التحليل غير موجود"));

        return Result.Success(new LabReportDto(
            l.Id,
            l.ReportNumber,
            l.PatientId,
            l.PatientName,
            l.TestName,
            l.Category,
            l.Date,
            l.OrderedByDoctor,
            l.Status,
            l.Summary,
            l.Results));
    }
}

// Commands
public record CreatePrescriptionCommand(
    Guid? AppointmentId,
    Guid? PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    string DoctorSpecialty,
    string DoctorImage,
    string Diagnosis,
    string Notes,
    string? NextVisitDate,
    List<MedicationItem>? Medications,
    string? SimpleMedicinesText = null) : ICommand<PrescriptionDto>;

public class CreatePrescriptionCommandHandler(ClinicDbContext context)
    : ICommandHandler<CreatePrescriptionCommand, PrescriptionDto>
{
    public async Task<Result<PrescriptionDto>> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        var rxNum = $"RX-2026-{Random.Shared.Next(1000, 9999)}";

        var meds = request.Medications ?? [];
        if (meds.Count == 0 && !string.IsNullOrWhiteSpace(request.SimpleMedicinesText))
        {
            meds.Add(new MedicationItem
            {
                Name = request.SimpleMedicinesText,
                Dosage = "حسب إرشادات الطبيب",
                Frequency = "يومياً",
                Duration = "مستمر",
                Instructions = request.Notes
            });
        }

        var prescription = new Prescription
        {
            PrescriptionNumber = rxNum,
            AppointmentId = request.AppointmentId,
            PatientId = request.PatientId,
            PatientName = request.PatientName,
            DoctorId = request.DoctorId,
            DoctorName = request.DoctorName,
            DoctorSpecialty = request.DoctorSpecialty,
            DoctorImage = request.DoctorImage,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Diagnosis = request.Diagnosis,
            Notes = request.Notes,
            NextVisitDate = request.NextVisitDate,
            Medications = meds
        };

        context.Prescriptions.Add(prescription);

        // Link with appointment if exists
        if (request.AppointmentId.HasValue)
        {
            var apt = await context.Appointments.FindAsync([request.AppointmentId.Value], cancellationToken);
            if (apt != null)
            {
                apt.Status = "completed";
                apt.QueueStatus = "completed";
                apt.DiagnosisSummary = request.Diagnosis;
                apt.PrescriptionId = prescription.Id.ToString();
            }
        }

        if (request.PatientId.HasValue)
        {
            context.Notifications.Add(new Patients.Domain.PatientNotification
            {
                PatientId = request.PatientId.Value,
                Title = "روشتة علاجية جديدة",
                Message = $"أصدر {request.DoctorName} روشتة علاجية جديدة لحالتك.",
                Date = "الآن",
                Type = "prescription",
                Read = false
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new PrescriptionDto(
            prescription.Id,
            prescription.PrescriptionNumber,
            prescription.AppointmentId,
            prescription.PatientId,
            prescription.PatientName,
            prescription.DoctorId,
            prescription.DoctorName,
            prescription.DoctorSpecialty,
            prescription.DoctorImage,
            prescription.Date,
            prescription.Diagnosis,
            prescription.Notes,
            prescription.NextVisitDate,
            prescription.Medications));
    }
}

public record CreateConsultationNoteCommand(
    Guid? AppointmentId,
    Guid? PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    string ChiefComplaint,
    string Diagnosis,
    string ClinicalNotes,
    List<string> OrderedLabTests,
    string? PrescriptionNumber,
    string? NextFollowUpDate) : ICommand<ConsultationNoteDto>;

public class CreateConsultationNoteCommandHandler(ClinicDbContext context)
    : ICommandHandler<CreateConsultationNoteCommand, ConsultationNoteDto>
{
    public async Task<Result<ConsultationNoteDto>> Handle(CreateConsultationNoteCommand request, CancellationToken cancellationToken)
    {
        var note = new ConsultationNote
        {
            AppointmentId = request.AppointmentId,
            PatientId = request.PatientId,
            PatientName = request.PatientName,
            DoctorId = request.DoctorId,
            DoctorName = request.DoctorName,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            ChiefComplaint = request.ChiefComplaint,
            Diagnosis = request.Diagnosis,
            ClinicalNotes = request.ClinicalNotes,
            OrderedLabTests = request.OrderedLabTests,
            PrescriptionNumber = request.PrescriptionNumber,
            NextFollowUpDate = request.NextFollowUpDate
        };

        context.ConsultationNotes.Add(note);

        if (request.AppointmentId.HasValue)
        {
            var apt = await context.Appointments.FindAsync([request.AppointmentId.Value], cancellationToken);
            if (apt != null)
            {
                apt.Status = "completed";
                apt.QueueStatus = "completed";
                apt.DiagnosisSummary = request.Diagnosis;
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new ConsultationNoteDto(
            note.Id,
            note.AppointmentId,
            note.PatientId,
            note.PatientName,
            note.DoctorId,
            note.DoctorName,
            note.Date,
            note.ChiefComplaint,
            note.Diagnosis,
            note.ClinicalNotes,
            note.OrderedLabTests,
            note.PrescriptionNumber,
            note.NextFollowUpDate));
    }
}
