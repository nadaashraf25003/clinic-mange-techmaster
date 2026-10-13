using BuildingBlocks.Application.CQRS;
using BuildingBlocks.Domain;
using BuildingBlocks.Infrastructure.Persistence;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Patients.Domain;

namespace Patients.Application;

public record PatientProfileDto(
    Guid Id,
    string Name,
    string Phone,
    string Email,
    string NationalId,
    string Gender,
    string BirthDate,
    int Age,
    string BloodType,
    List<string> ChronicConditions,
    List<string> Allergies,
    EmergencyContactInfo EmergencyContact,
    InsuranceInfo Insurance);

public record HealthVitalRecordDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    DateTime Date,
    int BloodPressureSystolic,
    int BloodPressureDiastolic,
    int BloodSugar,
    int HeartRate,
    double Weight,
    double Temperature,
    string? Notes);

public record PatientNotificationDto(
    Guid Id,
    Guid PatientId,
    string Title,
    string Message,
    string Date,
    string Type,
    bool Read);

public record CheckPatientExistsDto(
    bool Exists,
    Guid? PatientId = null,
    string? Name = null,
    string? Phone = null,
    string? Email = null,
    string? Message = null);

// Queries
public record CheckPatientExistsQuery(string Identifier) : IQuery<CheckPatientExistsDto>;

public class CheckPatientExistsQueryHandler(ClinicDbContext context)
    : IQueryHandler<CheckPatientExistsQuery, CheckPatientExistsDto>
{
    public async Task<Result<CheckPatientExistsDto>> Handle(CheckPatientExistsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Identifier))
        {
            return Result.Success(new CheckPatientExistsDto(false, null, null, null, null, "لم يتم إدخال بيانات التحقق"));
        }

        var trimmed = request.Identifier.Trim();
        var patient = await context.Patients.AsNoTracking().FirstOrDefaultAsync(p =>
            p.Phone == trimmed ||
            (p.Email != null && p.Email.ToLower() == trimmed.ToLower()) ||
            p.NationalId == trimmed, cancellationToken);

        if (patient is not null)
        {
            return Result.Success(new CheckPatientExistsDto(
                Exists: true,
                PatientId: patient.Id,
                Name: patient.Name,
                Phone: patient.Phone,
                Email: patient.Email,
                Message: "يوجد حساب مسجل مسبقاً بهذا الرقم أو البريد الإلكتروني. يمكنك تسجيل الدخول مباشرة."));
        }

        return Result.Success(new CheckPatientExistsDto(
            Exists: false,
            Message: "لا يوجد حساب مسجل بهذه البيانات. يمكنك متابعة إنشاء حساب جديد."));
    }
}

public record GetPatientProfileQuery(Guid? PatientId = null) : IQuery<PatientProfileDto>;

public class GetPatientProfileQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetPatientProfileQuery, PatientProfileDto>
{
    public async Task<Result<PatientProfileDto>> Handle(GetPatientProfileQuery request, CancellationToken cancellationToken)
    {
        if (!request.PatientId.HasValue)
        {
            return Result.Failure<PatientProfileDto>(Error.Validation("PatientId", "معرف المريض مطلوب"));
        }

        var patient = await context.Patients.AsNoTracking().FirstOrDefaultAsync(p => p.Id == request.PatientId.Value, cancellationToken);

        if (patient is null)
            return Result.Failure<PatientProfileDto>(Error.NotFound("Patient.NotFound", "الملف الشخصي للمريض غير موجود"));

        return Result.Success(new PatientProfileDto(
            patient.Id,
            patient.Name,
            patient.Phone,
            patient.Email,
            patient.NationalId,
            patient.Gender,
            patient.BirthDate,
            patient.Age,
            patient.BloodType,
            patient.ChronicConditions,
            patient.Allergies,
            patient.EmergencyContact,
            patient.Insurance));
    }
}

public record GetPatientVitalsQuery(Guid? PatientId = null) : IQuery<List<HealthVitalRecordDto>>;

