using BuildingBlocks.Domain;

namespace Doctors.Domain;

public class Doctor : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public Guid DepartmentId { get; set; }
    public string DepartmentCode { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public double Rating { get; set; } = 5.0;
    public int ReviewCount { get; set; } = 0;
    public decimal ConsultationFee { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> Specialties { get; set; } = [];
    public List<string> AvailableDays { get; set; } = [];
    public bool IsActive { get; set; } = true;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = "doctor123";
    public string RoomNumber { get; set; } = string.Empty;
}
