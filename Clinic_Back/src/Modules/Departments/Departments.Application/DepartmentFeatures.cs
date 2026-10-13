using BuildingBlocks.Application.CQRS;
using BuildingBlocks.Domain;
using BuildingBlocks.Infrastructure.Persistence;
using Departments.Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Departments.Application;

public record DepartmentDto(
    Guid Id,
    string Code,
    string Name,
    string NameEn,
    string Icon,
    string Description,
    int DoctorsCount,
    string ColorClass,
    bool IsActive);

public record GetDepartmentsQuery : IQuery<List<DepartmentDto>>;

public class GetDepartmentsQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetDepartmentsQuery, List<DepartmentDto>>
{
    public async Task<Result<List<DepartmentDto>>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
    {
        var depts = await context.Departments
            .AsNoTracking()
            .Select(d => new DepartmentDto(
                d.Id,
                d.Code,
                d.Name,
                d.NameEn,
                d.Icon,
                d.Description,
                d.DoctorsCount,
                d.ColorClass,
                d.IsActive))
            .ToListAsync(cancellationToken);

        return Result.Success(depts);
    }
}

public record GetDepartmentByIdQuery(Guid Id) : IQuery<DepartmentDto>;

public class GetDepartmentByIdQueryHandler(ClinicDbContext context)
    : IQueryHandler<GetDepartmentByIdQuery, DepartmentDto>
{
    public async Task<Result<DepartmentDto>> Handle(GetDepartmentByIdQuery request, CancellationToken cancellationToken)
    {
        var d = await context.Departments
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (d is null)
            return Result.Failure<DepartmentDto>(Error.NotFound("Department.NotFound", "Department not found"));

        return Result.Success(new DepartmentDto(
            d.Id,
            d.Code,
            d.Name,
            d.NameEn,
            d.Icon,
            d.Description,
            d.DoctorsCount,
            d.ColorClass,
            d.IsActive));
    }
}

public record CreateDepartmentCommand(
    string Code,
    string Name,
    string NameEn,
    string Icon,
    string Description,
    int DoctorsCount,
    string ColorClass) : ICommand<DepartmentDto>;

public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("اسم القسم مطلوب");
        RuleFor(x => x.NameEn).NotEmpty().WithMessage("Department English name is required");
    }
}

public class CreateDepartmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<CreateDepartmentCommand, DepartmentDto>
{
    public async Task<Result<DepartmentDto>> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var dept = new Department
        {
            Code = string.IsNullOrWhiteSpace(request.Code) ? request.NameEn.ToLower().Replace(" ", "-") : request.Code,
            Name = request.Name,
            NameEn = request.NameEn,
            Icon = string.IsNullOrWhiteSpace(request.Icon) ? "Stethoscope" : request.Icon,
            Description = request.Description,
            DoctorsCount = request.DoctorsCount,
            ColorClass = string.IsNullOrWhiteSpace(request.ColorClass) ? "from-cyan-500 to-blue-600" : request.ColorClass,
            IsActive = true
        };

        context.Departments.Add(dept);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new DepartmentDto(
            dept.Id,
            dept.Code,
            dept.Name,
            dept.NameEn,
            dept.Icon,
            dept.Description,
            dept.DoctorsCount,
            dept.ColorClass,
            dept.IsActive));
    }
}

public record UpdateDepartmentCommand(
    Guid Id,
    string? Name,
    string? NameEn,
    string? Icon,
    string? Description,
    int? DoctorsCount,
    string? ColorClass,
    bool? IsActive) : ICommand<DepartmentDto>;

public class UpdateDepartmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<UpdateDepartmentCommand, DepartmentDto>
{
    public async Task<Result<DepartmentDto>> Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var dept = await context.Departments.FindAsync([request.Id], cancellationToken);
        if (dept is null)
            return Result.Failure<DepartmentDto>(Error.NotFound("Department.NotFound", "القسم غير موجود"));

        if (!string.IsNullOrWhiteSpace(request.Name)) dept.Name = request.Name;
        if (!string.IsNullOrWhiteSpace(request.NameEn)) dept.NameEn = request.NameEn;
        if (!string.IsNullOrWhiteSpace(request.Icon)) dept.Icon = request.Icon;
        if (!string.IsNullOrWhiteSpace(request.Description)) dept.Description = request.Description;
        if (request.DoctorsCount.HasValue) dept.DoctorsCount = request.DoctorsCount.Value;
        if (!string.IsNullOrWhiteSpace(request.ColorClass)) dept.ColorClass = request.ColorClass;
        if (request.IsActive.HasValue) dept.IsActive = request.IsActive.Value;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success(new DepartmentDto(
            dept.Id,
            dept.Code,
            dept.Name,
            dept.NameEn,
            dept.Icon,
            dept.Description,
            dept.DoctorsCount,
            dept.ColorClass,
            dept.IsActive));
    }
}

public record DeleteDepartmentCommand(Guid Id) : ICommand;

public class DeleteDepartmentCommandHandler(ClinicDbContext context)
    : ICommandHandler<DeleteDepartmentCommand>
{
    public async Task<Result> Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
    {
        var dept = await context.Departments.FindAsync([request.Id], cancellationToken);
        if (dept is null)
            return Result.Failure(Error.NotFound("Department.NotFound", "القسم غير موجود"));

        context.Departments.Remove(dept);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
