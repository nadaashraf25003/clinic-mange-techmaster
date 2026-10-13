using Administration.Domain;
using Appointments.Domain;
using Billing.Domain;
using Departments.Domain;
using Doctors.Domain;
using MedicalRecords.Domain;
using Microsoft.EntityFrameworkCore;
using Patients.Domain;

namespace BuildingBlocks.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task InitializeAsync(ClinicDbContext context, bool forceReset = true)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Departments.AnyAsync())
        {
            if (!forceReset)
            {
                return; // Already seeded
            }

            // Safely clear table contents without dropping the cloud database
            try
            {
                context.ActivityLogs.RemoveRange(context.ActivityLogs);
                context.Appointments.RemoveRange(context.Appointments);
                context.Prescriptions.RemoveRange(context.Prescriptions);
                context.LabReports.RemoveRange(context.LabReports);
                context.HealthVitals.RemoveRange(context.HealthVitals);
                context.FinancialRecords.RemoveRange(context.FinancialRecords);
                context.Patients.RemoveRange(context.Patients);
                context.Doctors.RemoveRange(context.Doctors);
                context.Departments.RemoveRange(context.Departments);
                context.AdminProfiles.RemoveRange(context.AdminProfiles);
                await context.SaveChangesAsync();
            }
            catch
            {
                // In case of FK constraints or empty tables, continue
            }
        }

        // 1. Seed Departments
        var cardioDept = new Department
        {
            Code = "cardiology",
            Name = "القلب والأوعية الدموية",
            NameEn = "Cardiology",
            Icon = "HeartPulse",
            Description = "تشخيص وعلاج أمراض القلب والشرايين بأحدث أجهزة القسطرة ورسم القلب الإيكو ثلاثي الأبعاد.",
            DoctorsCount = 1,
            ColorClass = "from-rose-500 to-red-600",
            IsActive = true
        };

        var dentDept = new Department
        {
            Code = "dentistry",
            Name = "طب وجراحة الأسنان",
            NameEn = "Dentistry",
            Icon = "Smile",
            Description = "زراعة الأسنان الفورية، تجميل الابتسامة (هوليوود سمايل)، وتقويم الأسنان بأحدث التقنيات الرقمية.",
            DoctorsCount = 1,
            ColorClass = "from-cyan-500 to-blue-600",
            IsActive = true
        };

        var orthoDept = new Department
        {
            Code = "orthopedics",
            Name = "العظام والمفاصل",
            NameEn = "Orthopedics",
            Icon = "Activity",
            Description = "علاج خشونة المفاصل، جراحات المناظير الدقيقة واستبدال المفاصل وإصابات الملاعب والتأهيل.",
            DoctorsCount = 1,
            ColorClass = "from-amber-500 to-orange-600",
            IsActive = true
        };

        var pedDept = new Department
        {
            Code = "pediatrics",
            Name = "طب الأطفال وحديثي الولادة",
            NameEn = "Pediatrics",
            Icon = "Smile",
            Description = "رعاية طبية متكاملة لحديثي الولادة والأطفال، برامج التطعيمات، ومتابعة النمو والتغذية العلاجية.",
            DoctorsCount = 1,
            ColorClass = "from-emerald-500 to-teal-600",
            IsActive = true
        };

        var ophthDept = new Department
        {
            Code = "ophthalmology",
            Name = "طب وجراحة العيون",
            NameEn = "Ophthalmology",
            Icon = "Eye",
            Description = "تصحيح الإبصار بالفيمتو ليزك، علاج المياه البيضاء والزرقاء، وفحص قاع العين لمرضى السكري.",
            DoctorsCount = 1,
            ColorClass = "from-indigo-500 to-violet-600",
            IsActive = true
        };

        var neuroDept = new Department
        {
            Code = "neurology",
            Name = "المخ والأعصاب",
            NameEn = "Neurology",
            Icon = "Brain",
            Description = "علاج الصداع المزمن، اضطرابات النوم والذاكرة، أمراض الأعصاب الطرفية وجراحات العمود الفقري.",
            DoctorsCount = 1,
            ColorClass = "from-purple-500 to-pink-600",
            IsActive = true
        };

        await context.Departments.AddRangeAsync(cardioDept, dentDept, orthoDept, pedDept, ophthDept, neuroDept);
        await context.SaveChangesAsync();

        // 2. Seed Doctors with passwords
        var doc1 = new Doctor
        {
            Name = "د. أحمد الشناوي",
            Title = "استشاري أول أمراض القلب والقسطرة التداخلية",
            DepartmentId = cardioDept.Id,
            DepartmentCode = cardioDept.Code,
            DepartmentName = cardioDept.Name,
            ExperienceYears = 16,
            Rating = 4.9,
            ReviewCount = 340,
            ConsultationFee = 450,
            ImageUrl = "/doctors/doctor-ahmed.jpg",
            Specialties = ["قسطرة الشرايين التاجية", "رسم القلب بالمجهود", "علاج ارتفاع ضغط الدم المعقد"],
            AvailableDays = ["السبت", "الإثنين", "الأربعاء"],
            IsActive = true,
            Phone = "01011223344",
            Email = "ahmed.shennawy@caresync.com",
            Password = "doctor123",
            RoomNumber = "عيادة 201 - الدور الثاني"
        };

        var doc2 = new Doctor
        {
            Name = "د. سارة المنصوري",
            Title = "استشارية طب وجراحة الفم والأسنان وتجميل الابتسامة",
            DepartmentId = dentDept.Id,
            DepartmentCode = dentDept.Code,
            DepartmentName = dentDept.Name,
            ExperienceYears = 12,
            Rating = 4.95,
            ReviewCount = 280,
            ConsultationFee = 350,
            ImageUrl = "/doctors/doctor-sara.jpg",
            Specialties = ["تجميل الأسنان والفينير", "زراعة الأسنان الرقمية", "علاج الجذور بالمايكروسكوب"],
            AvailableDays = ["الأحد", "الثلاثاء", "الخميس"],
            IsActive = true,
            Phone = "01022334455",
            Email = "sara.mansoury@caresync.com",
            Password = "doctor123",
            RoomNumber = "عيادة 102 - الدور الأرضي"
        };

        var doc3 = new Doctor
        {
            Name = "د. يوسف عبد الرحمن",
            Title = "استشاري جراحة العظام والمفاصل الصناعية وإصابات الملاعب",
            DepartmentId = orthoDept.Id,
            DepartmentCode = orthoDept.Code,
            DepartmentName = orthoDept.Name,
            ExperienceYears = 18,
            Rating = 4.88,
            ReviewCount = 410,
            ConsultationFee = 400,
            ImageUrl = "/doctors/doctor-youssef.jpg",
            Specialties = ["استبدال مفاصل الركبة والحوض", "مناظير الكتف والركبة", "علاج خشونة الفقرات"],
            AvailableDays = ["السبت", "الثلاثاء", "الأربعاء"],
            IsActive = true,
            Phone = "01033445566",
            Email = "youssef.rahman@caresync.com",
            Password = "doctor123",
            RoomNumber = "عيادة 208 - الدور الثاني"
        };

        var doc4 = new Doctor
        {
            Name = "د. نورهان المهدي",
            Title = "استشارية طب الأطفال ورعاية المبتسرين وحديثي الولادة",
            DepartmentId = pedDept.Id,
            DepartmentCode = pedDept.Code,
            DepartmentName = pedDept.Name,
            ExperienceYears = 14,
            Rating = 4.92,
            ReviewCount = 520,
            ConsultationFee = 300,
            ImageUrl = "/doctors/doctor-nourhan.jpg",
            Specialties = ["متابعة نمو الرضع والمبتسرين", "حساسية الصدر والأكزيما", "التغذية العلاجية للأطفال"],
            AvailableDays = ["السبت", "الأحد", "الإثنين", "الأربعاء"],
            IsActive = true,
            Phone = "01044556677",
            Email = "nourhan.mahdy@caresync.com",
            Password = "doctor123",
            RoomNumber = "عيادة 305 - الدور الثالث"
        };

        await context.Doctors.AddRangeAsync(doc1, doc2, doc3, doc4);
        await context.SaveChangesAsync();

        // 3. Seed Default Patient Profiles
        var patient1 = new PatientProfile
        {
            Name = "محمد عبد الله الشريف",
            Phone = "01012345678",
            Email = "mohamed.elsharif@example.com",
            NationalId = "29408150102433",
            Gender = "male",
            BirthDate = "1994-08-15",
            Age = 32,
            BloodType = "O+",
            ChronicConditions = ["ارتفاع ضغط الدم الخفيف (مسيطر عليه)", "حساسية موسمية"],
            Allergies = ["بنسلين (Penicillin)", "سلفا (Sulfonamides)"],
            EmergencyContact = new EmergencyContactInfo
            {
                Name = "فاطمة أحمد (الزوجة)",
                Relation = "زوجة",
                Phone = "01098765432"
            },
            Insurance = new InsuranceInfo
            {
                Provider = "شركة بوبا للتأمين الطبي (Bupa Egypt)",
                PolicyNumber = "BUP-2026-884920",
                CoveragePercentage = 80,
                ExpiryDate = "2027-01-31"
            },
            PinCode = "1234"
        };

        var patient2 = new PatientProfile
        {
            Name = "منى محمود زكريا",
            Phone = "01098765432",
            Email = "mona.zakaria@example.com",
            NationalId = "29805120109822",
            Gender = "female",
            BirthDate = "1998-05-12",
            Age = 28,
            BloodType = "A+",
            ChronicConditions = [],
            Allergies = ["حساسية الفول السوداني"],
            EmergencyContact = new EmergencyContactInfo
            {
                Name = "محمود زكريا (الوالد)",
                Relation = "والد",
                Phone = "01011122233"
            },
            Insurance = new InsuranceInfo
            {
                Provider = "ميدنت مصر (MedNet)",
                PolicyNumber = "MED-2026-102938",
                CoveragePercentage = 70,
                ExpiryDate = "2026-12-31"
            },
            PinCode = "1234"
        };

        await context.Patients.AddRangeAsync(patient1, patient2);
        await context.SaveChangesAsync();

        // 4. Seed Appointments
        var apt1 = new Appointment
        {
            BookingReference = "CS-849201",
            PatientId = patient1.Id,
            PatientName = patient1.Name,
            PatientPhone = patient1.Phone,
            PatientAge = patient1.Age,
            PatientGender = patient1.Gender,
            BloodType = patient1.BloodType,
            DoctorId = doc1.Id,
            DoctorName = doc1.Name,
            DoctorSpecialty = doc1.Title,
            DoctorImage = doc1.ImageUrl,
            DepartmentId = cardioDept.Id,
            DepartmentName = cardioDept.Name,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Time = "06:30 م",
            Status = "upcoming",
            QueueStatus = "waiting",
            QueueNumber = 1,
            RoomNumber = doc1.RoomNumber,
            ConsultationFee = doc1.ConsultationFee,
            PaymentStatus = "insurance_covered",
            ChiefComplaint = "ألم متقطع في الصدر مع المجهود وشعور بضيق في التنفس",
            Notes = "متابعة دورية لضغط الدم ورسم قلب بالمجهود"
        };

        var apt2 = new Appointment
        {
            BookingReference = "CS-732049",
            PatientId = patient1.Id,
            PatientName = patient1.Name,
            PatientPhone = patient1.Phone,
            PatientAge = patient1.Age,
            PatientGender = patient1.Gender,
            BloodType = patient1.BloodType,
            DoctorId = doc2.Id,
            DoctorName = doc2.Name,
            DoctorSpecialty = doc2.Title,
            DoctorImage = doc2.ImageUrl,
            DepartmentId = dentDept.Id,
            DepartmentName = dentDept.Name,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Time = "04:00 م",
            Status = "upcoming",
            QueueStatus = "waiting",
            QueueNumber = 2,
            RoomNumber = doc2.RoomNumber,
            ConsultationFee = doc2.ConsultationFee,
            PaymentStatus = "pending",
            ChiefComplaint = "تنظيف جير وتلميع أسنان وفحص الحشو القديم",
            Notes = "جلسة تنظيف وتلميع وإزالة الرواسب الجيرية"
        };

        var apt3 = new Appointment
        {
            BookingReference = "CS-521093",
            PatientId = patient1.Id,
            PatientName = patient1.Name,
            PatientPhone = patient1.Phone,
            PatientAge = patient1.Age,
            PatientGender = patient1.Gender,
            BloodType = patient1.BloodType,
            DoctorId = doc3.Id,
            DoctorName = doc3.Name,
            DoctorSpecialty = doc3.Title,
            DoctorImage = doc3.ImageUrl,
            DepartmentId = orthoDept.Id,
            DepartmentName = orthoDept.Name,
            Date = DateTime.UtcNow.AddDays(-2).ToString("yyyy-MM-dd"),
            Time = "05:00 م",
            Status = "completed",
            QueueStatus = "completed",
            QueueNumber = 1,
            RoomNumber = doc3.RoomNumber,
            ConsultationFee = doc3.ConsultationFee,
            PaymentStatus = "paid",
            DiagnosisSummary = "التواء خفيف في أربطة الكاحل الأيمن مع التهاب موضعي",
            Notes = "تم فحص المفصل وإجراء أشعة عادية - لا توجد كسور"
        };

        var apt4 = new Appointment
        {
            BookingReference = "CS-918234",
            PatientId = patient2.Id,
            PatientName = patient2.Name,
            PatientPhone = patient2.Phone,
            PatientAge = patient2.Age,
            PatientGender = patient2.Gender,
            BloodType = patient2.BloodType,
            DoctorId = doc4.Id,
            DoctorName = doc4.Name,
            DoctorSpecialty = doc4.Title,
            DoctorImage = doc4.ImageUrl,
            DepartmentId = pedDept.Id,
            DepartmentName = pedDept.Name,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Time = "03:30 م",
            Status = "upcoming",
            QueueStatus = "waiting",
            QueueNumber = 1,
            RoomNumber = doc4.RoomNumber,
            ConsultationFee = doc4.ConsultationFee,
            PaymentStatus = "paid",
            ChiefComplaint = "فحص روتيني للأطفال ومتابعة التطعيمات الموسمية",
            Notes = "استشارة طبية وتغذية علاجية"
        };

        await context.Appointments.AddRangeAsync(apt1, apt2, apt3, apt4);
        await context.SaveChangesAsync();

        // 5. Seed Prescriptions
        var rx1 = new Prescription
        {
            PrescriptionNumber = "RX-2026-8812",
            AppointmentId = apt3.Id,
            PatientId = patient1.Id,
            PatientName = patient1.Name,
            DoctorId = doc3.Id,
            DoctorName = doc3.Name,
            DoctorSpecialty = doc3.Title,
            DoctorImage = doc3.ImageUrl,
            Date = apt3.Date,
            Diagnosis = "التهاب حاد بأوتار الكاحل الأيمن وإجهاد عضلي",
            Notes = "الراحة التامة لمدة 3 أيام مع وضع كمادات باردة وتجنب الأحمال الزائدة.",
            NextVisitDate = DateTime.UtcNow.AddDays(14).ToString("yyyy-MM-dd"),
            Medications =
            [
                new MedicationItem
                {
                    Name = "سيلبريكس (Celebrex) 200mg",
                    Dosage = "كبسولة واحدة",
                    Frequency = "مرة يومياً بعد الغداء",
                    Duration = "7 أيام",
                    Instructions = "مضاد للالتهاب والمسكنات، يُفضل تناوله مع كوب ماء كامل بعد وجبة طعام رئيسية."
                },
                new MedicationItem
                {
                    Name = "ريباديرم جل (Reparil Gel N)",
                    Dosage = "طبقة رقيقة موضعية",
                    Frequency = "3 مرات يومياً",
                    Duration = "10 أيام",
                    Instructions = "دهان موضعي مع تدليك خفيف جداً على الكاحل بدون ضغط مباشر."
                }
            ]
        };

        var rx2 = new Prescription
        {
            PrescriptionNumber = "RX-2026-7241",
            PatientId = patient1.Id,
            PatientName = patient1.Name,
            DoctorId = doc1.Id,
            DoctorName = doc1.Name,
            DoctorSpecialty = doc1.Title,
            DoctorImage = doc1.ImageUrl,
            Date = DateTime.UtcNow.AddDays(-10).ToString("yyyy-MM-dd"),
            Diagnosis = "متابعة تنظيم ضغط الدم الأساسي والدهون الثلاثية",
            Notes = "الالتزام بحمية قليلة الملح وممارسة رياضة المشي الخفيف 30 دقيقة يومياً.",
            NextVisitDate = DateTime.UtcNow.AddMonths(1).ToString("yyyy-MM-dd"),
            Medications =
            [
                new MedicationItem
                {
                    Name = "كونكور بلس (Concor Plus) 5/12.5mg",
                    Dosage = "قرص واحد",
                    Frequency = "صباحاً يومياً قبل الإفطار",
                    Duration = "مستمر (علاج مزمن)",
                    Instructions = "علاج الضغط، لا توقف الدواء دون مراجعة الطبيب المعالج."
                },
                new MedicationItem
                {
                    Name = "أوميجا 3 بلس (Omega 3 Plus)",
                    Dosage = "كبسولة واحدة",
                    Frequency = "مرة يومياً وسط الأكل",
                    Duration = "3 شهور",
                    Instructions = "مكمل لدعم صحة الأوعية الدموية وضبط نسبة الكوليسترول النافع."
                }
            ]
        };

        await context.Prescriptions.AddRangeAsync(rx1, rx2);
        await context.SaveChangesAsync();

        // 6. Seed Lab Reports
        var lab1 = new LabReport
        {
            ReportNumber = "LAB-2026-4401",
            PatientId = patient1.Id,
            PatientName = patient1.Name,
            TestName = "فحص صورة الدم الكاملة والدهون (CBC & Lipid Profile)",
            Category = "تحاليل دم",
            Date = DateTime.UtcNow.AddDays(-5).ToString("yyyy-MM-dd"),
            OrderedByDoctor = "د. أحمد الشناوي",
            Status = "completed",
            Summary = "جميع المؤشرات العامة ضمن المعدلات الطبيعية الآمنة مع تحسن واضح في نسبة الدهون الثلاثية.",
            Results =
            [
                new LabResultItem { Name = "الهيموجلوبين (Hemoglobin)", Result = "14.8", Unit = "g/dL", NormalRange = "13.5 - 17.5", IsAbnormal = false },
                new LabResultItem { Name = "كرات الدم البيضاء (WBC)", Result = "6.9", Unit = "x10^3/µL", NormalRange = "4.5 - 11.0", IsAbnormal = false },
                new LabResultItem { Name = "الكوليسترول الكلي (Total Cholesterol)", Result = "182", Unit = "mg/dL", NormalRange = "< 200", IsAbnormal = false },
                new LabResultItem { Name = "الدهون الثلاثية (Triglycerides)", Result = "142", Unit = "mg/dL", NormalRange = "< 150", IsAbnormal = false }
            ]
        };

        var lab2 = new LabReport
        {
            ReportNumber = "LAB-2026-3912",
            PatientId = patient1.Id,
            PatientName = patient1.Name,
            TestName = "أشعة سينية رقمية على الكاحل الأيمن (X-Ray Right Ankle AP/Lat)",
            Category = "أشعة ومناظير",
            Date = DateTime.UtcNow.AddDays(-2).ToString("yyyy-MM-dd"),
            OrderedByDoctor = "د. يوسف عبد الرحمن",
            Status = "completed",
            Summary = "كثافة عظام طبيعية وسليمة، المسافات المفصلية محفوظة تماماً، لا توجد شروخ أو كسور عظمية.",
            Results =
            [
                new LabResultItem { Name = "سلامة القصبة والشظية", Result = "سليمة تماماً", Unit = "-", NormalRange = "لا يوجد كسر", IsAbnormal = false },
                new LabResultItem { Name = "المسافة المفصلية (Joint Space)", Result = "طبيعية 3.5mm", Unit = "mm", NormalRange = "3.0 - 4.0", IsAbnormal = false }
            ]
        };

        await context.LabReports.AddRangeAsync(lab1, lab2);

        // 7. Seed Health Vitals
        var vitals = new List<HealthVitalRecord>
        {
            new() { PatientId = patient1.Id, PatientName = patient1.Name, Date = DateTime.UtcNow.AddDays(-1), BloodPressureSystolic = 122, BloodPressureDiastolic = 78, BloodSugar = 94, HeartRate = 72, Weight = 78.5, Temperature = 36.8, Notes = "قراءة صباحية ممتازة بعد الإفطار بساعتين" },
            new() { PatientId = patient1.Id, PatientName = patient1.Name, Date = DateTime.UtcNow.AddDays(-3), BloodPressureSystolic = 125, BloodPressureDiastolic = 82, BloodSugar = 98, HeartRate = 75, Weight = 78.7, Temperature = 36.7, Notes = "ضغط مستقر ومعدل نبض طبيعي" },
            new() { PatientId = patient1.Id, PatientName = patient1.Name, Date = DateTime.UtcNow.AddDays(-7), BloodPressureSystolic = 128, BloodPressureDiastolic = 84, BloodSugar = 102, HeartRate = 78, Weight = 79.0, Temperature = 36.9, Notes = "بعد تمرين مشي خفيف" }
        };

        await context.HealthVitals.AddRangeAsync(vitals);

        // 8. Seed Notifications
        var notifs = new List<PatientNotification>
        {
            new() { PatientId = patient1.Id, Title = "تذكير بالموعد القادم", Message = "موعدك مع د. أحمد الشناوي اليوم الساعة 06:30 م في عيادة 201.", Date = "اليوم", Type = "appointment", Read = false },
            new() { PatientId = patient1.Id, Title = "صدور نتائج الفحوصات المعملية", Message = "تم اعتماد وإرفاق تقرير فحص صورة الدم الكاملة والدهون في سجلك الطبي.", Date = "منذ 3 ساعات", Type = "lab", Read = false },
            new() { PatientId = patient1.Id, Title = "تأكيد تجديد الروشتة العلاجية", Message = "أضاف د. يوسف عبد الرحمن تعليمات جديدة للعلاج الطبيعي لروشتتك الأخيرة.", Date = "أمس", Type = "prescription", Read = true }
        };

        await context.Notifications.AddRangeAsync(notifs);

        // 9. Seed Financials
        var financials = new List<ClinicFinancialRecord>
        {
            new() { InvoiceNumber = "INV-2026-0841", PatientId = patient1.Id, PatientName = patient1.Name, DoctorName = "د. أحمد الشناوي", DepartmentName = "القلب والأوعية الدموية", Amount = 450, PaymentMethod = "insurance", InsuranceProvider = "شركة بوبا للتأمين الطبي (80%)", InsuranceCoverage = 360, Status = "paid", Date = DateTime.UtcNow.ToString("yyyy-MM-dd"), Time = "06:30 م" },
            new() { InvoiceNumber = "INV-2026-0842", PatientName = "أ. منى محمود زكريا", DoctorName = "د. أحمد الشناوي", DepartmentName = "القلب والأوعية الدموية", Amount = 450, PaymentMethod = "card", Status = "paid", Date = DateTime.UtcNow.ToString("yyyy-MM-dd"), Time = "07:00 م" },
            new() { InvoiceNumber = "INV-2026-0843", PatientId = patient1.Id, PatientName = patient1.Name, DoctorName = "د. يوسف عبد الرحمن", DepartmentName = "العظام والمفاصل", Amount = 400, PaymentMethod = "cash", Status = "paid", Date = DateTime.UtcNow.AddDays(-2).ToString("yyyy-MM-dd"), Time = "05:00 م" },
            new() { InvoiceNumber = "INV-2026-0844", PatientName = "كريم حسام الدين", DoctorName = "د. نورهان المهدي", DepartmentName = "طب الأطفال وحديثي الولادة", Amount = 300, PaymentMethod = "cash", Status = "paid", Date = DateTime.UtcNow.ToString("yyyy-MM-dd"), Time = "03:30 م" }
        };

        await context.FinancialRecords.AddRangeAsync(financials);

        // 10. Seed Admin Profile & Activity Logs
        var admin = new AdminProfile
        {
            Name = "أ. د. عبد الرحمن القاضي",
            Role = "المدير التنفيذي والطبي العام",
            Username = "admin",
            Email = "admin@caresync.com",
            Password = "admin123",
            Phone = "01009988776",
            AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
            PinCode = "1234"
        };

        var logs = new List<AdminActivityLog>
        {
            new() { Title = "تأكيد حجز كشف جديد", Description = "تم حجز موعد للمريض محمد عبد الله مع د. أحمد الشناوي", Time = "منذ 10 دقائق", Type = "appointment" },
            new() { Title = "تحصيل فاتورة تأمينية", Description = "تم اعتماد تغطية 80% من شركة بوبا للفاتورة INV-2026-0841", Time = "منذ 25 دقيقة", Type = "finance" },
            new() { Title = "تحديث حالة الطبيب", Description = "تم بدء مناوبة د. يوسف عبد الرحمن في عيادة العظام", Time = "منذ ساعة", Type = "doctor" },
            new() { Title = "إصدار تقرير الإيرادات", Description = "تم تصدير ملخص التسوية المالية اليومية الصباحية", Time = "منذ 3 ساعات", Type = "system" }
        };

        await context.AdminProfiles.AddAsync(admin);
        await context.ActivityLogs.AddRangeAsync(logs);

        await context.SaveChangesAsync();
    }
}
