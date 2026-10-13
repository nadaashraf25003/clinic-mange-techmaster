# 🏥 CareSync | مجمع العيادات والمراكز الطبية الحديثة
### Modern Clinic & Healthcare Management Platform

منظومة متكاملة وشاملة لإدارة العيادات والمراكز الطبية المتخصصة، تجمع بين **واجهة أمامية حديثة وفائقة السرعة (React 19 / Vite / Tailwind CSS v4)** و **نواة خلفية قوية ومعيارية (.NET 10 / Modular Clean Architecture / CQRS / Minimal APIs)** مع دعم الربط السحابي الكامل عبر **HTTPS**.

---

## 🌐 الروابط الحية والإنتاج (Live Production Links)

* 🚀 **واجهة الباك إند السحابية (Live Backend API)**:  
  [https://tech-master-clinic-management.runasp.net/](https://tech-master-clinic-management.runasp.net/)
* 📑 **التوثيق التفاعلي للـ API (Live Swagger UI)**:  
  [https://tech-master-clinic-management.runasp.net/swagger](https://tech-master-clinic-management.runasp.net/swagger)
* 🔗 **مسار الـ API المعتمد (Base Endpoint)**:  
  `https://tech-master-clinic-management.runasp.net/clinic`
* ⚡ **نشر الواجهة الأمامية**: مهيأة بالكامل للنشر التلقائي على منصة **Vercel** مع دعم التوجيه للـ SPA.

---

## ✨ بوابات المنظومة والميزات الرئيسية (Key Portals & Features)

### 1. 🌟 الواجهة التعريفية والحجز السريع (Public Landing Page)
* **قسم ترحيبي تفاعلي (Hero Section)** مع إحصائيات سريعة وصور واقعية للأطباء والعيادة.
* **نافذة الحجز الفوري (Quick Booking Modal)** تسمح للزوار بحجز كشف طبي فوري وتحديد القسم والطبيب والتاريخ برقم الانتظار.
* **كتالوج الأقسام الطبية (Specialized Departments)** (الباطنة، الأطفال، العظام، الجلدية، القلب، العيون، وغيرها).
* **دليل الأطباء والاستشاريين (Doctor Directory)** لعرض تخصصات الأطباء، تقييماتهم، وسعر الكشف.
* **آراء المرضى (Testimonials)** و **أبرز مزايا المنظومة (Features Showcase)**.

### 2. 🧑‍🤝‍🧑 بوابة المريض (Patient Portal)
* **لوحة تحكم شخصية (Dashboard)** تعرض المواعيد القادمة وتنبيهات الأدوية والفحوصات.
* **سجل المؤشرات الحيوية (Health Vitals)** لمتابعة ضغط الدم، معدل السكر، النبض، ودرجة الحرارة مع مؤشرات الحالة.
* **الروشتات الإلكترونية (E-Prescriptions)** لاستعراض الوصفات العلاجية الصادرة من الأطباء مع الجرعات وتعليمات الاستخدام.
* **التقارير المعملية والأشعة (Lab Reports)** لمتابعة نتائج التحاليل والفحوصات وحالتها.
* **إدارة المواعيد (Appointments)** لحجز موعد جديد، إلغاء، أو إعادة جدولة المواعيد السابقة.
* **الفواتير والسجلات المالية (Invoices)** لعرض تفاصيل الكشوفات، الدفع الإلكتروني، وطباعة الفواتير.

### 3. 👨‍⚕️ بوابة الطبيب (Doctor Portal)
* **طابور المرضى اليومي (Today's Patient Queue)** لمتابعة المرضى المنتظرين في العيادة، استدعاء المريض، وبدء الكشف.
* **جلسة الكشف والتشخيص (Clinical Consultation)** لتدوين التشخيص الطبي والأعراض وإصدار الروشتة مباشرة.
* **الروشتات الطبية (Prescription Generator)** لإضافة الأدوية وتحديد الجرعات والملاحظات العلاجية.
* **الماليات والأتعاب (Financial Overview)** لمتابعة دخل الطبيب ونسب الكشف لكل موعد.
* **الملف التعريفي (Profile Settings)** لتعديل بيانات التواصل وسعر الكشف وحالة التواجد.

### 4. 🛡️ بوابة الإدارة والمشرف (Admin Portal)
* **لوحة المؤشرات العامة (KPI Dashboard)** لرصد إجمالي الإيرادات، حجوزات اليوم، عدد الأطباء، ومعدل إشغال العيادات.
* **إدارة الأطباء (Doctors Management)** لإضافة أطباء جدد، تفعيل أو تعطيل الحسابات، وتحديث أسعار الكشوفات.
* **إدارة الأقسام (Departments Management)** لإنشاء أقسام جديدة وتعديل الأقسام القائمة.
* **تدقيق ومتابعة المواعيد (Appointments Audit)** لمراقبة كافة حجوزات المرضى وتحديث حالاتها.
* **التقارير المالية والفوترة (Financial Records)** لتتبع الإيرادات والمطالبات التأمينية.
* **سجل الأنشطة والعمليات (Activity Logs)** لتوثيق جميع العمليات الإدارية المنفذة في النظام.

---

## 🏗️ هيكلية المشروع (Project Architecture)

المشروع مبني كـ **Monorepo** يجمع الواجهة الأمامية والخلفية:

```text
clinic-mange-techmaster/
├── package.json                         # تبعيات ومكتبات الواجهة الأمامية
├── vite.config.ts                       # إعدادات Vite مع تحسين حزم الإنتاج
├── tailwind.config.js                   # إعدادات ألوان وأنماط Tailwind CSS
├── postcss.config.js                    # إعدادات معالج PostCSS مع Tailwind v4
├── vercel.json                          # إعدادات توجيه SPA لإعادة توجيه المسارات على Vercel
├── .env                                 # متغيرات البيئة (رابط الـ API السحابي الموحد)
│
├── public/                              # الصور والأصول الثابتة
│   ├── clinic-hero.jpg                  # صورة الغلاف الرئيسية
│   └── doctors/                         # صور الأطباء الاستشاريين
│
├── src/                                 # كود الواجهة الأمامية (React 19 + TypeScript)
│   ├── API/                             # عميل الاتصال ونقاط النهاية المركزية (URLs, Services, Token)
│   ├── Components/                      # المكونات المشتركة (Navbar, Footer, QuickBookingModal)
│   ├── Hooks/                           # خطافات إدارة الحالة والمصادقة (Auth Hooks, Data Fetching)
│   ├── Routing/                         # مسارات التطبيق وتوزيع الصلاحيات (AppRoutes)
│   ├── Views/                           # صفحات البوابات (Landing, Patient, Doctor, Admin, Auth)
│   └── utils/                           # الثوابت، المنسقات، ونماذج البيانات (Types, Constants)
│
└── Clinic_Back/                         # كود الباك إند (.NET 10 Modular Monolith)
    ├── Clinic.slnx                      # ملف الحل البرمجي لـ .NET
    ├── MonsterASP_CareSync_Database.sql # سكريبت قاعدة بيانات SQL Server السحابية
    ├── README.md                        # توثيق الباك إند المفصل ونقاط النهاية
    └── src/
        ├── BuildingBlocks/              # المشتركات المعمارية وقاعدة البيانات
        ├── Host/Clinic.Api/             # مسارات الـ Minimal APIs والإعدادات
        └── Modules/                     # وحدات الأعمال (Appointments, Doctors, Patients, etc.)
```

---

## 🛠️ حزمة التقنيات (Tech Stack)

| المجال | التقنيات المستخدمة |
|---|---|
| **الواجهة الأمامية (Frontend)** | React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, React Router v7 |
| **الواجهة الخلفية (Backend)** | .NET 10.0, C# 13, ASP.NET Core Minimal APIs, MediatR (CQRS) |
| **قاعدة البيانات (Database)** | Microsoft SQL Server (MonsterASP Cloud Database) عبر Entity Framework Core |
| **التحقق والتأكد (Validation)** | FluentValidation داخل مسار الـ MediatR Pipeline |
| **التوثيق (Documentation)** | Swashbuckle Swagger UI / OpenAPI Spec |
| **الاستضافة والنشر (Deployment)** | Frontend: **Vercel** \| Backend & Database: **MonsterASP Cloud (IIS WebDeploy)** |

---

## 🚀 التشغيل المحلي (Getting Started)

### المتطلبات الأساسية
* [Node.js](https://nodejs.org/) (إصدار 20 أو أحدث)
* [npm](https://www.npmjs.com/) (إصدار 10 أو أحدث)
* [.NET 10.0 SDK](https://dotnet.microsoft.com/)

---

### 1. تشغيل الواجهة الأمامية (Frontend)

```powershell
# 1. الدخول إلى المجلد الرئيسي
cd clinic-mange-techmaster

# 2. تثبيت التبعيات
npm install

# 3. تشغيل خادم التطوير المحلي
npm run dev
```

* تفتح الواجهة تلقائياً على الرابط: `http://localhost:5173`
* للبناء واختبار حزم الإنتاج:
  ```powershell
  npm run build
  npm run preview
  ```

---

### 2. تشغيل الواجهة الخلفية (Backend)

```powershell
# 1. الدخول إلى مجلد الباك إند
cd Clinic_Back

# 2. استرجاع الحزم
dotnet restore

# 3. تشغيل الخادم
dotnet run --project src/Host/Clinic.Api/Clinic.Api.csproj --urls "http://localhost:5100"
```

* رابط التوثيق التفاعلي للـ API محلياً: [http://localhost:5100/swagger](http://localhost:5100/swagger)

---

## ⚙️ إعدادات متغيرات البيئة (Environment Variables)

ملف `.env` في المجلد الرئيسي مهيأ تلقائياً للاتصال بالباك إند السحابي عبر HTTPS:

```dotenv
# رابط الـ API السحابي المباشر (HTTPS):
VITE_API_URL=https://tech-master-clinic-management.runasp.net/clinic

# للتشغيل على السيرفر المحلي:
# VITE_API_URL=http://localhost:5100/clinic
```

---

## 🚢 خطوات النشر على Vercel (Deploy to Vercel)

1. ارفع المشروع إلى مستودع **GitHub**.
2. توجّه إلى منصة [Vercel](https://vercel.com/) واختر **Import Project**.
3. تأكد من تحديد إعدادات البناء:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. تم تضمين ملف `vercel.json` لإعادة توجيه كافة المسارات الداخلية إلى `index.html` تلقائياً لمنع أخطاء 404 عند التحديث.
5. سيتم بناء ونشر المشروع بنجاح مع ربطه مباشرة بالباك إند السحابي المؤمّن عبر HTTPS.

---

## 📄 الترخيص (License)
المشروع مخصص لمبادرة **Tech Master** - جميع الحقوق محفوظة © 2026.
