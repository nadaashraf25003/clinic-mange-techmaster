using Administration.Application;
using Appointments.Application;
using Billing.Application;
using BuildingBlocks.Application.Behaviors;
using BuildingBlocks.Infrastructure.Interceptors;
using BuildingBlocks.Infrastructure.Persistence;
using Clinic.Api.Endpoints;
using Clinic.Api.Middleware;
using Departments.Application;
using Doctors.Application;
using FluentValidation;
using MediatR;
using MedicalRecords.Application;
using Microsoft.EntityFrameworkCore;
using Patients.Application;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure & DbContext
builder.Services.AddSingleton<AuditableEntityInterceptor>();
builder.Services.AddDbContext<ClinicDbContext>((sp, options) =>
{
    var interceptor = sp.GetRequiredService<AuditableEntityInterceptor>();
    var connString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Server=(localdb)\\mssqllocaldb;Database=CareSync_Clinic_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;";
    options.UseSqlServer(connString)
           .AddInterceptors(interceptor);
});

// 2. Add MediatR & CQRS pipeline
var applicationAssemblies = new[]
{
    typeof(DepartmentDto).Assembly,
    typeof(DoctorDto).Assembly,
    typeof(PatientProfileDto).Assembly,
    typeof(AppointmentDto).Assembly,
    typeof(PrescriptionDto).Assembly,
    typeof(ClinicFinancialRecordDto).Assembly,
    typeof(AdminProfileDto).Assembly,
};

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblies(applicationAssemblies);
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// 3. Add FluentValidation
builder.Services.AddValidatorsFromAssemblies(applicationAssemblies);

// 4. Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// 5. Add Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 6. Automatic Seed Data on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ClinicDbContext>();
    await SeedData.InitializeAsync(dbContext);
}

// 7. Middlewares
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CareSync Clinic API v1");
        c.RoutePrefix = "swagger";
    });
}

// 8. Map All Minimal API Endpoint Groups
app.MapAuthEndpoints();
app.MapDepartmentEndpoints();
app.MapDoctorEndpoints();
app.MapPatientEndpoints();
app.MapAppointmentEndpoints();
app.MapMedicalRecordEndpoints();
app.MapFinanceEndpoints();
app.MapAdminEndpoints();

// Root route redirects directly to Swagger UI
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
