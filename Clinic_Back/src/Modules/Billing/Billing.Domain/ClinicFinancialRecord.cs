using BuildingBlocks.Domain;

namespace Billing.Domain;

public class ClinicFinancialRecord : AuditableEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid? PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public Guid? DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "cash"; // cash, card, insurance
    public string? InsuranceProvider { get; set; }
    public decimal? InsuranceCoverage { get; set; }
    public string Status { get; set; } = "paid"; // paid, pending, refunded
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string Time { get; set; } = "05:00 م";
}
