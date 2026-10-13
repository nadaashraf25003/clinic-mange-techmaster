using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BuildingBlocks.Infrastructure.Persistence;

public class ClinicDbContextFactory : IDesignTimeDbContextFactory<ClinicDbContext>
{
    public ClinicDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ClinicDbContext>();
        optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=CareSync_Clinic_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;");

        return new ClinicDbContext(optionsBuilder.Options);
    }
}
