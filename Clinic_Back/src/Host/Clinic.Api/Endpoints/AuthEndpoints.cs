using Administration.Application;
using Doctors.Application;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Patients.Application;

namespace Clinic.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/auth")
            .WithTags("Auth - تسجيل الدخول والمصادقة");

        // Patient Auth
        group.MapGet("/patient/check", async ([FromQuery] string identifier, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CheckPatientExistsQuery(identifier), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("CheckPatientExists")
        .WithSummary("التحقق مما إذا كان للمريض حساب مسجل مسبقاً برقم الهاتف أو البريد");

        group.MapPost("/patient/login", async ([FromBody] PatientLoginCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("PatientLogin")
        .WithSummary("تسجيل دخول المريض برقم الهاتف أو البريد");

        group.MapPost("/patient/register", async ([FromBody] PatientRegisterCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess
                ? Results.Created($"/clinic/patients/me?patientId={result.Value.Id}", result.Value)
                : Results.BadRequest(result.Error);
        })
        .WithName("PatientRegister")
        .WithSummary("إنشاء حساب مريض جديد");

        // Doctor Auth
        group.MapPost("/doctor/login", async ([FromBody] DoctorLoginCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("DoctorLogin")
        .WithSummary("تسجيل دخول الطبيب");

        // Admin Auth
        group.MapPost("/admin/login", async ([FromBody] AdminLoginCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("AdminLogin")
        .WithSummary("تسجيل دخول المشرف برقم PIN");
    }
}
