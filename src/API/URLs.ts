/**
 * Centralized API Endpoints Catalog for CareSync Clinic Backend (.NET 10)
 * Base prefix: /clinic
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://tech-master-clinic-management.runasp.net/clinic';

export const API_URLS = {
  // 1. Auth & Authentication
  auth: {
    checkPatientExists: (identifier: string) => `/auth/patient/check?identifier=${encodeURIComponent(identifier)}`,
    patientLogin: '/auth/patient/login',
    patientRegister: '/auth/patient/register',
    doctorLogin: '/auth/doctor/login',
    adminLogin: '/auth/admin/login',
  },

  // 2. Departments & Specialized Clinics
  departments: {
    getAll: '/departments',
    getById: (id: string) => `/departments/${id}`,
    create: '/departments',
    update: (id: string) => `/departments/${id}`,
    delete: (id: string) => `/departments/${id}`,
  },

  // 3. Doctors & Consultants
  doctors: {
    getAll: (params?: { departmentId?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.departmentId) searchParams.append('departmentId', params.departmentId);
      if (params?.search) searchParams.append('search', params.search);
      const queryString = searchParams.toString();
      return `/doctors${queryString ? `?${queryString}` : ''}`;
    },
    getById: (id: string) => `/doctors/${id}`,
    getQueue: (id: string) => `/doctors/${id}/queue`,
    getFinances: (id: string) => `/doctors/${id}/finances`,
    create: '/doctors',
    update: (id: string) => `/doctors/${id}`,
    toggleStatus: (id: string) => `/doctors/${id}/toggle-status`,
    updateFee: (id: string) => `/doctors/${id}/fee`,
    delete: (id: string) => `/doctors/${id}`,
  },

  // 4. Patient Portal & Profile
  patients: {
    getMe: (patientId?: string) => (patientId ? `/patients/me?patientId=${patientId}` : '/patients/me'),
    updateMe: '/patients/me',
    getVitals: (patientId?: string) => (patientId ? `/patients/me/vitals?patientId=${patientId}` : '/patients/me/vitals'),
    addVital: '/patients/me/vitals',
    getNotifications: (patientId?: string) => (patientId ? `/patients/me/notifications?patientId=${patientId}` : '/patients/me/notifications'),
    markNotificationRead: (id: string) => `/patients/me/notifications/${id}/read`,
    markAllNotificationsRead: (patientId?: string) => (patientId ? `/patients/me/notifications/read-all?patientId=${patientId}` : '/patients/me/notifications/read-all'),
  },

  // 5. Appointments & Bookings
  appointments: {
    getAll: (params?: { patientId?: string; doctorId?: string; status?: string; date?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.patientId) searchParams.append('patientId', params.patientId);
      if (params?.doctorId) searchParams.append('doctorId', params.doctorId);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.date) searchParams.append('date', params.date);
      const queryString = searchParams.toString();
      return `/appointments${queryString ? `?${queryString}` : ''}`;
    },
    getById: (id: string) => `/appointments/${id}`,
    quickBook: '/appointments/quick-book',
    book: '/appointments/book',
    cancel: (id: string) => `/appointments/${id}/cancel`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
    updateStatus: (id: string) => `/appointments/${id}/status`,
    delete: (id: string) => `/appointments/${id}`,
  },

  // 6. Medical Records, Prescriptions & Consultations
  medicalRecords: {
    getPrescriptions: (params?: { patientId?: string; doctorId?: string; appointmentId?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.patientId) searchParams.append('patientId', params.patientId);
      if (params?.doctorId) searchParams.append('doctorId', params.doctorId);
      if (params?.appointmentId) searchParams.append('appointmentId', params.appointmentId);
      const queryString = searchParams.toString();
      return `/medical-records/prescriptions${queryString ? `?${queryString}` : ''}`;
    },
    getPrescriptionById: (id: string) => `/medical-records/prescriptions/${id}`,
    createPrescription: '/medical-records/prescriptions',
    getLabReports: (patientId?: string) => (patientId ? `/medical-records/lab-reports?patientId=${patientId}` : '/medical-records/lab-reports'),
    getLabReportById: (id: string) => `/medical-records/lab-reports/${id}`,
    createConsultation: '/medical-records/consultations',
  },

  // 7. Finances & Invoices
  finances: {
    getAll: (params?: { patientId?: string; doctorId?: string; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.patientId) searchParams.append('patientId', params.patientId);
      if (params?.doctorId) searchParams.append('doctorId', params.doctorId);
      if (params?.status) searchParams.append('status', params.status);
      const queryString = searchParams.toString();
      return `/finances${queryString ? `?${queryString}` : ''}`;
    },
    create: '/finances',
  },

  // 8. Administration & Analytics
  admin: {
    getProfile: '/admin/profile',
    getStats: '/admin/stats',
    getActivityLogs: '/admin/activity-logs',
  },
} as const;