public class GetPatientVitalsQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetPatientVitalsQuery, List<HealthVitalRecordDto>>
{
    public async Task<Result<List<HealthVitalRecordDto>>> Handle(GetPatientVitalsQuery request, CancellationToken cancellationToken)
    {
        var query = context.HealthVitals.AsNoTracking().AsQueryable();

        if (request.PatientId.HasValue)
        {
            query = query.Where(v => v.PatientId == request.PatientId.Value);
        }

        var vitals = await query
            .OrderByDescending(v => v.Date)
            .Select(v => new HealthVitalRecordDto(
                v.Id,
                v.PatientId,
                v.PatientName,
                v.Date,
                v.BloodPressureSystolic,
                v.BloodPressureDiastolic,
                v.BloodSugar,
                v.HeartRate,
                v.Weight,
                v.Temperature,
                v.Notes))
            .ToListAsync(cancellationToken);

        return Result.Success(vitals);
    }
}

public record GetPatientNotificationsQuery(Guid? PatientId = null) : IQuery<List<PatientNotificationDto>>;

public class GetPatientNotificationsQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetPatientNotificationsQuery, List<PatientNotificationDto>>
{
    public async Task<Result<List<PatientNotificationDto>>> Handle(GetPatientNotificationsQuery request, CancellationToken cancellationToken)
    {
        var query = context.Notifications.AsNoTracking().AsQueryable();

        if (request.PatientId.HasValue)
        {
            query = query.Where(n => n.PatientId == request.PatientId.Value);
        }

        var notifs = await query
            .OrderByDescending(n => n.CreatedAtUtc)
            .Select(n => new PatientNotificationDto(
                n.Id,
                n.PatientId,
                n.Title,
                n.Message,
                n.Date,
                n.Type,
                n.Read))
            .ToListAsync(cancellationToken);

        return Result.Success(notifs);
    }
}

// Commands
public record PatientLoginCommand(string PhoneOrEmail, string PinCode = "1234") : ICommand<PatientProfileDto>;

public class PatientLoginCommandHandler(ClinicDbContext context)
    : ICommandHandler<PatientLoginCommand, PatientProfileDto>
{
    public async Task<Result<PatientProfileDto>> Handle(PatientLoginCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneOrEmail))
        {
            return Result.Failure<PatientProfileDto>(
                Error.Validation("PhoneOrEmail", "يرجى إدخال رقم الهاتف أو البريد الإلكتروني"));
        }

        var trimmed = request.PhoneOrEmail.Trim();
        var p = await context.Patients.FirstOrDefaultAsync(
            x => x.Phone == trimmed || 
                 (x.Email != null && x.Email.ToLower() == trimmed.ToLower()) ||
                 x.NationalId == trimmed, cancellationToken);

        if (p is null)
        {
            return Result.Failure<PatientProfileDto>(
                Error.NotFound("Patient.NotFound", "بيانات تسجيل الدخول غير صحيحة. لم يتم العثور على حساب مسجل بهذا الرقم أو البريد الإلكتروني."));
        }

        if (!string.IsNullOrWhiteSpace(p.PinCode))
        {
            if (string.IsNullOrWhiteSpace(request.PinCode) || request.PinCode.Trim() != p.PinCode.Trim())
            {
                return Result.Failure<PatientProfileDto>(
                    Error.Validation("PinCode", "كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور المدخلة والمحاولة مجدداً."));
            }
        }

        return Result.Success(new PatientProfileDto(
            p.Id,
            p.Name,
            p.Phone,
            p.Email,
            p.NationalId,
            p.Gender,
            p.BirthDate,
            p.Age,
            p.BloodType,
            p.ChronicConditions,
            p.Allergies,
            p.EmergencyContact,
            p.Insurance));
    }
}

public record PatientRegisterCommand(
    string Name,
    string Phone,
    string Email,
    string Password = "1234",
    string? NationalId = null,
    string? Gender = "male",
    string? BirthDate = "1995-01-01",
    int Age = 30,
    string? BloodType = "A+") : ICommand<PatientProfileDto>;

