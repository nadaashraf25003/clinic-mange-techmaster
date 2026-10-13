using BuildingBlocks.Domain;

namespace MedicalRecords.Domain;

public class MedicationItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
}

public class Prescription : AuditableEntity
{
    public string PrescriptionNumber { get; set; } = string.Empty;
    public Guid? AppointmentId { get; set; }
    public Guid? PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string DoctorSpecialty { get; set; } = string.Empty;
    public string DoctorImage { get; set; } = string.Empty;
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string Diagnosis { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string? NextVisitDate { get; set; }
    public List<MedicationItem> Medications { get; set; } = [];
}

public class LabResultItem
{
    public string Name { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public string NormalRange { get; set; } = string.Empty;
    public bool IsAbnormal { get; set; }
}

public class LabReport : AuditableEntity
{
    public string ReportNumber { get; set; } = string.Empty;
    public Guid? PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string TestName { get; set; } = string.Empty;
    public string Category { get; set; } = "تحاليل دم"; // تحاليل دم, أشعة ومناظير, فحوصات قلب, وظائف أعضاء
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string OrderedByDoctor { get; set; } = string.Empty;
    public string Status { get; set; } = "completed"; // completed, processing, pending_sample
    public string Summary { get; set; } = string.Empty;
    public List<LabResultItem> Results { get; set; } = [];
}

public class ConsultationNote : AuditableEntity
{
    public Guid? AppointmentId { get; set; }
    public Guid? PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string ChiefComplaint { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string ClinicalNotes { get; set; } = string.Empty;
    public List<string> OrderedLabTests { get; set; } = [];
    public string? PrescriptionNumber { get; set; }
    public string? NextFollowUpDate { get; set; }
}
