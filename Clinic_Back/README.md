#  CareSync - Clinic Management Backend (.NET 10 / Clean Architecture & CQRS)

نظام وإطار العمل الخلفي (Backend) المتكامل لمنظومة إدارة العيادات والمراكز الطبية **CareSync**، مبني بأحدث معايير هندسة البرمجيات باستخدام **.NET 10**، ونمط **Modular Clean Architecture** مع **CQRS** و **MediatR** و **Minimal APIs** و **Entity Framework Core**.

---

##  البنية المعمارية (Solution Architecture)

تم تقسيم المشروع إلى **25 مشروعاً** بنمط الموديلات المعيارية المستقلة (Modular Monolith):

```text
Clinic_Back/
├── Clinic.sln                               # ملف الحل الرئيسي
└── src/
    ├── BuildingBlocks/                      # المشتركات الأساسية المعمارية
    │   ├── BuildingBlocks.Domain/           # Entity, AuditableEntity, Result<T>, Error, IDomainEvent
    │   ├── BuildingBlocks.Application/      # CQRS (ICommand, IQuery, ICommandHandler), Pipeline Behaviors
    │   └── BuildingBlocks.Infrastructure/   # ClinicDbContext, SeedData, AuditableEntityInterceptor
    │
    ├── Host/
    │   └── Clinic.Api/                      # تطبيق ومسارات الـ Minimal APIs المجمعة
    │       ├── Endpoints/                   # جميع نقاط النهاية المجمعة تبدأ بـ /clinic/...
    │       │   ├── AuthEndpoints.cs         # /clinic/auth/...
    │       │   ├── DepartmentEndpoints.cs   # /clinic/departments/...
    │       │   ├── DoctorEndpoints.cs       # /clinic/doctors/...
    │       │   ├── PatientEndpoints.cs      # /clinic/patients/...
    │       │   ├── AppointmentEndpoints.cs  # /clinic/appointments/...
    │       │   ├── MedicalRecordEndpoints.cs# /clinic/medical-records/...
    │       │   ├── FinanceEndpoints.cs      # /clinic/finances/...
    │       │   └── AdminEndpoints.cs        # /clinic/admin/...
    │       │
    │       ├── Middleware/                  # ExceptionHandlingMiddleware, RequestLoggingMiddleware
    │       ├── Program.cs                   # إعداد حقن التبعيات (DI)، الـ CORS، و Swagger
    │       └── appsettings.json             # نصوص الاتصال بقاعدة البيانات
    │
    └── Modules/                             # الوحدات الوظيفية المستقلة
        ├── Departments/                     # وحدة الأقسام والعيادات المتخصصة
        ├── Doctors/                         # وحدة الأطباء وإدارة الطابور والأتعاب
        ├── Patients/                        # وحدة بوابة وسجلات ومؤشرات المرضى
        ├── Appointments/                    # وحدة الحجوزات والمواعيد
        ├── MedicalRecords/                  # وحدة الروشتات والتحاليل والملاحظات الطبية
        ├── Billing/                         # وحدة الفواتير والمطالبات التأمينية والإيرادات
        └── Administration/                  # وحدة المشرف وسجل العمليات والإحصائيات
```

---

##  دليل نقاط النهاية (API Endpoints Catalog)

جميع نقاط النهاية تبدأ بـ **/clinic/...**:

### 1.  الأقسام والعيادات (`/clinic/departments`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/departments` | عرض جميع الأقسام الطبية والعيادات المتخصصة |
| `GET` | `/clinic/departments/{id}` | عرض تفاصيل قسم طبي محدد |
| `POST` | `/clinic/departments` | إضافة قسم أو عيادة جديدة |
| `PUT` | `/clinic/departments/{id}` | تعديل بيانات قسم طبي |
| `DELETE` | `/clinic/departments/{id}` | حذف قسم طبي |

---

### 2.  الأطباء والاستشاريين (`/clinic/doctors`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/doctors` | عرض قائمة الأطباء مع إمكانية الفلترة (`?departmentId=...&search=...`) |
| `GET` | `/clinic/doctors/{id}` | عرض الملف التعريفي الكامل للطبيب |
| `GET` | `/clinic/doctors/{id}/queue` | عرض طابور الانتظار وحالات المرضى لليوم الحالي |
| `GET` | `/clinic/doctors/{id}/finances` | عرض إحصائيات الدخل المالي وجلسات الكشف |
| `POST` | `/clinic/doctors` | إضافة طبيب جديد إلى المنظومة الطبية |
| `PUT` | `/clinic/doctors/{id}` | تعديل بيانات وملف الطبيب |
| `PUT` | `/clinic/doctors/{id}/toggle-status` | تفعيل أو تعطيل حساب الطبيب |
| `PUT` | `/clinic/doctors/{id}/fee` | تحديث سعر كشف الطبيب |
| `DELETE` | `/clinic/doctors/{id}` | حذف طبيب من المنظومة |

---