public class PatientRegisterCommandValidator : AbstractValidator<PatientRegisterCommand>
{
    public PatientRegisterCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("الاسم بالكامل مطلوب");
        RuleFor(x => x.Phone).NotEmpty().WithMessage("رقم الهاتف مطلوب");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("البريد الإلكتروني مطلوب ويجب أن يكون بصيغة صحيحة");
        RuleFor(x => x.Password).NotEmpty().MinimumLength(4).WithMessage("كلمة المرور مطلوبة ويجب أن لا تقل عن 4 أحرف أو أرقام");
    }
}

public class PatientRegisterCommandHandler(ClinicDbContext context)
    : ICommandHandler<PatientRegisterCommand, PatientProfileDto>
{
    public async Task<Result<PatientProfileDto>> Handle(PatientRegisterCommand request, CancellationToken cancellationToken)
    {
        var existing = await context.Patients.AsNoTracking().FirstOrDefaultAsync(
            x => x.Phone == request.Phone.Trim() || 
                 (!string.IsNullOrWhiteSpace(x.Email) && x.Email.ToLower() == request.Email.Trim().ToLower()), cancellationToken);

        if (existing is not null)
        {
            return Result.Failure<PatientProfileDto>(
                Error.Conflict("Patient.AlreadyExists", "يوجد حساب مسجل مسبقاً بهذا الرقم أو البريد الإلكتروني."));
        }

        var p = new PatientProfile
        {
            Name = request.Name.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email.Trim(),
            NationalId = string.IsNullOrWhiteSpace(request.NationalId) ? "29408150102456" : request.NationalId.Trim(),
            Gender = string.IsNullOrWhiteSpace(request.Gender) ? "male" : request.Gender,
            BirthDate = string.IsNullOrWhiteSpace(request.BirthDate) ? "1995-01-01" : request.BirthDate,
            Age = request.Age > 0 ? request.Age : 30,
            BloodType = string.IsNullOrWhiteSpace(request.BloodType) ? "A+" : request.BloodType,
            ChronicConditions = [],
            Allergies = [],
            EmergencyContact = new EmergencyContactInfo(),
            Insurance = new InsuranceInfo(),
            PinCode = string.IsNullOrWhiteSpace(request.Password) ? "1234" : request.Password.Trim()
        };

        context.Patients.Add(p);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new PatientProfileDto(
            p.Id,
            p.Name,
            p.Phone,
            p.Email,
            p.NationalId,
            p.Gender,
            p.BirthDate,
            p.Age,
            p.BloodType,
            p.ChronicConditions,
            p.Allergies,
            p.EmergencyContact,
            p.Insurance));
    }
}

public record UpdatePatientProfileCommand(
    Guid Id,
    string? Name,
    string? Phone,
    string? Email,
    string? NationalId,
    string? Gender,
    string? BirthDate,
    int? Age,
    string? BloodType,
    List<string>? ChronicConditions,
    List<string>? Allergies,
    EmergencyContactInfo? EmergencyContact,
    InsuranceInfo? Insurance) : ICommand<PatientProfileDto>;

