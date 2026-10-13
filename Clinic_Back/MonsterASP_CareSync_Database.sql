-- ====================================================================================================
-- CareSync Clinic Management System - Full SQL Server Database Setup & Seed
-- Host / Target: MonsterASP.NET (Database: db72078)
-- Generated on: 2026-10-06
-- ====================================================================================================

-- 1. Create Tables
IF OBJECT_ID('dbo.ActivityLogs', 'U') IS NOT NULL DROP TABLE dbo.ActivityLogs;
IF OBJECT_ID('dbo.Appointments', 'U') IS NOT NULL DROP TABLE dbo.Appointments;
IF OBJECT_ID('dbo.Prescriptions', 'U') IS NOT NULL DROP TABLE dbo.Prescriptions;
IF OBJECT_ID('dbo.LabReports', 'U') IS NOT NULL DROP TABLE dbo.LabReports;
IF OBJECT_ID('dbo.ConsultationNotes', 'U') IS NOT NULL DROP TABLE dbo.ConsultationNotes;
IF OBJECT_ID('dbo.FinancialRecords', 'U') IS NOT NULL DROP TABLE dbo.FinancialRecords;
IF OBJECT_ID('dbo.HealthVitals', 'U') IS NOT NULL DROP TABLE dbo.HealthVitals;
IF OBJECT_ID('dbo.Notifications', 'U') IS NOT NULL DROP TABLE dbo.Notifications;
IF OBJECT_ID('dbo.Patients', 'U') IS NOT NULL DROP TABLE dbo.Patients;
IF OBJECT_ID('dbo.Doctors', 'U') IS NOT NULL DROP TABLE dbo.Doctors;
IF OBJECT_ID('dbo.Departments', 'U') IS NOT NULL DROP TABLE dbo.Departments;
IF OBJECT_ID('dbo.AdminProfiles', 'U') IS NOT NULL DROP TABLE dbo.AdminProfiles;
GO

