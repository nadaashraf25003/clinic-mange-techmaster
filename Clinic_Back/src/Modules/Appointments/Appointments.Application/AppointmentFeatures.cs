using Appointments.Domain;
using BuildingBlocks.Application.CQRS;
using BuildingBlocks.Domain;
using BuildingBlocks.Infrastructure.Persistence;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Appointments.Application;

public record AppointmentDto(
    Guid Id,
    string BookingReference,
    Guid? PatientId,
    string PatientName,
    string PatientPhone,
    string? PatientEmail,
    int PatientAge,
    string PatientGender,
    string BloodType,
    Guid DoctorId,
    string DoctorName,
    string DoctorSpecialty,
    string DoctorImage,
    Guid DepartmentId,
    string DepartmentName,
    string Date,
    string Time,
    string Status,
    string QueueStatus,
    int QueueNumber,
    string RoomNumber,
    decimal ConsultationFee,
    string PaymentStatus,
    string? Notes,
    string? ChiefComplaint,
    string? DiagnosisSummary,
    string? PrescriptionId);

public record QuickBookResponseDto(
    bool Success,
    string Message,
    string BookingReference,
    Guid AppointmentId);

// Queries
public record GetAppointmentsQuery(
    Guid? PatientId = null,
    Guid? DoctorId = null,
    string? Status = null,
    string? Date = null) : IQuery<List<AppointmentDto>>;

