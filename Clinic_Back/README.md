# 🏥 CareSync - Clinic Management Backend (.NET 10 / Clean Architecture & CQRS)

نظام وإطار العمل الخلفي المتكامل لمنظومة إدارة العيادات والمراكز الطبية **CareSync**، مبني بأحدث معايير هندسة البرمجيات باستخدام **.NET 10**، ونمط **Modular Clean Architecture** مع **CQRS** و **MediatR** و **Minimal APIs** و **Entity Framework Core** وقاعدة بيانات **Microsoft SQL Server**.

---

## 🌐 روابط الإنتاج الحية (Live Production URLs)

* 🚀 **رابط الباك إند المباشر (Production API)**:  
  [https://tech-master-clinic-management.runasp.net/](https://tech-master-clinic-management.runasp.net/)
* 📑 **توثيق الواجهة التفاعلي (Swagger UI)**:  
  [https://tech-master-clinic-management.runasp.net/swagger](https://tech-master-clinic-management.runasp.net/swagger)
* 🔗 **مسار الـ API الموحد (Base Prefix)**:  
  `https://tech-master-clinic-management.runasp.net/clinic`

---

## 🏛️ البنية المعمارية (Solution Architecture)

تم تقسيم الحل إلى **25 مشروعاً** بنمط الموديلات المعمارية المستقلة (Modular Monolith):

```text
Clinic_Back/
├── Clinic.slnx                               # ملف الحل البرمجي (.NET Solution)
├── MonsterASP_CareSync_Database.sql          # سكريبت تهيئة وهيكلة قاعدة بيانات SQL Server
└── src/
    ├── BuildingBlocks/                       # المشتركات الأساسية المعمارية
    │   ├── BuildingBlocks.Domain/            # Entity, AuditableEntity, Result<T>, Error, IDomainEvent
    │   ├── BuildingBlocks.Application/       # CQRS (ICommand, IQuery, ICommandHandler), Pipeline Behaviors
    │   └── BuildingBlocks.Infrastructure/    # ClinicDbContext, SeedData, AuditableEntityInterceptor
    │
    ├── Host/
    │   └── Clinic.Api/                       # تطبيق ومسارات الـ Minimal APIs المجمعة
    │       ├── Endpoints/                    # نقاط النهاية (Endpoints) لجميع الوحدات
    │       │   ├── AuthEndpoints.cs          # /clinic/auth/...
    │       │   ├── DepartmentEndpoints.cs    # /clinic/departments/...
    │       │   ├── DoctorEndpoints.cs        # /clinic/doctors/...
    │       │   ├── PatientEndpoints.cs       # /clinic/patients/...
    │       │   ├── AppointmentEndpoints.cs   # /clinic/appointments/...
    │       │   ├── MedicalRecordEndpoints.cs # /clinic/medical-records/...
    │       │   ├── FinanceEndpoints.cs       # /clinic/finances/...
    │       │   └── AdminEndpoints.cs         # /clinic/admin/...
    │       │
    │       ├── Middleware/                   # ExceptionHandlingMiddleware, RequestLoggingMiddleware
    │       ├── Properties/PublishProfiles/   # إعدادات النشر السحابي (WebDeploy)
    │       ├── Program.cs                    # إعداد حقن التبعيات (DI)، الـ CORS، و Swagger
    │       └── appsettings.json              # نصوص الاتصال بقاعدة البيانات
    │
    └── Modules/                              # الوحدات الوظيفية المستقلة
        ├── Departments/                      # وحدة الأقسام والعيادات المتخصصة
        ├── Doctors/                          # وحدة الأطباء وإدارة الطابور والأتعاب
        ├── Patients/                         # وحدة بوابة وسجلات ومؤشرات المرضى
        ├── Appointments/                     # وحدة الحجوزات والمواعيد
        ├── MedicalRecords/                   # وحدة الروشتات والتحاليل والملاحظات الطبية
        ├── Billing/                          # وحدة الفواتير والمطالبات التأمينية والإيرادات
        └── Administration/                   # وحدة المشرف وسجل العمليات والإحصائيات
```

---

## 📚 دليل نقاط النهاية (API Endpoints Catalog)

جميع مسارات الـ API تبدأ بالبادئة الموحدة: `https://tech-master-clinic-management.runasp.net/clinic`

### 1. 🔐 تسجيل الدخول والمصادقة (`/clinic/auth`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/auth/patient/check?identifier=...` | التحقق من وجود حساب مريض برقم الهاتف أو البريد |
| `POST` | `/clinic/auth/patient/login` | تسجيل دخول المريض |
| `POST` | `/clinic/auth/patient/register` | إنشاء حساب مريض جديد مع الملف الطبي الأولي |
| `POST` | `/clinic/auth/doctor/login` | تسجيل دخول الطبيب برقم الهوية وكلمة المرور |
| `POST` | `/clinic/auth/admin/login` | تسجيل دخول المشرف برمز الأمان (PIN) |

---

### 2. 🏥 الأقسام والعيادات (`/clinic/departments`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/departments` | استرجاع جميع الأقسام الطبية والعيادات المتخصصة |
| `GET` | `/clinic/departments/{id}` | استرجاع تفاصيل قسم طبي محدد |
| `POST` | `/clinic/departments` | إضافة قسم أو عيادة جديدة |
| `PUT` | `/clinic/departments/{id}` | تعديل بيانات قسم طبي |
| `DELETE` | `/clinic/departments/{id}` | حذف قسم طبي |

---

### 3. 👨‍⚕️ الأطباء والاستشاريين (`/clinic/doctors`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/doctors` | استرجاع قائمة الأطباء مع الفلترة بالقسم أو البحث (`?departmentId=...&search=...`) |
| `GET` | `/clinic/doctors/{id}` | عرض الملف التعريفي الكامل للطبيب وساعات العمل وسعر الكشف |
| `GET` | `/clinic/doctors/{id}/queue` | استرجاع طابور انتظار المرضى لليوم الحالي وحالاتهم |
| `GET` | `/clinic/doctors/{id}/finances` | استرجاع إحصائيات الدخل المالي ونسب الاستشارة |
| `POST` | `/clinic/doctors` | إضافة طبيب جديد للمنظومة |
| `PUT` | `/clinic/doctors/{id}` | تحديث بيانات الطبيب |
| `PUT` | `/clinic/doctors/{id}/toggle-status` | تفعيل أو تعطيل حساب الطبيب |
| `PUT` | `/clinic/doctors/{id}/fee` | تحديث سعر كشف الطبيب |
| `DELETE` | `/clinic/doctors/{id}` | حذف طبيب من المنظومة |

---

### 4. 🧑‍🤝‍🧑 بوابة وملف المريض (`/clinic/patients`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/patients/me` | استرجاع الملف الطبي والبيانات الشخصية للمريض |
| `PUT` | `/clinic/patients/me` | تحديث الملف الطبي للمريض (فصيلة الدم، الحساسية، الأمراض المزمنة) |
| `GET` | `/clinic/patients/me/vitals` | استرجاع سجل المؤشرات الحيوية (الضغط، السكر، النبض، الحرارة) |
| `POST` | `/clinic/patients/me/vitals` | تسجيل قياس مؤشرات حيوية جديدة للمريض |
| `GET` | `/clinic/patients/me/notifications` | استرجاع تنبيهات المواعيد وجاهزية التحاليل |
| `PUT` | `/clinic/patients/me/notifications/{id}/read` | تحديد إشعار محدد كمقروء |
| `PUT` | `/clinic/patients/me/notifications/read-all` | تحديد جميع الإشعارات كمقروءة |

---

### 5. 📅 حجوزات المواعيد (`/clinic/appointments`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/appointments` | استرجاع قائمة المواعيد مع الفلترة (`?patientId=...&doctorId=...&status=...&date=...`) |
| `GET` | `/clinic/appointments/{id}` | استرجاع تفاصيل موعد محدد ورقم الانتظار |
| `POST` | `/clinic/appointments/quick-book` | حجز موعد سريع من واجهة الزوار الرئيسية |
| `POST` | `/clinic/appointments/book` | حجز موعد كامل من بوابة المريض أو لوحة الإدارة |
| `POST` | `/clinic/appointments/{id}/cancel` | إلغاء حجز موعد مع تدوين السبب |
| `POST` | `/clinic/appointments/{id}/reschedule` | إعادة جدولة وتغيير توقيت الموعد |
| `PUT` | `/clinic/appointments/{id}/status` | تحديث حالة الموعد (`upcoming`, `completed`, `cancelled`) |
| `DELETE` | `/clinic/appointments/{id}` | حذف موعد من النظام |

---

### 6. 💊 السجلات الطبية والروشتات والتحاليل (`/clinic/medical-records`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/medical-records/prescriptions` | استرجاع الروشتات الطبية مع تفاصيل الأدوية والجرعات والتكرار |
| `GET` | `/clinic/medical-records/prescriptions/{id}` | استرجاع تفاصيل روشتة إلكترونية محددة |
| `POST` | `/clinic/medical-records/prescriptions` | إصدار روشتة طبية جديدة من قبل الطبيب |
| `GET` | `/clinic/medical-records/lab-reports` | استرجاع تقارير التحاليل الطبية ونتائج الفحوصات |
| `GET` | `/clinic/medical-records/lab-reports/{id}` | استرجاع تفاصيل ومرفقات تقرير تحليلي محدد |
| `POST` | `/clinic/medical-records/consultations` | حفظ ملاحظات وتوصيات جلسة الكشف الطبي |

---

### 7. 💳 الفواتير والماليات (`/clinic/finances`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/finances` | استرجاع السجلات المالية والفواتير والمطالبات التأمينية |
| `POST` | `/clinic/finances` | إصدار فاتورة علاجية أو سند قبض جديد |

---

### 8. 📊 الإدارة العامة والإحصائيات (`/clinic/admin`)
| Method | Endpoint | الوصف |
|---|---|---|
| `GET` | `/clinic/admin/profile` | استرجاع بيانات المشرف الطبي |
| `GET` | `/clinic/admin/stats` | استرجاع مؤشرات الأداء (إجمالي الإيرادات، المواعيد، الأطباء، ونسب الإشغال) |
| `GET` | `/clinic/admin/activity-logs` | استرجاع سجل الأنشطة والعمليات الإدارية المنفذة |

---

## 🛠️ التقنيات والمكتبات المستخدمة (Technology Stack)

* **.NET 10.0 SDK & C# 13**
* **Entity Framework Core 10** مع **Microsoft SQL Server**
* **MediatR** لتطبيق نمط **CQRS** وعزل استعلامات القراءة عن أوامر الكتابة
* **FluentValidation** للتحقق الصارم من صحة البيانات داخل الـ Pipeline
* **Result Pattern (`Result<T>`)** لإدارة الاستجابات والأخطاء بطريقة وظيفية نظيفة وموحدة
* **Minimal APIs** لأعلى كفاءة وسرعة استجابة مع تقليل استهلاك الذاكرة
* **Swashbuckle OpenAPI / Swagger UI** للتوثيق والاختبار الحي
* **CORS Policy ("AllowAll")** مهيأة للاتصال المباشر مع واجهة الـ React المنشورة على Vercel
* **SeedData Generator** لتعبئة قاعدة البيانات تلقائياً ببيانات افتراضية واقعية عند الإقلاع الأول

---

## 💻 التشغيل المحلي (Local Development)

### المتطلبات الأساسية
* [.NET 10 SDK](https://dotnet.microsoft.com/)
* SQL Server LocalDB أو مسار قاعدة بيانات SQL Server

### خطوات التشغيل
```powershell
# 1. الدخول إلى مجلد الباك إند
cd Clinic_Back

# 2. استرجاع الحزم
dotnet restore

# 3. تشغيل الخادم المحلي على المنفذ 5100
dotnet run --project src/Host/Clinic.Api/Clinic.Api.csproj --urls "http://localhost:5100"
```

* **رابط Swagger المحلي**: [http://localhost:5100/swagger](http://localhost:5100/swagger)
* **فحص الحالة (Health Check)**: [http://localhost:5100/](http://localhost:5100/)