-- Departments Table
CREATE TABLE dbo.Departments (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(100) NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    NameEn NVARCHAR(255) NOT NULL,
    Icon NVARCHAR(100) NOT NULL,
    Description NVARCHAR(1000) NOT NULL,
    DoctorsCount INT NOT NULL DEFAULT 0,
    ColorClass NVARCHAR(255) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- Doctors Table
CREATE TABLE dbo.Doctors (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    DepartmentId UNIQUEIDENTIFIER NOT NULL,
    DepartmentCode NVARCHAR(100) NOT NULL,
    DepartmentName NVARCHAR(255) NOT NULL,
    ExperienceYears INT NOT NULL DEFAULT 0,
    Rating FLOAT NOT NULL DEFAULT 5.0,
    ReviewCount INT NOT NULL DEFAULT 0,
    ConsultationFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    ImageUrl NVARCHAR(1000) NOT NULL,
    Specialties NVARCHAR(MAX) NOT NULL DEFAULT '[]',
    AvailableDays NVARCHAR(MAX) NOT NULL DEFAULT '[]',
    IsActive BIT NOT NULL DEFAULT 1,
    Phone NVARCHAR(50) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Password NVARCHAR(255) NOT NULL DEFAULT 'doctor123',
    RoomNumber NVARCHAR(100) NOT NULL,
    Bio NVARCHAR(1000) NULL,
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- Patients Table
CREATE TABLE dbo.Patients (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    FullName NVARCHAR(255) NOT NULL,
    NationalId NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(50) NOT NULL,
    PinCode NVARCHAR(10) NOT NULL DEFAULT '1234',
    Email NVARCHAR(255) NULL,
    DateOfBirth DATETIME2 NOT NULL,
    Gender NVARCHAR(20) NOT NULL,
    BloodType NVARCHAR(10) NOT NULL DEFAULT 'O+',
    Address NVARCHAR(500) NOT NULL,
    ChronicConditions NVARCHAR(MAX) NOT NULL DEFAULT '[]',
    Allergies NVARCHAR(MAX) NOT NULL DEFAULT '[]',
    EmergencyContact_Name NVARCHAR(255) NULL,
    EmergencyContact_Relation NVARCHAR(100) NULL,
    EmergencyContact_Phone NVARCHAR(50) NULL,
    Insurance_ProviderName NVARCHAR(255) NULL,
    Insurance_PolicyNumber NVARCHAR(100) NULL,
    Insurance_CoveragePercentage INT NULL,
    Insurance_ExpiryDate DATETIME2 NULL,
    Insurance_IsActive BIT NULL,
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- Appointments Table
CREATE TABLE dbo.Appointments (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    PatientName NVARCHAR(255) NOT NULL,
    PatientPhone NVARCHAR(50) NOT NULL,
    DoctorId UNIQUEIDENTIFIER NOT NULL,
    DoctorName NVARCHAR(255) NOT NULL,
    DepartmentId UNIQUEIDENTIFIER NOT NULL,
    DepartmentName NVARCHAR(255) NOT NULL,
    AppointmentDate DATETIME2 NOT NULL,
    SlotTime NVARCHAR(50) NOT NULL,
    Status INT NOT NULL DEFAULT 0, -- 0: Confirmed, 1: InProgress, 2: Completed, 3: Cancelled, 4: Waiting
    QueueNumber INT NOT NULL DEFAULT 1,
    ConsultationFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaymentStatus INT NOT NULL DEFAULT 0, -- 0: Unpaid, 1: Paid, 2: Refunded
    Notes NVARCHAR(1000) NULL,
    IsFollowUp BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- Prescriptions Table
CREATE TABLE dbo.Prescriptions (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    PatientName NVARCHAR(255) NOT NULL,
    DoctorId UNIQUEIDENTIFIER NOT NULL,
    DoctorName NVARCHAR(255) NOT NULL,
    DepartmentName NVARCHAR(255) NOT NULL,
    Diagnosis NVARCHAR(500) NOT NULL,
    GeneralInstructions NVARCHAR(1000) NULL,
    PrescriptionDate DATETIME2 NOT NULL,
    Medications NVARCHAR(MAX) NOT NULL DEFAULT '[]',
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- LabReports Table
CREATE TABLE dbo.LabReports (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    PatientName NVARCHAR(255) NOT NULL,
    DoctorId UNIQUEIDENTIFIER NOT NULL,
    DoctorName NVARCHAR(255) NOT NULL,
    TestName NVARCHAR(255) NOT NULL,
    TestCategory NVARCHAR(100) NOT NULL,
    TestDate DATETIME2 NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Completed',
    Results NVARCHAR(MAX) NOT NULL DEFAULT '[]',
    ReportNotes NVARCHAR(1000) NULL,
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- HealthVitals Table
CREATE TABLE dbo.HealthVitals (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    BloodPressure NVARCHAR(50) NOT NULL,
    HeartRate INT NOT NULL,
    BloodSugar INT NOT NULL,
    Temperature FLOAT NOT NULL,
    Weight FLOAT NOT NULL,
    Height FLOAT NOT NULL,
    RecordedAt DATETIME2 NOT NULL,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- Notifications Table
CREATE TABLE dbo.Notifications (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(1000) NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- FinancialRecords Table
CREATE TABLE dbo.FinancialRecords (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    TransactionNumber NVARCHAR(100) NOT NULL,
    PatientId UNIQUEIDENTIFIER NOT NULL,
    PatientName NVARCHAR(255) NOT NULL,
    DoctorId UNIQUEIDENTIFIER NOT NULL,
    DoctorName NVARCHAR(255) NOT NULL,
    DepartmentName NVARCHAR(255) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    InsuranceCoverage DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaymentMethod NVARCHAR(50) NOT NULL,
    TransactionType NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Paid',
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- AdminProfiles Table
CREATE TABLE dbo.AdminProfiles (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    FullName NVARCHAR(255) NOT NULL,
    RoleTitle NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Username NVARCHAR(100) NOT NULL DEFAULT 'admin',
    Password NVARCHAR(255) NOT NULL DEFAULT 'admin123',
    PhoneNumber NVARCHAR(50) NOT NULL,
    PinCode NVARCHAR(10) NOT NULL DEFAULT '1234',
    AvatarUrl NVARCHAR(1000) NOT NULL,
    SystemRole NVARCHAR(50) NOT NULL DEFAULT 'SuperAdmin',
    CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    LastModifiedAt DATETIMEOFFSET NULL
);
GO

-- ActivityLogs Table
CREATE TABLE dbo.ActivityLogs (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    ActorName NVARCHAR(255) NOT NULL,
    ActorRole NVARCHAR(100) NOT NULL,
    Action NVARCHAR(255) NOT NULL,
    Details NVARCHAR(1000) NOT NULL,
    Module NVARCHAR(100) NOT NULL,
    Timestamp DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- ====================================================================================================
-- 2. Seed Initial Clean Data
-- ====================================================================================================

-- 1. Departments
INSERT INTO dbo.Departments (Id, Code, Name, NameEn, Icon, Description, DoctorsCount, ColorClass, IsActive)
VALUES 
('C5105B89-0A7B-4951-9B73-F9CBC2D28A51', 'cardiology', N'القلب والأوعية الدموية', 'Cardiology', 'HeartPulse', N'تشخيص وعلاج أمراض القلب والشرايين بأحدث أجهزة القسطرة ورسم القلب الإيكو ثلاثي الأبعاد.', 1, 'from-rose-500 to-red-600', 1),
('9655B140-8EE8-48FE-965B-4AB306769541', 'dentistry', N'طب وجراحة الأسنان', 'Dentistry', 'Smile', N'زراعة الأسنان الفورية، تجميل الابتسامة (هوليوود سمايل)، وتقويم الأسنان بأحدث التقنيات الرقمية.', 1, 'from-cyan-500 to-blue-600', 1),
('A5759FCC-0EA3-4CC8-805A-1D78D2C6AFEA', 'orthopedics', N'العظام والمفاصل', 'Orthopedics', 'Activity', N'علاج خشونة المفاصل، جراحات المناظير الدقيقة واستبدال المفاصل وإصابات الملاعب والتأهيل.', 1, 'from-amber-500 to-orange-600', 1),
('9F932B5A-3569-4D35-A6FA-0C5B0B841B03', 'pediatrics', N'طب الأطفال وحديثي الولادة', 'Pediatrics', 'Smile', N'رعاية طبية متكاملة لحديثي الولادة والأطفال، برامج التطعيمات، ومتابعة النمو والتغذية العلاجية.', 1, 'from-emerald-500 to-teal-600', 1),
('B3D6B5A1-3329-450F-A08D-7CC1BDCA8E61', 'ophthalmology', N'طب وجراحة العيون', 'Ophthalmology', 'Eye', N'تصحيح الإبصار بالفيمتو ليزك، علاج المياه البيضاء والزرقاء، وفحص قاع العين لمرضى السكري.', 1, 'from-indigo-500 to-violet-600', 1),
('8019C0E2-6C48-438D-BC08-FFB5CA7BC274', 'neurology', N'المخ والأعصاب', 'Neurology', 'Brain', N'علاج الصداع المزمن، اضطرابات النوم والذاكرة، أمراض الأعصاب الطرفية وجراحات العمود الفقري.', 1, 'from-purple-500 to-pink-600', 1);
GO

-- 2. Doctors (Password: doctor123)
INSERT INTO dbo.Doctors (Id, Name, Title, DepartmentId, DepartmentCode, DepartmentName, ExperienceYears, Rating, ReviewCount, ConsultationFee, ImageUrl, Specialties, AvailableDays, IsActive, Phone, Email, Password, RoomNumber)
VALUES
('A167851B-1366-4B00-8B3A-D16D422BF8B4', N'د. أحمد الشناوي', N'استشاري أول أمراض القلب والقسطرة التداخلية', 'C5105B89-0A7B-4951-9B73-F9CBC2D28A51', 'cardiology', N'القلب والأوعية الدموية', 16, 4.9, 340, 450.00, '/doctors/doctor-ahmed.jpg', '["قسطرة الشرايين التاجية", "رسم القلب بالمجهود", "علاج ارتفاع ضغط الدم المعقد"]', '["السبت", "الإثنين", "الأربعاء"]', 1, '01011223344', 'ahmed.shennawy@caresync.com', 'doctor123', N'عيادة 201 - الدور الثاني'),
('658FB01F-60DD-41B9-BB1C-FA668F1AE95E', N'د. سارة المنصوري', N'استشارية طب وجراحة الفم والأسنان وتجميل الابتسامة', '9655B140-8EE8-48FE-965B-4AB306769541', 'dentistry', N'طب وجراحة الأسنان', 12, 4.95, 280, 350.00, '/doctors/doctor-sara.jpg', '["تجميل الأسنان والفينير", "زراعة الأسنان الرقمية", "علاج الجذور بالمايكروسكوب"]', '["الأحد", "الثلاثاء", "الخميس"]', 1, '01022334455', 'sara.mansoury@caresync.com', 'doctor123', N'عيادة 102 - الدور الأرضي'),
('7FA5CD91-8355-499A-9DE1-9B0E3F89E4FC', N'د. يوسف عبد الرحمن', N'استشاري جراحة العظام والمفاصل الصناعية وإصابات الملاعب', 'A5759FCC-0EA3-4CC8-805A-1D78D2C6AFEA', 'orthopedics', N'العظام والمفاصل', 18, 4.88, 410, 400.00, '/doctors/doctor-youssef.jpg', '["استبدال مفاصل الركبة والحوض", "مناظير الكتف والركبة", "علاج خشونة الفقرات"]', '["السبت", "الثلاثاء", "الأربعاء"]', 1, '01033445566', 'youssef.rahman@caresync.com', 'doctor123', N'عيادة 208 - الدور الثاني'),
('D1CBCA91-10D5-4792-9E24-9BCC99816569', N'د. نورهان المهدي', N'استشارية طب الأطفال ورعاية المبتسرين وحديثي الولادة', '9F932B5A-3569-4D35-A6FA-0C5B0B841B03', 'pediatrics', N'طب الأطفال وحديثي الولادة', 14, 4.92, 520, 300.00, '/doctors/doctor-nourhan.jpg', '["متابعة نمو الرضع والمبتسرين", "حساسية الصدر والأكزيما", "التغذية العلاجية للأطفال"]', '["السبت", "الأحد", "الإثنين", "الأربعاء"]', 1, '01044556677', 'nourhan.mahdy@caresync.com', 'doctor123', N'عيادة 305 - الدور الثالث');
GO

-- 3. Admin Account (Username: admin, Password: admin123, PIN: 1234)
INSERT INTO dbo.AdminProfiles (Id, FullName, RoleTitle, Email, Username, Password, PhoneNumber, PinCode, AvatarUrl, SystemRole)
VALUES
('E5A1C0E4-8142-4D38-8B40-621FA32C8891', N'أ. عبد الرحمن مصطفى', N'المدير التنفيذي والمسؤول الطبي للمجمع', 'admin@caresync.com', 'admin', 'admin123', '01122334455', '1234', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'SuperAdmin');
GO

-- 4. Sample Patients (Phone: 01012345678, PIN: 1234)
INSERT INTO dbo.Patients (Id, FullName, NationalId, PhoneNumber, PinCode, Email, DateOfBirth, Gender, BloodType, Address, ChronicConditions, Allergies, EmergencyContact_Name, EmergencyContact_Relation, EmergencyContact_Phone, Insurance_ProviderName, Insurance_PolicyNumber, Insurance_CoveragePercentage, Insurance_ExpiryDate, Insurance_IsActive)
VALUES
('2C8F31E4-9B71-4A51-B831-2C5E7D114A01', N'محمد طارق عبد الله', '29508140102345', '01012345678', '1234', 'mohamed.tarek@example.com', '1995-08-14', N'ذكر', 'A+', N'14 شارع التحرير، الدقي، الجيزة', '["ارتفاع ضغط الدم الخفيف"]', '["البنسلين", "المأكولات البحرية"]', N'فاطمة عبد الله', N'أخت', '01099887766', N'شركة بوبا للتأمين الطبي', 'BUPA-EG-2026-9988', 85, '2027-12-31', 1),
('3D9A42F5-AC82-4B62-C942-3D6F8E225B02', N'مريم أحمد الشاذلي', '29811200104567', '01098765432', '1234', 'mariam.shazly@example.com', '1998-11-20', N'أنثى', 'O+', N'28 شارع الهرم، الجيزة', '[]', '["الأسبرين"]', N'أحمد الشاذلي', N'أب', '01155443322', N'شركة أكسـا للتأمين', 'AXA-99321-2026', 80, '2027-06-30', 1);
GO

-- 5. Sample Appointments
INSERT INTO dbo.Appointments (Id, PatientId, PatientName, PatientPhone, DoctorId, DoctorName, DepartmentId, DepartmentName, AppointmentDate, SlotTime, Status, QueueNumber, ConsultationFee, PaymentStatus, Notes, IsFollowUp)
VALUES
('5E1C64A7-CE04-4D84-EB64-5F8B0A447D04', '2C8F31E4-9B71-4A51-B831-2C5E7D114A01', N'محمد طارق عبد الله', '01012345678', 'A167851B-1366-4B00-8B3A-D16D422BF8B4', N'د. أحمد الشناوي', 'C5105B89-0A7B-4951-9B73-F9CBC2D28A51', N'القلب والأوعية الدموية', GETDATE(), '01:00 م', 1, 1, 450.00, 1, N'متابعة دورية لقياس ضغط الدم وضبط جرعة الدواء', 0),
('6F2D75B8-DF15-4E95-FC75-6A9C1B558E05', '3D9A42F5-AC82-4B62-C942-3D6F8E225B02', N'مريم أحمد الشاذلي', '01098765432', '658FB01F-60DD-41B9-BB1C-FA668F1AE95E', N'د. سارة المنصوري', '9655B140-8EE8-48FE-965B-4AB306769541', N'طب وجراحة الأسنان', DATEADD(DAY, 1, GETDATE()), '03:30 م', 0, 2, 350.00, 1, N'جلسة تنظيف وتبييض الأسنان بالليزر', 0);
GO

-- 6. Sample Prescriptions
INSERT INTO dbo.Prescriptions (Id, PatientId, PatientName, DoctorId, DoctorName, DepartmentName, Diagnosis, GeneralInstructions, PrescriptionDate, Medications)
VALUES
('8B4F97DA-FA37-40B7-1E97-8CBE3D770F07', '2C8F31E4-9B71-4A51-B831-2C5E7D114A01', N'محمد طارق عبد الله', 'A167851B-1366-4B00-8B3A-D16D422BF8B4', N'د. أحمد الشناوي', N'القلب والأوعية الدموية', N'ارتفاع ضغط الدم من الدرجة الأولى مع زيادة طفيفة بالدهون', N'الالتزام بتقليل الملح في الطعام، ممارسة المشي نصف ساعة يومياً، والمتابعة بعد شهر مع قياس الضغط صباحاً ومساءً.', GETDATE(), 
'[{"name": "Concor 5 Plus (كونكور 5 بلس)", "dosage": "قرص واحد يومياً", "timing": "صباحاً بعد الإفطار", "duration": "لمدة شهر كامل", "instructions": "عدم التوقف المفاجئ عن العلاج"}, {"name": "Atorvastatin 20mg (أتورفاستاتين)", "dosage": "قرص واحد", "timing": "مساءً قبل النوم مباشرة", "duration": "لمدة شهرين", "instructions": "إجراء تحليل وظائف كبد بعد شهرين"}]');
GO

-- 7. Sample Health Vitals
INSERT INTO dbo.HealthVitals (Id, PatientId, BloodPressure, HeartRate, BloodSugar, Temperature, Weight, Height, RecordedAt, Notes)
VALUES
('7A3E86C9-E026-4F06-0D86-7B0D2C669F06', '2C8F31E4-9B71-4A51-B831-2C5E7D114A01', '125/82', 74, 98, 36.8, 82.5, 178.0, GETDATE(), N'مؤشرات حيوية مستقرة وممتازة بعد الالتزام بالعلاج.');
GO

-- 8. Sample Financial Records
INSERT INTO dbo.FinancialRecords (Id, TransactionNumber, PatientId, PatientName, DoctorId, DoctorName, DepartmentName, Amount, InsuranceCoverage, PaymentMethod, TransactionType, Status)
VALUES
('9C5A08EB-0B48-41C8-2F08-9DAF4E881A08', 'TXN-2026-1001', '2C8F31E4-9B71-4A51-B831-2C5E7D114A01', N'محمد طارق عبد الله', 'A167851B-1366-4B00-8B3A-D16D422BF8B4', N'د. أحمد الشناوي', N'القلب والأوعية الدموية', 450.00, 382.50, N'بطاقة فيزا (Visa Card)', N'كشف عيادة تخصصي', 'Paid');
GO

-- 9. Admin Activity Logs
INSERT INTO dbo.ActivityLogs (Id, ActorName, ActorRole, Action, Details, Module, Timestamp)
VALUES
('AD111111-2222-3333-4444-555555555555', N'أ. عبد الرحمن مصطفى', 'SuperAdmin', N'تهيئة قاعدة البيانات', N'تم إنشاء الجداول وبذر البيانات الأساسية للنظام بنجاح على خادم MonsterASP.', 'System', SYSDATETIMEOFFSET());
GO

PRINT '====================================================================';
PRINT 'CareSync Database Created & Seeded Successfully on MonsterASP!';
PRINT '====================================================================';
