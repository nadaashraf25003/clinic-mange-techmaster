using BuildingBlocks.Domain;

namespace Appointments.Domain;

public class Appointment : AuditableEntity
{
    public string BookingReference { get; set; } = string.Empty;
    public Guid? PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientPhone { get; set; } = string.Empty;
    public string? PatientEmail { get; set; }
    public int PatientAge { get; set; }
    public string PatientGender { get; set; } = "male";
    public string BloodType { get; set; } = "A+";
    
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string DoctorSpecialty { get; set; } = string.Empty;
    public string DoctorImage { get; set; } = string.Empty;
    
    public Guid DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string Time { get; set; } = "05:00 م";
    
    public string Status { get; set; } = "upcoming"; // upcoming, completed, cancelled
    public string QueueStatus { get; set; } = "waiting"; // waiting, in_consultation, completed, absent
    public int QueueNumber { get; set; } = 1;
    public string RoomNumber { get; set; } = "عيادة 101";
    
    public decimal ConsultationFee { get; set; } = 400;
    public string PaymentStatus { get; set; } = "pending"; // paid, pending, insurance_covered
    
    public string? Notes { get; set; }
    public string? ChiefComplaint { get; set; }
    public string? DiagnosisSummary { get; set; }
    public string? PrescriptionId { get; set; }
}
