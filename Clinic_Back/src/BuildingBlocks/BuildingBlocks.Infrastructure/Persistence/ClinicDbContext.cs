using System.Text.Json;
using Administration.Domain;
using Appointments.Domain;
using Billing.Domain;
using Departments.Domain;
using Doctors.Domain;
using MedicalRecords.Domain;
using Microsoft.EntityFrameworkCore;
using Patients.Domain;

namespace BuildingBlocks.Infrastructure.Persistence;

public class ClinicDbContext(DbContextOptions<ClinicDbContext> options) : DbContext(options)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<PatientProfile> Patients => Set<PatientProfile>();
    public DbSet<HealthVitalRecord> HealthVitals => Set<HealthVitalRecord>();
    public DbSet<PatientNotification> Notifications => Set<PatientNotification>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<LabReport> LabReports => Set<LabReport>();
    public DbSet<ConsultationNote> ConsultationNotes => Set<ConsultationNote>();
    public DbSet<ClinicFinancialRecord> FinancialRecords => Set<ClinicFinancialRecord>();
    public DbSet<AdminProfile> AdminProfiles => Set<AdminProfile>();
    public DbSet<AdminActivityLog> ActivityLogs => Set<AdminActivityLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Doctor entity configuration
        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Specialties)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>());
            entity.Property(e => e.AvailableDays)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>());
            entity.Property(e => e.ConsultationFee).HasPrecision(18, 2);
        });

        // PatientProfile configuration
        modelBuilder.Entity<PatientProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ChronicConditions)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>());
            entity.Property(e => e.Allergies)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>());
            entity.OwnsOne(e => e.EmergencyContact);
            entity.OwnsOne(e => e.Insurance);
        });

        // Appointment configuration
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ConsultationFee).HasPrecision(18, 2);
        });

        // Prescription configuration
        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Medications)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<List<MedicationItem>>(v, JsonOptions) ?? new List<MedicationItem>());
        });

        // LabReport configuration
        modelBuilder.Entity<LabReport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Results)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<List<LabResultItem>>(v, JsonOptions) ?? new List<LabResultItem>());
        });

        // ConsultationNote configuration
        modelBuilder.Entity<ConsultationNote>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderedLabTests)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>());
        });

        // Financial Record configuration
        modelBuilder.Entity<ClinicFinancialRecord>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.InsuranceCoverage).HasPrecision(18, 2);
        });
    }
}
