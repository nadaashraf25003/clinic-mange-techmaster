import { Department, Doctor, Testimonial, ClinicStat } from './types';

export const CLINIC_INFO = {
  nameAr: 'مجمع كير سينك الطبي',
  nameEn: 'CareSync Medical Center',
  tagline: 'رعاية صحية متكاملة، منظومة طبية حديثة، وتجربة مريض استثنائية',
  phone: '01108894920',
  hotline: '19876',
  email: 'info@caresync-clinic.com',
  address: 'شارع التحرير، الدقي، الجيزة، مصر',
  workingHours: 'السبت - الخميس: 9:00 ص - 10:00 م | الجمعة: 2:00 م - 9:00 م'
};

export const CLINIC_STATS: ClinicStat[] = [
  { id: '1', value: '+35', label: 'طبيب استشاري', sublabel: 'في مختلف التخصصات الطبية' },
  { id: '2', value: '+24,000', label: 'مريض تم علاجهم', sublabel: 'بنسبة رضا تفوق 98%' },
  { id: '3', value: '12', label: 'عيادة تخصصية', sublabel: 'بأحدث التجهيزات والتحاليل' },
  { id: '4', value: '0 دقيقة', label: 'وقت انتظار ضائع', sublabel: 'مع نظام الحجز الرقمي الدقيق' }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'القلب والأوعية الدموية',
    nameEn: 'Cardiology',
    icon: 'HeartPulse',
    description: 'تشخيص ورعاية شاملة لأمراض القلب، رسم القلب، والموجات الصوتية الدقيقة.',
    doctorsCount: 4,
    colorClass: 'from-rose-500/10 to-red-500/5 text-rose-600 border-rose-100'
  },
  {
    id: 'pediatrics',
    name: 'طب الأطفال وحديثي الولادة',
    nameEn: 'Pediatrics',
    icon: 'Baby',
    description: 'متابعة النمو، التطعيمات الأساسية، ورعاية صحية متخصصة للأطفال في بيئة مريحة.',
    doctorsCount: 6,
    colorClass: 'from-amber-500/10 to-yellow-500/5 text-amber-600 border-amber-100'
  },
  {
    id: 'dentistry',
    name: 'طب وجراحة الأسنان',
    nameEn: 'Dentistry',
    icon: 'Smile',
    description: 'علاج وتجميل الأسنان، زراعة وتقويم بأحدث تقنيات الليزر والأجهزة الرقمية.',
    doctorsCount: 5,
    colorClass: 'from-cyan-500/10 to-sky-500/5 text-cyan-600 border-cyan-100'
  },
  {
    id: 'orthopedics',
    name: 'العظام والمفاصل',
    nameEn: 'Orthopedics',
    icon: 'Activity',
    description: 'علاج إصابات الملاعب، آلام العمود الفقري، والمفاصل مع برامج التأهيل الحديثة.',
    doctorsCount: 4,
    colorClass: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 border-emerald-100'
  },
  {
    id: 'ophthalmology',
    name: 'طب وجراحة العيون',
    nameEn: 'Ophthalmology',
    icon: 'Eye',
    description: 'فحص قاع العين، تصحيح الإبصار بالليزك، وعلاج أمراض الشبكية بدقة فائقة.',
    doctorsCount: 3,
    colorClass: 'from-blue-500/10 to-indigo-500/5 text-blue-600 border-blue-100'
  },
  {
    id: 'dermatology',
    name: 'الجلدية والتجميل والليزر',
    nameEn: 'Dermatology',
    icon: 'Sparkles',
    description: 'علاج الأمراض الجلدية وأحدث جلسات النضارة والعناية بالبشرة بأجهزة معتمدة.',
    doctorsCount: 5,
    colorClass: 'from-purple-500/10 to-violet-500/5 text-purple-600 border-purple-100'
  }
];