public class GetAppointmentsQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetAppointmentsQuery, List<AppointmentDto>>
{
    public async Task<Result<List<AppointmentDto>>> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
    {
        var query = context.Appointments.AsNoTracking().AsQueryable();

        if (request.PatientId.HasValue && request.PatientId.Value != Guid.Empty)
        {
            query = query.Where(a => a.PatientId == request.PatientId.Value);
        }

        if (request.DoctorId.HasValue && request.DoctorId.Value != Guid.Empty)
        {
            query = query.Where(a => a.DoctorId == request.DoctorId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            query = query.Where(a => a.Status.ToLower() == request.Status.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Date))
        {
            query = query.Where(a => a.Date == request.Date);
        }

        var appointments = await query
            .OrderByDescending(a => a.Date)
            .ThenByDescending(a => a.Time)
            .Select(a => new AppointmentDto(
                a.Id,
                a.BookingReference,
                a.PatientId,
                a.PatientName,
                a.PatientPhone,
                a.PatientEmail,
                a.PatientAge,
                a.PatientGender,
                a.BloodType,
                a.DoctorId,
                a.DoctorName,
                a.DoctorSpecialty,
                a.DoctorImage,
                a.DepartmentId,
                a.DepartmentName,
                a.Date,
                a.Time,
                a.Status,
                a.QueueStatus,
                a.QueueNumber,
                a.RoomNumber,
                a.ConsultationFee,
                a.PaymentStatus,
                a.Notes,
                a.ChiefComplaint,
                a.DiagnosisSummary,
                a.PrescriptionId))
            .ToListAsync(cancellationToken);

        return Result.Success(appointments);
    }
}

public record GetAppointmentByIdQuery(Guid Id) : IQuery<AppointmentDto>;

public class GetAppointmentByIdQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetAppointmentByIdQuery, AppointmentDto>
{
    public async Task<Result<AppointmentDto>> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
    {
        var a = await context.Appointments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (a is null)
            return Result.Failure<AppointmentDto>(Error.NotFound("Appointment.NotFound", "الموعد غير موجود"));

        return Result.Success(new AppointmentDto(
            a.Id,
            a.BookingReference,
            a.PatientId,
            a.PatientName,
            a.PatientPhone,
            a.PatientEmail,
            a.PatientAge,
            a.PatientGender,
            a.BloodType,
            a.DoctorId,
            a.DoctorName,
            a.DoctorSpecialty,
            a.DoctorImage,
            a.DepartmentId,
            a.DepartmentName,
            a.Date,
            a.Time,
            a.Status,
            a.QueueStatus,
            a.QueueNumber,
            a.RoomNumber,
            a.ConsultationFee,
            a.PaymentStatus,
            a.Notes,
            a.ChiefComplaint,
            a.DiagnosisSummary,
            a.PrescriptionId));
    }
}

// Commands
public record QuickBookAppointmentCommand(
    string PatientName,
    string PhoneNumber,
    string? Email,
    Guid DepartmentId,
    Guid DoctorId,
    string AppointmentDate,
    string AppointmentTime,
    string? Notes) : ICommand<QuickBookResponseDto>;

public class QuickBookAppointmentCommandValidator : AbstractValidator<QuickBookAppointmentCommand>
{
    public QuickBookAppointmentCommandValidator()
    {
        RuleFor(x => x.PatientName).NotEmpty().WithMessage("اسم المريض مطلوب");
        RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("رقم الهاتف مطلوب");
        RuleFor(x => x.DoctorId).NotEmpty().WithMessage("يرجى اختيار الطبيب");
    }
}

public class QuickBookAppointmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<QuickBookAppointmentCommand, QuickBookResponseDto>
{
    public async Task<Result<QuickBookResponseDto>> Handle(QuickBookAppointmentCommand request, CancellationToken cancellationToken)
    {
        var doctor = await context.Doctors.FindAsync([request.DoctorId], cancellationToken);
        var dept = await context.Departments.FindAsync([request.DepartmentId], cancellationToken);

        var refId = $"CS-{Random.Shared.Next(100000, 999999)}";

        var apt = new Appointment
        {
            BookingReference = refId,
            PatientName = request.PatientName,
            PatientPhone = request.PhoneNumber,
            PatientEmail = request.Email,
            PatientAge = 30,
            DoctorId = request.DoctorId,
            DoctorName = doctor?.Name ?? "طبيب استشاري",
            DoctorSpecialty = doctor?.Title ?? "استشاري",
            DoctorImage = doctor?.ImageUrl ?? "",
            DepartmentId = request.DepartmentId,
            DepartmentName = dept?.Name ?? doctor?.DepartmentName ?? "العيادات العامة",
            Date = request.AppointmentDate,
            Time = request.AppointmentTime,
            Status = "upcoming",
            QueueStatus = "waiting",
            QueueNumber = Random.Shared.Next(1, 15),
            RoomNumber = doctor?.RoomNumber ?? "عيادة 101",
            ConsultationFee = doctor?.ConsultationFee ?? 400,
            PaymentStatus = "pending",
            Notes = request.Notes
        };

        context.Appointments.Add(apt);

        // Activity log
        context.ActivityLogs.Add(new Administration.Domain.AdminActivityLog
        {
            Title = "حجز موعد إلكتروني جديد",
            Description = $"حجز سريع للمريض {request.PatientName} مع {apt.DoctorName}",
            Time = "الآن",
            Type = "appointment"
        });

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new QuickBookResponseDto(
            true,
            "تم تأكيد طلب الحجز المبدئي بنجاح! سيتواصل معك فريق الاستقبال لتأكيد الموعد النهائي.",
            refId,
            apt.Id));
    }
}

public record BookPatientAppointmentCommand(
    Guid? PatientId,
    string PatientName,
    string PatientPhone,
    Guid DoctorId,
    string DoctorName,
    string DoctorSpecialty,
    string DoctorImage,
    Guid DepartmentId,
    string DepartmentName,
    string Date,
    string Time,
    string RoomNumber,
    decimal ConsultationFee,
    string PaymentStatus,
    string? Notes) : ICommand<AppointmentDto>;