### 3.  بوابة وملف المريض (`/clinic/patients`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/patients/me` | عرض الملف الطبي والبيانات الشخصية للمريض الحالي |
| `PUT` | `/clinic/patients/me` | تحديث الملف الطبي والبيانات الشخصية للمريض |
| `GET` | `/clinic/patients/me/vitals` | عرض سجل المؤشرات الحيوية وضغط الدم والسكر |
| `POST` | `/clinic/patients/me/vitals` | تسجيل قياس مؤشرات حيوية جديدة للمريض |
| `GET` | `/clinic/patients/me/notifications` | عرض الإشعارات وتنبيهات المواعيد والتحاليل |
| `PUT` | `/clinic/patients/me/notifications/{id}/read` | تحديد إشعار كمقروء |
| `PUT` | `/clinic/patients/me/notifications/read-all` | تحديد جميع الإشعارات كمقروءة |

---

### 4.  حجوزات المواعيد (`/clinic/appointments`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/appointments` | عرض المواعيد مع إمكانية الفلترة (`?patientId=...&doctorId=...&status=...&date=...`) |
| `GET` | `/clinic/appointments/{id}` | عرض تفاصيل حجز موعد محدد |
| `POST` | `/clinic/appointments/quick-book` | حجز موعد سريع من الصفحة الرئيسية للعيادة |
| `POST` | `/clinic/appointments/book` | حجز موعد جديد من بوابة المريض أو لوحة الإدارة |
| `POST` | `/clinic/appointments/{id}/cancel` | إلغاء حجز موعد مع تحديد السبب |
| `POST` | `/clinic/appointments/{id}/reschedule` | تعديل تاريخ وتوقيت حجز موعد |
| `PUT` | `/clinic/appointments/{id}/status` | تحديث حالة الموعد (`upcoming`, `completed`, `cancelled`) |
| `DELETE` | `/clinic/appointments/{id}` | حذف موعد من النظام |

---

### 5.  السجلات والروشتات والتحاليل (`/clinic/medical-records`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/medical-records/prescriptions` | عرض قائمة الروشتات الطبية مع الأدوية والجرعات |
| `GET` | `/clinic/medical-records/prescriptions/{id}` | عرض تفاصيل روشتة طبية محددة |
| `POST` | `/clinic/medical-records/prescriptions` | إصدار روشتة علاجية جديدة |
| `GET` | `/clinic/medical-records/lab-reports` | عرض قائمة تقارير التحاليل الطبية والأشعة |
| `GET` | `/clinic/medical-records/lab-reports/{id}` | عرض نتائج ومؤشرات تقرير معملي محدد |
| `POST` | `/clinic/medical-records/consultations` | حفظ ملاحظات الكشف والتشخيص الطبي للطبيب |

---

### 6.  الفواتير والإيرادات (`/clinic/finances`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/finances` | عرض السجلات المالية وفواتير المرضى والمطالبات التأمينية |
| `POST` | `/clinic/finances` | إصدار فاتورة أو سند مالي جديد |

---

### 7.  لوحة المشرف والإحصائيات (`/clinic/admin`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/admin/profile` | عرض بيانات المدير الطبي والتنفيذي |
| `GET` | `/clinic/admin/stats` | عرض المؤشرات الرئيسية وإحصائيات المنظومة الطبية |
| `GET` | `/clinic/admin/activity-logs` | عرض سجل العمليات والأنشطة الإدارية في العيادة |

---

### 8.  تسجيل الدخول والمصادقة (`/clinic/auth`)
| Method | Endpoint | الوصف |
|---|---|---|
| `POST` | `/clinic/auth/patient/login` | تسجيل دخول المريض برقم الهاتف أو البريد |
| `POST` | `/clinic/auth/patient/register` | إنشاء حساب مريض جديد |
| `POST` | `/clinic/auth/doctor/login` | تسجيل دخول الطبيب |
| `POST` | `/clinic/auth/admin/login` | تسجيل دخول المشرف برقم PIN |

---

##  التقنيات المستخدمة (Tech Stack)

* **.NET 10.0 / C# 13**
* **Entity Framework Core** مع SQLite (`clinic.db`) ودعم التهجيرات التلقائية
* **MediatR & CQRS Pattern**
* **FluentValidation** للتحقق التلقائي من صحة المدخلات داخل الـ Pipeline
* **Result Monad Pattern (`Result<T>`)** لمعالجة الأخطاء بصورة وظيفية نظيفة
* **Swashbuckle Swagger UI** للتوثيق التفاعلي
* **CORS Policy** مهيأة للاتصال المباشر مع واجهة الـ React Vite

---

##  تشغيل الباك إند (How to Run)

```powershell
# 1. الدخول إلى مجلد الباك إند
cd Clinic_Back

# 2. تشغيل السيرفر على المنفذ 5100
dotnet run --project src/Host/Clinic.Api/Clinic.Api.csproj --urls "http://localhost:5100"
```

* **صفحة التوثيق التفاعلية (Swagger UI)**: [http://localhost:5100/swagger](http://localhost:5100/swagger)
* **المسار الترحيبي والتأكد من الصحة**: [http://localhost:5100/](http://localhost:5100/)
