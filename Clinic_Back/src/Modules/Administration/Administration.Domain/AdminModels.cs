using BuildingBlocks.Domain;

namespace Administration.Domain;

public class AdminProfile : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Username { get; set; } = "admin";
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = "admin123";
    public string Phone { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string PinCode { get; set; } = "1234";
}

public class AdminActivityLog : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Time { get; set; } = "الآن";
    public string Type { get; set; } = "system"; // doctor, appointment, finance, system
}