export const FEATURED_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'د. أحمد الشناوي',
    title: 'استشاري أول أمراض القلب والقسطرة',
    departmentId: 'cardiology',
    departmentName: 'القلب والأوعية الدموية',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 320,
    availableDays: ['السبت', 'الإثنين', 'الأربعاء'],
    consultationFee: 450,
    imageUrl: '/doctors/doctor-ahmed.jpg',
    specialties: ['القسطرة التداخلية', 'ضغط الدم المرتفع', 'تخطيط صدى القلب']
  },
  {
    id: 'doc-2',
    name: 'د. سارة المنصوري',
    title: 'استشارية طب وجراحة الفم والأسنان',
    departmentId: 'dentistry',
    departmentName: 'طب وجراحة الأسنان',
    experienceYears: 12,
    rating: 4.95,
    reviewCount: 410,
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    consultationFee: 350,
    imageUrl: '/doctors/doctor-sara.jpg',
    specialties: ['ابتسامة هوليوود', 'زراعة الأسنان الفورية', 'علاج الجذور']
  },
  {
    id: 'doc-3',
    name: 'د. يوسف عبد الرحمن',
    title: 'استشاري جراحة العظام والمفاصل الصناعية',
    departmentId: 'orthopedics',
    departmentName: 'العظام والمفاصل',
    experienceYears: 15,
    rating: 4.88,
    reviewCount: 280,
    availableDays: ['السبت', 'الأحد', 'الأربعاء'],
    consultationFee: 400,
    imageUrl: '/doctors/doctor-youssef.jpg',
    specialties: ['مناظير الركبة والكتف', 'خشونة المفاصل', 'إصابات الرياضيين']
  },
  {
    id: 'doc-4',
    name: 'د. نورهان المهدي',
    title: 'استشارية طب الأطفال ورعاية المبتسرين',
    departmentId: 'pediatrics',
    departmentName: 'طب الأطفال وحديثي الولادة',
    experienceYears: 10,
    rating: 4.92,
    reviewCount: 360,
    availableDays: ['يومياً ما عدا الجمعة'],
    consultationFee: 300,
    imageUrl: '/doctors/doctor-nourhan.jpg',
    specialties: ['حساسية الصدر للأطفال', 'تغذية الرضع', 'متابعة النمو والتطور']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    patientName: 'م. خالد إبراهيم',
    comment: 'تجربة ممتازة من بداية الحجز الإلكتروني وحتى انتهاء الكشف. التزام دقيق بالمواعيد وطاقم تمريض ودود واحترافي للغاية.',
    rating: 5,
    department: 'عيادة القلب',
    date: 'منذ يومين'
  },
  {
    id: '2',
    patientName: 'أ. منى زكريا',
    comment: 'عيادة الأسنان مجهزة بأعلى مستوى من النظافة والتعقيم، ود. سارة شرحت لي كل خطوة في العلاج دون أي ألم. شكراً لكم.',
    rating: 5,
    department: 'عيادة الأسنان',
    date: 'منذ أسبوع'
  },
  {
    id: '3',
    patientName: 'د. طارق السعدني',
    comment: 'سهولة الوصول للسجل الطبي والروشتة الإلكترونية من الهاتف ميزة مريحة جداً وتوفر الكثير من الوقت والجهد.',
    rating: 5,
    department: 'عيادة العظام',
    date: 'منذ أسبوعين'
  }
];

export const FEATURES = [
  {
    id: 'f-1',
    title: 'حجز فوري بدون انتظار',
    description: 'اختر الطبيب والموعد المناسب بضغطة زر مع تأكيد فوري عبر رسائل WhatsApp والـ SMS.',
    icon: 'CalendarCheck'
  },
  {
    id: 'f-2',
    title: 'سجل طبي إلكتروني موحد',
    description: 'روشتاتك، تحاليلك، وتقارير الفحص محفوظة بشكل آمن ومشفر لتصل إليها في أي وقت.',
    icon: 'FileText'
  },
  {
    id: 'f-3',
    title: 'نخبة من كبار الاستشاريين',
    description: 'أطباء معتمدون من كبرى الجامعات والمستشفيات يقدمون أدق التشخيصات وأفضل الخطط العلاجية.',
    icon: 'Award'
  },
  {
    id: 'f-4',
    title: 'متابعة دورية واستشارات',
    description: 'خدمة تواصل مستمرة بعد الكشف للاطمئنان على استجابتك للعلاج والإجابة على أي استفسارات.',
    icon: 'Headset'
  }
];

// ================= PATIENT PORTAL MOCK DATA =================

