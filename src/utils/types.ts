export interface Department {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  doctorsCount: number;
  colorClass: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  consultationFee: number;
  imageUrl: string;
  specialties: string[];
  phone?: string;
  email?: string;
  bio?: string;
  roomNumber?: string;
  isActive?: boolean;
}

export interface Testimonial {
  id: string;
  patientName: string;
  comment: string;
  rating: number;
  department: string;
  date: string;
}

export interface ClinicStat {
  id: string;
  value: string;
  label: string;
  sublabel: string;
}

export interface AppointmentBookingRequest {
  patientName: string;
  phoneNumber: string;
  email?: string;
  departmentId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingReference?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  gender: 'male' | 'female';
  birthDate: string;
  age: number;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  chronicConditions: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    coveragePercentage: number;
    expiryDate: string;
  };
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface PatientAppointment {
  id: string;
  bookingReference: string;
  patientName?: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  departmentName: string;
  departmentId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  roomNumber: string;
  consultationFee: number;
  paymentStatus: 'paid' | 'pending' | 'insurance_covered';
  notes?: string;
  diagnosisSummary?: string;
  prescriptionId?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "مرتين يومياً بعد الأكل"
  duration: string; // e.g., "7 أيام"
  instructions: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  appointmentId?: string;
  doctorId?: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  diagnosis: string;
  notes: string;
  medications: Medication[];
  nextVisitDate?: string;
}

export type LabTestStatus = 'completed' | 'processing' | 'pending_sample';

export interface LabResultItem {
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  isAbnormal?: boolean;
}

export interface LabReport {
  id: string;
  reportNumber: string;
  testName: string;
  category: 'تحاليل دم' | 'أشعة ومناظير' | 'فحوصات قلب' | 'وظائف أعضاء';
  date: string;
  orderedByDoctor: string;
  status: LabTestStatus;
  summary: string;
  results: LabResultItem[];
}

export interface HealthVitalRecord {
  id: string;
  date: string; // YYYY-MM-DD HH:mm
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugar: number; // mg/dL
  heartRate: number; // bpm
  weight: number; // kg
  temperature: number; // °C
  notes?: string;
}

export interface PatientNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'appointment' | 'prescription' | 'lab' | 'general';
  read: boolean;
}

export type QueueStatus = 'waiting' | 'in_consultation' | 'completed' | 'absent';

export interface DoctorQueuePatient {
  id: string;
  appointmentId: string;
  queueNumber: number;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  bloodType: string;
  phone: string;
  timeSlot: string;
  status: QueueStatus;
  chiefComplaint: string;
  chronicConditions: string[];
  allergies: string[];
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
  };
}

export interface DoctorConsultationNote {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  orderedLabTests: string[];
  prescriptionNumber?: string;
  nextFollowUpDate?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface ClinicFinancialRecord {
  id: string;
  invoiceNumber: string;
  patientName: string;
  doctorName: string;
  departmentName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  insuranceProvider?: string;
  insuranceCoverage?: number;
  status: 'paid' | 'pending' | 'refunded';
  date: string;
  time: string;
}

export interface AdminActivityLog {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'doctor' | 'appointment' | 'finance' | 'system';
}



