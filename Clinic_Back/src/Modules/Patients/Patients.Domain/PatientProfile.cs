using BuildingBlocks.Domain;

namespace Patients.Domain;

public class EmergencyContactInfo
{
    public string Name { get; set; } = string.Empty;
    public string Relation { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class InsuranceInfo
{
    public string Provider { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public int CoveragePercentage { get; set; }
    public string ExpiryDate { get; set; } = string.Empty;
}

public class PatientProfile : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string NationalId { get; set; } = string.Empty;
    public string Gender { get; set; } = "male";
    public string BirthDate { get; set; } = string.Empty;
    public int Age { get; set; }
    public string BloodType { get; set; } = "A+";
    public List<string> ChronicConditions { get; set; } = [];
    public List<string> Allergies { get; set; } = [];
    public EmergencyContactInfo EmergencyContact { get; set; } = new();
    public InsuranceInfo Insurance { get; set; } = new();
    public string PinCode { get; set; } = "1234";
}