export const DEFAULT_PATIENT_PROFILE: import('./types').PatientProfile = {
  id: 'pat-101',
  name: 'محمد عبد الله الشريف',
  phone: '01012345678',
  email: 'm.elsharif@example.com',
  nationalId: '29408150102456',
  gender: 'male',
  birthDate: '1994-08-15',
  age: 32,
  bloodType: 'O+',
  chronicConditions: ['ارتفاع طفيف في ضغط الدم'],
  allergies: ['حساسية البنسلين'],
  emergencyContact: {
    name: 'سارة عبد الله (الأخت)',
    relation: 'أخت',
    phone: '01098765432'
  },
  insurance: {
    provider: 'بوبا للرعاية الصحية (Bupa Egypt)',
    policyNumber: 'BUP-8849-EG',
    coveragePercentage: 80,
    expiryDate: '2026-12-31'
  }
};

export const INITIAL_PATIENT_APPOINTMENTS: import('./types').PatientAppointment[] = [
  {
    id: 'apt-001',
    bookingReference: 'CS-849201',
    patientName: 'محمد عبد الله الشريف',
    patientPhone: '01012345678',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد الشناوي',
    doctorSpecialty: 'استشاري أول أمراض القلب والقسطرة',
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    departmentName: 'القلب والأوعية الدموية',
    departmentId: 'cardiology',
    date: '2026-09-10',
    time: '06:30 م',
    status: 'upcoming',
    roomNumber: 'عيادة 204 - الدور الثاني',
    consultationFee: 450,
    paymentStatus: 'insurance_covered',
    notes: 'متابعة دورية لضغط الدم ورسم القلب الإيكو',
  },
  {
    id: 'apt-002',
    bookingReference: 'CS-739112',
    patientName: 'أ. منى محمود زكريا',
    patientPhone: '01099887766',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد الشناوي',
    doctorSpecialty: 'استشاري أول أمراض القلب والقسطرة',
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    departmentName: 'القلب والأوعية الدموية',
    departmentId: 'cardiology',
    date: '2026-09-18',
    time: '07:00 م',
    status: 'upcoming',
    roomNumber: 'عيادة 204 - الدور الثاني',
    consultationFee: 450,
    paymentStatus: 'pending',
    notes: 'خفقان سريع واضطراب في ضربات القلب عند المجهود',
  },
  {
    id: 'apt-003',
    bookingReference: 'CS-551029',
    patientName: 'م. خالد إبراهيم سالم',
    patientPhone: '01122334455',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد الشناوي',
    doctorSpecialty: 'استشاري أول أمراض القلب والقسطرة',
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    departmentName: 'القلب والأوعية الدموية',
    departmentId: 'cardiology',
    date: '2026-08-20',
    time: '05:00 م',
    status: 'completed',
    roomNumber: 'عيادة 204 - الدور الثاني',
    consultationFee: 450,
    paymentStatus: 'paid',
    notes: 'استشارة ومراجعة تحاليل دهون الدم والإيكو',
    diagnosisSummary: 'ارتفاع الكوليسترول الضار مع توصية بنظام غذائي وعلاج وقائي',
    prescriptionId: 'rx-201'
  },
  {
    id: 'apt-004',
    bookingReference: 'CS-339182',
    patientName: 'د. طارق السعدني',
    patientPhone: '01233445566',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد الشناوي',
    doctorSpecialty: 'استشاري أول أمراض القلب والقسطرة',
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    departmentName: 'القلب والأوعية الدموية',
    departmentId: 'cardiology',
    date: '2026-07-15',
    time: '08:00 م',
    status: 'completed',
    roomNumber: 'عيادة 204 - الدور الثاني',
    consultationFee: 450,
    paymentStatus: 'paid',
    notes: 'فحص دوري ومتابعة ضغط الدم',
    diagnosisSummary: 'استقرار المؤشرات مع حاجة لتنظيم مواعيد العلاج',
    prescriptionId: 'rx-101'
  }
];

