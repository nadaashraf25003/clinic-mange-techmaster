using BuildingBlocks.Domain;

namespace Departments.Domain;

public class Department : AuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Icon { get; set; } = "Stethoscope";
    public string Description { get; set; } = string.Empty;
    public int DoctorsCount { get; set; }
    public string ColorClass { get; set; } = "from-cyan-500 to-blue-600";
    public bool IsActive { get; set; } = true;
}
