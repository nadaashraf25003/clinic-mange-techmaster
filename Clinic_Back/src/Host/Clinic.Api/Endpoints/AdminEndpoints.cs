using Administration.Application;
using MediatR;

namespace Clinic.Api.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clinic/admin")
            .WithTags("Administration - إدارة المنظومة ولوحة التحكم");

        group.MapGet("/profile", async (ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetAdminProfileQuery(), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        })
        .WithName("GetAdminProfile")
        .WithSummary("عرض بيانات المدير الطبي والتنفيذي");

        group.MapGet("/stats", async (ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetClinicStatsQuery(), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetClinicStats")
        .WithSummary("عرض المؤشرات الرئيسية وإحصائيات المنظومة الطبية");

        group.MapGet("/activity-logs", async (ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetAdminActivityLogsQuery(), ct);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        })
        .WithName("GetAdminActivityLogs")
        .WithSummary("عرض سجل العمليات والأنشطة الإدارية في العيادة");

        group.MapPost("/reseed", async (BuildingBlocks.Infrastructure.Persistence.ClinicDbContext context) =>
        {
            await BuildingBlocks.Infrastructure.Persistence.SeedData.InitializeAsync(context, forceReset: true);
            return Results.Ok(new { message = "تم إعادة تهيئة قاعدة البيانات والبيانات الأولية بنجاح" });
        })
        .WithName("ReseedDatabase")
        .WithSummary("إعادة تهيئة وتصفير قاعدة البيانات ببيانات أولية جديدة");
    }
}