export const INITIAL_PATIENT_PRESCRIPTIONS: import('./types').Prescription[] = [
  {
    id: 'rx-101',
    prescriptionNumber: 'RX-2026-8831',
    appointmentId: 'apt-004',
    doctorName: 'د. أحمد الشناوي',
    doctorSpecialty: 'استشاري أول أمراض القلب والأوعية الدموية',
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    date: '2026-07-15',
    diagnosis: 'ارتفاع ضغط دم أولي مستقر + وقاية وعائية',
    notes: 'يرجى قياس الضغط صباحاً ومساءً وتسجيل القراءات في لوحة التحكم.',
    nextVisitDate: '2026-09-10',
    medications: [
      {
        id: 'med-1',
        name: 'كونكور 5 مجم (Concor 5mg)',
        dosage: 'قرص واحد يومياً',
        frequency: 'كل صباح بعد الإفطار',
        duration: 'مستمر لمدة شهرين',
        instructions: 'يؤخذ بانتظام في نفس الموعد يومياً مع كوب ماء كامل.'
      },
      {
        id: 'med-2',
        name: 'إيزاترين 10 مجم (Ezastatin 10mg)',
        dosage: 'قرص واحد يومياً',
        frequency: 'مساءً قبل النوم',
        duration: 'لمدة شهر ونصف',
        instructions: 'لتنظيم مستويات الكوليسترول والدهون الثلاثية.'
      },
      {
        id: 'med-3',
        name: 'أسبرين بروتكت 100 مجم (Aspirin Protect)',
        dosage: 'قرص واحد يومياً',
        frequency: 'بعد وجبة الغداء',
        duration: 'مستمر',
        instructions: 'للوقاية وحماية الأوعية الدموية.'
      }
    ]
  },
  {
    id: 'rx-201',
    prescriptionNumber: 'RX-2026-9042',
    appointmentId: 'apt-003',
    doctorName: 'د. يوسف عبد الرحمن',
    doctorSpecialty: 'استشاري جراحة العظام والمفاصل',
    doctorImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    date: '2026-08-20',
    diagnosis: 'التهاب أوتار ركبة رياضية خفيف',
    notes: 'الراحة لمدة 5 أيام مع وضع كمادات ثلج لمدة 15 دقيقة مرتين يومياً.',
    medications: [
      {
        id: 'med-4',
        name: 'سيليبريكس 200 مجم (Celebrex 200mg)',
        dosage: 'كبسولة واحدة يومياً',
        frequency: 'بعد الغداء',
        duration: 'لمدة 7 أيام فقط',
        instructions: 'مضاد للالتهاب ومسكن للآلام المفصلية.'
      },
      {
        id: 'med-5',
        name: 'ريبيل جل مساج (Reparil-Gel N)',
        dosage: 'دهان موضعي',
        frequency: '3 مرات يومياً',
        duration: 'لمدة 10 أيام',
        instructions: 'تدليك خفيف على المفصل دون ضغط شديد.'
      }
    ]
  }
];

export const INITIAL_LAB_REPORTS: import('./types').LabReport[] = [
  {
    id: 'lab-01',
    reportNumber: 'LAB-2026-4491',
    testName: 'صورة دم كاملة + دهون الدم الشاملة (CBC & Lipid Profile)',
    category: 'تحاليل دم',
    date: '2026-08-22',
    orderedByDoctor: 'د. أحمد الشناوي',
    status: 'completed',
    summary: 'جميع المؤشرات ضمن المعدلات الطبيعية باستثناء ارتفاع طفيف في الكوليسترول الضار LDL.',
    results: [
      { name: 'الهيموجلوبين (Hemoglobin)', result: '14.8', unit: 'g/dL', normalRange: '13.5 - 17.5' },
      { name: 'كرات الدم البيضاء (WBC)', result: '6.4', unit: 'x10^3/uL', normalRange: '4.0 - 11.0' },
      { name: 'الصفائح الدموية (Platelets)', result: '245', unit: 'x10^3/uL', normalRange: '150 - 450' },
      { name: 'الكوليسترول الكلي (Total Cholesterol)', result: '195', unit: 'mg/dL', normalRange: '< 200' },
      { name: 'الكوليسترول الضار (LDL)', result: '132', unit: 'mg/dL', normalRange: '< 100', isAbnormal: true },
      { name: 'الدهون الثلاثية (Triglycerides)', result: '140', unit: 'mg/dL', normalRange: '< 150' },
    ]
  },
  {
    id: 'lab-02',
    reportNumber: 'LAB-2026-5120',
    testName: 'أشعة سينية رقمية على الركبة اليمنى (Digital X-Ray Right Knee)',
    category: 'أشعة ومناظير',
    date: '2026-08-20',
    orderedByDoctor: 'د. يوسف عبد الرحمن',
    status: 'completed',
    summary: 'سلامة الأسطح المفصلية والعظام دون وجود كسور أو خشونة مبكرة.',
    results: [
      { name: 'محاذاة المفصل (Alignment)', result: 'طبيعي ومستقر', unit: '-', normalRange: 'Normal' },
      { name: 'المسافة المفصلية (Joint Space)', result: 'محفوظة تماماً', unit: '-', normalRange: 'Preserved' },
      { name: 'الكثافة العظمية (Bone Density)', result: 'سليمة', unit: '-', normalRange: 'Normal' }
    ]
  },
  {
    id: 'lab-03',
    reportNumber: 'LAB-2026-6088',
    testName: 'تحليل السكر التراكمي ووظائف الكلى (HbA1c & Kidney Function)',
    category: 'تحاليل دم',
    date: '2026-09-04',
    orderedByDoctor: 'د. أحمد الشناوي',
    status: 'processing',
    summary: 'العينة قيد التحليل المخبري الدقيق، ستظهر النتائج خلال 24 ساعة.',
    results: [
      { name: 'السكر التراكمي (HbA1c)', result: 'قيد الفحص...', unit: '%', normalRange: '< 5.7%' },
      { name: 'الكرياتينين (Serum Creatinine)', result: 'قيد الفحص...', unit: 'mg/dL', normalRange: '0.7 - 1.3' }
    ]
  }
];

