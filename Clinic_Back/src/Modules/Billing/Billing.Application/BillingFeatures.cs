using Billing.Domain;
using BuildingBlocks.Application.CQRS;
using BuildingBlocks.Domain;
using BuildingBlocks.Infrastructure.Persistence;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Billing.Application;

public record ClinicFinancialRecordDto(
    Guid Id,
    string InvoiceNumber,
    Guid? PatientId,
    string PatientName,
    Guid? DoctorId,
    string DoctorName,
    string DepartmentName,
    decimal Amount,
    string PaymentMethod,
    string? InsuranceProvider,
    decimal? InsuranceCoverage,
    string Status,
    string Date,
    string Time);

public record FinancialOverviewDto(
    decimal TotalRevenue,
    decimal TodayRevenue,
    decimal InsuranceRevenue,
    decimal CashCardRevenue,
    int TotalInvoicesCount,
    List<ClinicFinancialRecordDto> Records);

// Queries
public record GetFinancialRecordsQuery(
    Guid? PatientId = null,
    Guid? DoctorId = null,
    string? Status = null) : IQuery<FinancialOverviewDto>;

public class GetFinancialRecordsQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetFinancialRecordsQuery, FinancialOverviewDto>
{
    public async Task<Result<FinancialOverviewDto>> Handle(GetFinancialRecordsQuery request, CancellationToken cancellationToken)
    {
        var query = context.FinancialRecords.AsNoTracking().AsQueryable();

        if (request.PatientId.HasValue && request.PatientId.Value != Guid.Empty)
        {
            query = query.Where(f => f.PatientId == request.PatientId.Value);
        }

        if (request.DoctorId.HasValue && request.DoctorId.Value != Guid.Empty)
        {
            query = query.Where(f => f.DoctorId == request.DoctorId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            query = query.Where(f => f.Status.ToLower() == request.Status.ToLower());
        }

        var records = await query
            .OrderByDescending(f => f.Date)
            .ThenByDescending(f => f.Time)
            .Select(f => new ClinicFinancialRecordDto(
                f.Id,
                f.InvoiceNumber,
                f.PatientId,
                f.PatientName,
                f.DoctorId,
                f.DoctorName,
                f.DepartmentName,
                f.Amount,
                f.PaymentMethod,
                f.InsuranceProvider,
                f.InsuranceCoverage,
                f.Status,
                f.Date,
                f.Time))
            .ToListAsync(cancellationToken);

        var total = records.Sum(r => r.Amount);
        var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
        var todayRevenue = records.Where(r => r.Date == today).Sum(r => r.Amount);
        var insuranceRevenue = records.Where(r => r.PaymentMethod == "insurance").Sum(r => r.Amount);
        var cashCard = total - insuranceRevenue;

        return Result.Success(new FinancialOverviewDto(
            total,
            todayRevenue,
            insuranceRevenue,
            cashCard,
            records.Count,
            records));
    }
}

// Commands
public record CreateFinancialRecordCommand(
    Guid? PatientId,
    string PatientName,
    Guid? DoctorId,
    string DoctorName,
    string DepartmentName,
    decimal Amount,
    string PaymentMethod,
    string? InsuranceProvider,
    decimal? InsuranceCoverage,
    string Status) : ICommand<ClinicFinancialRecordDto>;

public class CreateFinancialRecordCommandValidator : AbstractValidator<CreateFinancialRecordCommand>
{
    public CreateFinancialRecordCommandValidator()
    {
        RuleFor(x => x.PatientName).NotEmpty().WithMessage("اسم المريض مطلوب");
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("قيمة الفاتورة يجب أن تكون أكبر من 0");
    }
}

public class CreateFinancialRecordCommandHandler(ClinicDbContext context)
    : ICommandHandler<CreateFinancialRecordCommand, ClinicFinancialRecordDto>
{
    public async Task<Result<ClinicFinancialRecordDto>> Handle(CreateFinancialRecordCommand request, CancellationToken cancellationToken)
    {
        var invNum = $"INV-2026-{Random.Shared.Next(1000, 9999)}";

        var record = new ClinicFinancialRecord
        {
            InvoiceNumber = invNum,
            PatientId = request.PatientId,
            PatientName = request.PatientName,
            DoctorId = request.DoctorId,
            DoctorName = request.DoctorName,
            DepartmentName = request.DepartmentName,
            Amount = request.Amount,
            PaymentMethod = request.PaymentMethod,
            InsuranceProvider = request.InsuranceProvider,
            InsuranceCoverage = request.InsuranceCoverage,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "paid" : request.Status,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Time = DateTime.UtcNow.ToString("hh:mm tt")
        };

        context.FinancialRecords.Add(record);

        context.ActivityLogs.Add(new Administration.Domain.AdminActivityLog
        {
            Title = "إصدار فاتورة جديدة",
            Description = $"فاتورة {invNum} للمريض {request.PatientName} بمبلغ {request.Amount} ج.م",
            Time = "الآن",
            Type = "finance"
        });

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new ClinicFinancialRecordDto(
            record.Id,
            record.InvoiceNumber,
            record.PatientId,
            record.PatientName,
            record.DoctorId,
            record.DoctorName,
            record.DepartmentName,
            record.Amount,
            record.PaymentMethod,
            record.InsuranceProvider,
            record.InsuranceCoverage,
            record.Status,
            record.Date,
            record.Time));
    }
}