public class UpdatePatientProfileCommandHandler(ClinicDbContext context)
    : ICommandHandler<UpdatePatientProfileCommand, PatientProfileDto>
{
    public async Task<Result<PatientProfileDto>> Handle(UpdatePatientProfileCommand request, CancellationToken cancellationToken)
    {
        var p = await context.Patients.FindAsync([request.Id], cancellationToken);
        if (p is null)
            return Result.Failure<PatientProfileDto>(Error.NotFound("Patient.NotFound", "المريض غير موجود"));

        if (!string.IsNullOrWhiteSpace(request.Name)) p.Name = request.Name;
        if (!string.IsNullOrWhiteSpace(request.Phone)) p.Phone = request.Phone;
        if (!string.IsNullOrWhiteSpace(request.Email)) p.Email = request.Email;
        if (!string.IsNullOrWhiteSpace(request.NationalId)) p.NationalId = request.NationalId;
        if (!string.IsNullOrWhiteSpace(request.Gender)) p.Gender = request.Gender;
        if (!string.IsNullOrWhiteSpace(request.BirthDate)) p.BirthDate = request.BirthDate;
        if (request.Age.HasValue) p.Age = request.Age.Value;
        if (!string.IsNullOrWhiteSpace(request.BloodType)) p.BloodType = request.BloodType;
        if (request.ChronicConditions != null) p.ChronicConditions = request.ChronicConditions;
        if (request.Allergies != null) p.Allergies = request.Allergies;
        if (request.EmergencyContact != null) p.EmergencyContact = request.EmergencyContact;
        if (request.Insurance != null) p.Insurance = request.Insurance;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new PatientProfileDto(
            p.Id,
            p.Name,
            p.Phone,
            p.Email,
            p.NationalId,
            p.Gender,
            p.BirthDate,
            p.Age,
            p.BloodType,
            p.ChronicConditions,
            p.Allergies,
            p.EmergencyContact,
            p.Insurance));
    }
}

public record AddVitalRecordCommand(
    Guid? PatientId,
    int BloodPressureSystolic,
    int BloodPressureDiastolic,
    int BloodSugar,
    int HeartRate,
    double Weight,
    double Temperature,
    string? Notes) : ICommand<HealthVitalRecordDto>;

public class AddVitalRecordCommandHandler(ClinicDbContext context)
    : ICommandHandler<AddVitalRecordCommand, HealthVitalRecordDto>
{
    public async Task<Result<HealthVitalRecordDto>> Handle(AddVitalRecordCommand request, CancellationToken cancellationToken)
    {
        var patient = request.PatientId.HasValue
            ? await context.Patients.FindAsync([request.PatientId.Value], cancellationToken)
            : await context.Patients.FirstOrDefaultAsync(cancellationToken);

        var vital = new HealthVitalRecord
        {
            PatientId = patient?.Id ?? Guid.NewGuid(),
            PatientName = patient?.Name ?? "مريض",
            Date = DateTime.UtcNow,
            BloodPressureSystolic = request.BloodPressureSystolic,
            BloodPressureDiastolic = request.BloodPressureDiastolic,
            BloodSugar = request.BloodSugar,
            HeartRate = request.HeartRate,
            Weight = request.Weight,
            Temperature = request.Temperature,
            Notes = request.Notes
        };

        context.HealthVitals.Add(vital);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new HealthVitalRecordDto(
            vital.Id,
            vital.PatientId,
            vital.PatientName,
            vital.Date,
            vital.BloodPressureSystolic,
            vital.BloodPressureDiastolic,
            vital.BloodSugar,
            vital.HeartRate,
            vital.Weight,
            vital.Temperature,
            vital.Notes));
    }
}

public record MarkNotificationReadCommand(Guid Id) : ICommand;

public class MarkNotificationReadCommandHandler(ClinicDbContext context)
    : ICommandHandler<MarkNotificationReadCommand>
{
    public async Task<Result> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
    {
        var notif = await context.Notifications.FindAsync([request.Id], cancellationToken);
        if (notif is null)
            return Result.Failure(Error.NotFound("Notification.NotFound", "الإشعار غير موجود"));

        notif.Read = true;
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}

public record MarkAllNotificationsReadCommand(Guid? PatientId = null) : ICommand;

public class MarkAllNotificationsReadCommandHandler(ClinicDbContext context)
    : ICommandHandler<MarkAllNotificationsReadCommand>
{
    public async Task<Result> Handle(MarkAllNotificationsReadCommand request, CancellationToken cancellationToken)
    {
        var query = context.Notifications.AsQueryable();
        if (request.PatientId.HasValue)
        {
            query = query.Where(n => n.PatientId == request.PatientId.Value);
        }

        await query.ExecuteUpdateAsync(s => s.SetProperty(n => n.Read, true), cancellationToken);

        return Result.Success();
    }
}