export const INITIAL_HEALTH_VITALS: import('./types').HealthVitalRecord[] = [
  {
    id: 'vit-1',
    date: '2026-09-05 09:30',
    bloodPressureSystolic: 124,
    bloodPressureDiastolic: 82,
    bloodSugar: 98,
    heartRate: 72,
    weight: 78.5,
    temperature: 36.8,
    notes: 'قياس صباحي بعد الإفطار'
  },
  {
    id: 'vit-2',
    date: '2026-09-03 20:15',
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 84,
    bloodSugar: 112,
    heartRate: 76,
    weight: 78.8,
    temperature: 36.7,
    notes: 'قياس مسائي'
  },
  {
    id: 'vit-3',
    date: '2026-08-30 10:00',
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 80,
    bloodSugar: 94,
    heartRate: 70,
    weight: 79.0,
    temperature: 36.6,
    notes: 'صائم'
  }
];

export const INITIAL_NOTIFICATIONS: import('./types').PatientNotification[] = [
  {
    id: 'notif-1',
    title: 'تذكير بموعدك القادم',
    message: 'لديك موعد مع د. أحمد الشناوي يوم الأربعاء 10 سبتمبر الساعة 06:30 م.',
    date: 'منذ ساعة',
    type: 'appointment',
    read: false
  },
  {
    id: 'notif-2',
    title: 'تقرير معملي جديد جاهز',
    message: 'تم رفع نتائج تحاليل صورة الدم والدهون (LAB-2026-4491). يمكنك استعراضها الآن.',
    date: 'منذ يومين',
    type: 'lab',
    read: true
  },
  {
    id: 'notif-3',
    title: 'روشتة طبية رقمية معتمدة',
    message: 'تمت إضافة روشتة جديدة ومواعيد العلاج من قبل د. يوسف عبد الرحمن.',
    date: 'منذ أسبوعين',
    type: 'prescription',
    read: true
  }
];

// ================= DOCTOR PORTAL MOCK DATA =================