public class BookPatientAppointmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<BookPatientAppointmentCommand, AppointmentDto>
{
    public async Task<Result<AppointmentDto>> Handle(BookPatientAppointmentCommand request, CancellationToken cancellationToken)
    {
        var refId = $"CS-{Random.Shared.Next(100000, 999999)}";

        var apt = new Appointment
        {
            BookingReference = refId,
            PatientId = request.PatientId,
            PatientName = request.PatientName,
            PatientPhone = request.PatientPhone,
            DoctorId = request.DoctorId,
            DoctorName = request.DoctorName,
            DoctorSpecialty = request.DoctorSpecialty,
            DoctorImage = request.DoctorImage,
            DepartmentId = request.DepartmentId,
            DepartmentName = request.DepartmentName,
            Date = request.Date,
            Time = request.Time,
            Status = "upcoming",
            QueueStatus = "waiting",
            QueueNumber = Random.Shared.Next(1, 10),
            RoomNumber = request.RoomNumber,
            ConsultationFee = request.ConsultationFee,
            PaymentStatus = request.PaymentStatus,
            Notes = request.Notes
        };

        context.Appointments.Add(apt);

        if (request.PatientId.HasValue)
        {
            context.Notifications.Add(new Patients.Domain.PatientNotification
            {
                PatientId = request.PatientId.Value,
                Title = "تم تأكيد حجز الموعد",
                Message = $"تم حجز موعدك بنجاح مع {request.DoctorName} بتاريخ {request.Date} الساعة {request.Time}.",
                Date = "الآن",
                Type = "appointment",
                Read = false
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new AppointmentDto(
            apt.Id,
            apt.BookingReference,
            apt.PatientId,
            apt.PatientName,
            apt.PatientPhone,
            apt.PatientEmail,
            apt.PatientAge,
            apt.PatientGender,
            apt.BloodType,
            apt.DoctorId,
            apt.DoctorName,
            apt.DoctorSpecialty,
            apt.DoctorImage,
            apt.DepartmentId,
            apt.DepartmentName,
            apt.Date,
            apt.Time,
            apt.Status,
            apt.QueueStatus,
            apt.QueueNumber,
            apt.RoomNumber,
            apt.ConsultationFee,
            apt.PaymentStatus,
            apt.Notes,
            apt.ChiefComplaint,
            apt.DiagnosisSummary,
            apt.PrescriptionId));
    }
}

public record CancelAppointmentCommand(Guid Id, string? Reason = null) : ICommand<AppointmentDto>;

public class CancelAppointmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<CancelAppointmentCommand, AppointmentDto>
{
    public async Task<Result<AppointmentDto>> Handle(CancelAppointmentCommand request, CancellationToken cancellationToken)
    {
        var apt = await context.Appointments.FindAsync([request.Id], cancellationToken);
        if (apt is null)
            return Result.Failure<AppointmentDto>(Error.NotFound("Appointment.NotFound", "الموعد غير موجود"));

        apt.Status = "cancelled";
        if (!string.IsNullOrWhiteSpace(request.Reason))
        {
            apt.Notes = string.IsNullOrWhiteSpace(apt.Notes) ? $"سبب الإلغاء: {request.Reason}" : $"{apt.Notes} | سبب الإلغاء: {request.Reason}";
        }

        if (apt.PatientId.HasValue)
        {
            context.Notifications.Add(new Patients.Domain.PatientNotification
            {
                PatientId = apt.PatientId.Value,
                Title = "تم إلغاء الموعد",
                Message = $"تم إلغاء موعدك مع {apt.DoctorName} بنجاح.",
                Date = "الآن",
                Type = "appointment",
                Read = false
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new AppointmentDto(
            apt.Id,
            apt.BookingReference,
            apt.PatientId,
            apt.PatientName,
            apt.PatientPhone,
            apt.PatientEmail,
            apt.PatientAge,
            apt.PatientGender,
            apt.BloodType,
            apt.DoctorId,
            apt.DoctorName,
            apt.DoctorSpecialty,
            apt.DoctorImage,
            apt.DepartmentId,
            apt.DepartmentName,
            apt.Date,
            apt.Time,
            apt.Status,
            apt.QueueStatus,
            apt.QueueNumber,
            apt.RoomNumber,
            apt.ConsultationFee,
            apt.PaymentStatus,
            apt.Notes,
            apt.ChiefComplaint,
            apt.DiagnosisSummary,
            apt.PrescriptionId));
    }
}

public record RescheduleAppointmentCommand(Guid Id, string NewDate, string NewTime) : ICommand<AppointmentDto>;

public class RescheduleAppointmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<RescheduleAppointmentCommand, AppointmentDto>
{
    public async Task<Result<AppointmentDto>> Handle(RescheduleAppointmentCommand request, CancellationToken cancellationToken)
    {
        var apt = await context.Appointments.FindAsync([request.Id], cancellationToken);
        if (apt is null)
            return Result.Failure<AppointmentDto>(Error.NotFound("Appointment.NotFound", "الموعد غير موجود"));

        apt.Date = request.NewDate;
        apt.Time = request.NewTime;
        apt.Status = "upcoming";

        if (apt.PatientId.HasValue)
        {
            context.Notifications.Add(new Patients.Domain.PatientNotification
            {
                PatientId = apt.PatientId.Value,
                Title = "تم تعديل موعد الكشف",
                Message = $"تم تغيير موعدك مع {apt.DoctorName} إلى {request.NewDate} الساعة {request.NewTime}.",
                Date = "الآن",
                Type = "appointment",
                Read = false
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new AppointmentDto(
            apt.Id,
            apt.BookingReference,
            apt.PatientId,
            apt.PatientName,
            apt.PatientPhone,
            apt.PatientEmail,
            apt.PatientAge,
            apt.PatientGender,
            apt.BloodType,
            apt.DoctorId,
            apt.DoctorName,
            apt.DoctorSpecialty,
            apt.DoctorImage,
            apt.DepartmentId,
            apt.DepartmentName,
            apt.Date,
            apt.Time,
            apt.Status,
            apt.QueueStatus,
            apt.QueueNumber,
            apt.RoomNumber,
            apt.ConsultationFee,
            apt.PaymentStatus,
            apt.Notes,
            apt.ChiefComplaint,
            apt.DiagnosisSummary,
            apt.PrescriptionId));
    }
}

public record UpdateAppointmentStatusCommand(Guid Id, string Status) : ICommand<AppointmentDto>;

public class UpdateAppointmentStatusCommandHandler(ClinicDbContext context)
    : ICommandHandler<UpdateAppointmentStatusCommand, AppointmentDto>
{
    public async Task<Result<AppointmentDto>> Handle(UpdateAppointmentStatusCommand request, CancellationToken cancellationToken)
    {
        var apt = await context.Appointments.FindAsync([request.Id], cancellationToken);
        if (apt is null)
            return Result.Failure<AppointmentDto>(Error.NotFound("Appointment.NotFound", "الموعد غير موجود"));

        apt.Status = request.Status;
        if (request.Status == "completed")
        {
            apt.QueueStatus = "completed";
        }

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new AppointmentDto(
            apt.Id,
            apt.BookingReference,
            apt.PatientId,
            apt.PatientName,
            apt.PatientPhone,
            apt.PatientEmail,
            apt.PatientAge,
            apt.PatientGender,
            apt.BloodType,
            apt.DoctorId,
            apt.DoctorName,
            apt.DoctorSpecialty,
            apt.DoctorImage,
            apt.DepartmentId,
            apt.DepartmentName,
            apt.Date,
            apt.Time,
            apt.Status,
            apt.QueueStatus,
            apt.QueueNumber,
            apt.RoomNumber,
            apt.ConsultationFee,
            apt.PaymentStatus,
            apt.Notes,
            apt.ChiefComplaint,
            apt.DiagnosisSummary,
            apt.PrescriptionId));
    }
}

public record DeleteAppointmentCommand(Guid Id) : ICommand;

public class DeleteAppointmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<DeleteAppointmentCommand>
{
    public async Task<Result> Handle(DeleteAppointmentCommand request, CancellationToken cancellationToken)
    {
        var apt = await context.Appointments.FindAsync([request.Id], cancellationToken);
        if (apt is null)
            return Result.Failure(Error.NotFound("Appointment.NotFound", "الموعد غير موجود"));

        context.Appointments.Remove(apt);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
