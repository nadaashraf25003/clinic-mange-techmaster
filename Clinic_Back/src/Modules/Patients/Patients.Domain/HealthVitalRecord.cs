using BuildingBlocks.Domain;

namespace Patients.Domain;

public class HealthVitalRecord : AuditableEntity
{
    public Guid PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int BloodPressureSystolic { get; set; } = 120;
    public int BloodPressureDiastolic { get; set; } = 80;
    public int BloodSugar { get; set; } = 95;
    public int HeartRate { get; set; } = 72;
    public double Weight { get; set; } = 70.0;
    public double Temperature { get; set; } = 37.0;
    public string? Notes { get; set; }
}

public class PatientNotification : AuditableEntity
{
    public Guid PatientId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm");
    public string Type { get; set; } = "general"; // appointment, prescription, lab, general
    public bool Read { get; set; } = false;
}