export const INITIAL_DOCTOR_QUEUE: import('./types').DoctorQueuePatient[] = [
  {
    id: 'q-101',
    appointmentId: 'apt-001',
    queueNumber: 1,
    patientId: 'pat-101',
    patientName: 'محمد عبد الله الشريف',
    patientAge: 32,
    patientGender: 'male',
    bloodType: 'O+',
    phone: '01012345678',
    timeSlot: '05:00 م',
    status: 'waiting',
    chiefComplaint: 'متابعة دورية لضغط الدم مع آلام خفيفة في الصدر بعد المجهود',
    chronicConditions: ['ارتفاع ضغط دم أولي'],
    allergies: ['حساسية البنسلين'],
    vitals: {
      bloodPressure: '124/82',
      heartRate: 72,
      temperature: 36.8,
      weight: 78.5
    }
  },
  {
    id: 'q-102',
    appointmentId: 'apt-102',
    queueNumber: 2,
    patientId: 'pat-102',
    patientName: 'أ. منى محمود زكريا',
    patientAge: 45,
    patientGender: 'female',
    bloodType: 'A+',
    phone: '01099887766',
    timeSlot: '05:30 م',
    status: 'waiting',
    chiefComplaint: 'صداع متكرر وزيادة في ضربات القلب عند الاستيقاظ',
    chronicConditions: ['قصور خفيف في الغدة الدرقية'],
    allergies: ['لا يوجد'],
    vitals: {
      bloodPressure: '135/88',
      heartRate: 84,
      temperature: 37.0,
      weight: 68.0
    }
  },
  {
    id: 'q-103',
    appointmentId: 'apt-103',
    queueNumber: 3,
    patientId: 'pat-103',
    patientName: 'م. خالد إبراهيم سالم',
    patientAge: 52,
    patientGender: 'male',
    bloodType: 'B+',
    phone: '01122334455',
    timeSlot: '06:00 م',
    status: 'waiting',
    chiefComplaint: 'استشارة ومراجعة تحاليل الدهون ووظائف الكبد',
    chronicConditions: ['ارتفاع الكوليسترول'],
    allergies: ['حساسية السلفا'],
    vitals: {
      bloodPressure: '120/80',
      heartRate: 68,
      temperature: 36.6,
      weight: 85.0
    }
  },
  {
    id: 'q-104',
    appointmentId: 'apt-104',
    queueNumber: 4,
    patientId: 'pat-104',
    patientName: 'د. طارق السعدني',
    patientAge: 38,
    patientGender: 'male',
    bloodType: 'O-',
    phone: '01233445566',
    timeSlot: '06:30 م',
    status: 'completed',
    chiefComplaint: 'كشف وقائي دوري مع رسم قلب إيكو',
    chronicConditions: [],
    allergies: [],
    vitals: {
      bloodPressure: '118/76',
      heartRate: 70,
      temperature: 36.7,
      weight: 74.0
    }
  }
];

export const COMMON_MEDICATIONS = [
  { name: 'كونكور 5 مجم (Concor 5mg)', defaultDosage: 'قرص واحد يومياً', defaultFrequency: 'كل صباح بعد الإفطار', defaultDuration: 'لمدة شهرين' },
  { name: 'إيزاترين 10 مجم (Ezastatin 10mg)', defaultDosage: 'قرص واحد يومياً', defaultFrequency: 'مساءً قبل النوم', defaultDuration: 'لمدة شهر ونصف' },
  { name: 'أسبرين بروتكت 100 مجم (Aspirin Protect)', defaultDosage: 'قرص واحد يومياً', defaultFrequency: 'بعد وجبة الغداء', defaultDuration: 'مستمر' },
  { name: 'سيليبريكس 200 مجم (Celebrex 200mg)', defaultDosage: 'كبسولة واحدة يومياً', defaultFrequency: 'بعد الغداء', defaultDuration: 'لمدة 7 أيام' },
  { name: 'أوجمنتين 1 جم (Augmentin 1g)', defaultDosage: 'قرص كل 12 ساعة', defaultFrequency: 'مرتين يومياً بعد الأكل', defaultDuration: 'لمدة 7 أيام' },
  { name: 'بنادول إكسترا (Panadol Extra)', defaultDosage: 'قرصين عند اللزوم', defaultFrequency: 'كل 8 ساعات عند الألم', defaultDuration: 'عند الحاجة' },
  { name: 'موبيك 15 مجم (Mobic 15mg)', defaultDosage: 'قرص واحد يومياً', defaultFrequency: 'بعد وجبة الغداء', defaultDuration: 'لمدة 5 أيام' },
  { name: 'جلوكوفاج 1000 مجم (Glucophage 1000mg)', defaultDosage: 'قرص واحد مع الأكل', defaultFrequency: 'مرتين يومياً', defaultDuration: 'مستمر' },
];

export const COMMON_LAB_TESTS = [
  'صورة دم كاملة (CBC)',
  'دهون الدم الشاملة (Lipid Profile)',
  'سكر الدم التراكمي (HbA1c)',
  'وظائف كلى (Serum Creatinine & Urea)',
  'وظائف كبد (SGOT & SGPT)',
  'رسم قلب كهربائي (ECG)',
  'تخطيط صدى القلب (Echocardiography)',
  'أشعة سينية رقمية (Digital X-Ray)',
  'تحليل بول كامل (Complete Urine Analysis)',
  'فيتامين د (Vitamin D3)'
];


