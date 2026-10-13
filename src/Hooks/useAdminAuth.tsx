import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Doctor, 
  PatientAppointment, 
  AdminProfile, 
  ClinicFinancialRecord, 
  AdminActivityLog, 
  Department 
} from '../utils/types';
import { 
  FEATURED_DOCTORS, 
  INITIAL_PATIENT_APPOINTMENTS, 
  DEPARTMENTS 
} from '../utils/constants';
import { 
  adminService, 
  AdminStatsSummary, 
  doctorService, 
  departmentService, 
  appointmentService, 
  financeService, 
  authService, 
  tokenManager 
} from '../API';

interface AdminContextType {
  adminProfile: AdminProfile;
  isAuthenticated: boolean;
  loading: boolean;
  stats: AdminStatsSummary | null;
  refreshAdminData: () => Promise<void>;
  loginAdmin: (emailOrUsername: string, password?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  doctors: (Doctor & { isActive?: boolean })[];
  appointments: PatientAppointment[];
  departments: Department[];
  financials: ClinicFinancialRecord[];
  activityLogs: AdminActivityLog[];
  addDoctor: (doctor: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => Promise<Doctor>;
  updateDoctor: (doctorId: string, updatedData: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (doctorId: string) => Promise<void>;
  toggleDoctorStatus: (doctorId: string) => Promise<void>;
  updateDoctorFee: (doctorId: string, newFee: number) => Promise<void>;
  addDepartment: (dept: Department) => Promise<Department>;
  updateDepartment: (deptId: string, updatedData: Partial<Department>) => Promise<void>;
  deleteDepartment: (deptId: string) => Promise<void>;
  updateAppointmentStatus: (appointmentId: string, status: 'upcoming' | 'completed' | 'cancelled') => Promise<void>;
  addManualAppointment: (data: Partial<PatientAppointment>) => Promise<PatientAppointment>;
  deleteAppointment: (appointmentId: string) => Promise<void>;
  addFinancialRecord: (record: Omit<ClinicFinancialRecord, 'id' | 'invoiceNumber'>) => Promise<ClinicFinancialRecord>;
}

const DEFAULT_ADMIN: AdminProfile = {
  id: 'adm-01',
  name: 'أ. د. عبد الرحمن القاضي',
  role: 'المدير التنفيذي والطبي العام',
  email: 'admin@caresync.com',
  phone: '01009988776',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(DEFAULT_ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('caresync_admin_auth');
    const hasToken = tokenManager.hasToken();
    return Boolean(saved && JSON.parse(saved) && hasToken);
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<AdminStatsSummary | null>(null);

  const [doctors, setDoctors] = useState<(Doctor & { isActive?: boolean })[]>(() => {
    const saved = localStorage.getItem('caresync_admin_doctors');
    if (saved) return JSON.parse(saved);
    return FEATURED_DOCTORS.map(d => ({ ...d, isActive: true }));
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('caresync_admin_departments');
    if (saved) return JSON.parse(saved);
    return DEPARTMENTS;
  });

  const [appointments, setAppointments] = useState<PatientAppointment[]>(() => {
    const saved = localStorage.getItem('caresync_admin_appointments');
    if (saved) return JSON.parse(saved);
    return INITIAL_PATIENT_APPOINTMENTS;
  });

  const [financials, setFinancials] = useState<ClinicFinancialRecord[]>(() => {
    const saved = localStorage.getItem('caresync_admin_financials');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);

  // Fetch all live data from Backend API
  const refreshAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        liveProfile,
        liveStats,
        liveDoctors,
        liveDepartments,
        liveAppointments,
        liveFinancials,
        liveLogs
      ] = await Promise.allSettled([
        adminService.getProfile(),
        adminService.getStats(),
        doctorService.getDoctors(),
        departmentService.getDepartments(),
        appointmentService.getAppointments(),
        financeService.getFinancialRecords(),
        adminService.getActivityLogs()
      ]);

      if (liveProfile.status === 'fulfilled' && liveProfile.value) {
        setAdminProfile(liveProfile.value);
      }
      if (liveStats.status === 'fulfilled' && liveStats.value) {
        setStats(liveStats.value);
      }
      if (liveDoctors.status === 'fulfilled' && liveDoctors.value?.length > 0) {
        setDoctors(liveDoctors.value);
        localStorage.setItem('caresync_admin_doctors', JSON.stringify(liveDoctors.value));
      }
      if (liveDepartments.status === 'fulfilled' && liveDepartments.value?.length > 0) {
        setDepartments(liveDepartments.value);
        localStorage.setItem('caresync_admin_departments', JSON.stringify(liveDepartments.value));
      }
      if (liveAppointments.status === 'fulfilled' && Array.isArray(liveAppointments.value)) {
        setAppointments(liveAppointments.value);
        localStorage.setItem('caresync_admin_appointments', JSON.stringify(liveAppointments.value));
      }
      if (liveFinancials.status === 'fulfilled' && Array.isArray(liveFinancials.value)) {
        setFinancials(liveFinancials.value);
        localStorage.setItem('caresync_admin_financials', JSON.stringify(liveFinancials.value));
      }
      if (liveLogs.status === 'fulfilled' && Array.isArray(liveLogs.value)) {
        setActivityLogs(liveLogs.value);
      }
    } catch (err) {
      console.warn('[AdminAuth] Backend refresh sync failed, using cached state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch backend data upon load
  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  // Persist auth state
  useEffect(() => {
    localStorage.setItem('caresync_admin_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const loginAdmin = async (emailOrUsername: string, password?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const profile = await authService.loginAdmin({ 
        emailOrUsername: emailOrUsername || 'admin@caresync.com', 
        password: password || 'admin123',
        pinCode: password 
      });
      if (profile) {
        setAdminProfile(profile);
      }
      setIsAuthenticated(true);
      tokenManager.setRole('admin');
      tokenManager.setUserSession(profile || adminProfile);
      await refreshAdminData();
      return true;
    } catch (err) {
      console.warn('[AdminAuth] Live login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    authService.logout();
    setIsAuthenticated(false);
    localStorage.removeItem('caresync_admin_auth');
  };

  // --- Doctor Operations connected to Backend ---
  const addDoctor = async (doctorData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>): Promise<Doctor> => {
    try {
      const created = await doctorService.createDoctor(doctorData);
      setDoctors(prev => [created, ...prev]);
      refreshAdminData();
      return created;
    } catch (err) {
      console.warn('[AdminAuth] Create doctor API failed, updating locally:', err);
      const newDoc: Doctor & { isActive: boolean } = {
        ...doctorData,
        id: `doc-${Date.now()}`,
        rating: 5.0,
        reviewCount: 1,
        isActive: true,
      };
      setDoctors(prev => [newDoc, ...prev]);
      return newDoc;
    }
  };

  const updateDoctor = async (doctorId: string, updatedData: Partial<Doctor>) => {
    try {
      await doctorService.updateDoctor(doctorId, updatedData);
    } catch (err) {
      console.warn('[AdminAuth] Update doctor API failed, updating locally:', err);
    }
    setDoctors(prev =>
      prev.map(d => (d.id === doctorId ? { ...d, ...updatedData } : d))
    );
  };

  const deleteDoctor = async (doctorId: string) => {
    try {
      await doctorService.deleteDoctor(doctorId);
    } catch (err) {
      console.warn('[AdminAuth] Delete doctor API failed, updating locally:', err);
    }
    setDoctors(prev => prev.filter(d => d.id !== doctorId));
  };

  const toggleDoctorStatus = async (doctorId: string) => {
    try {
      const res = await doctorService.toggleDoctorStatus(doctorId);
      setDoctors(prev =>
        prev.map(d => (d.id === doctorId ? { ...d, isActive: res.isActive } : d))
      );
    } catch (err) {
      console.warn('[AdminAuth] Toggle doctor status API failed, updating locally:', err);
      setDoctors(prev =>
        prev.map(d => (d.id === doctorId ? { ...d, isActive: !d.isActive } : d))
      );
    }
  };

  const updateDoctorFee = async (doctorId: string, newFee: number) => {
    try {
      await doctorService.updateDoctorFee(doctorId, newFee);
    } catch (err) {
      console.warn('[AdminAuth] Update doctor fee API failed, updating locally:', err);
    }
    setDoctors(prev =>
      prev.map(d => (d.id === doctorId ? { ...d, consultationFee: newFee } : d))
    );
  };

  // --- Department Operations connected to Backend ---
  const addDepartment = async (dept: Department): Promise<Department> => {
    try {
      const created = await departmentService.createDepartment(dept);
      setDepartments(prev => [...prev, created]);
      refreshAdminData();
      return created;
    } catch (err) {
      console.warn('[AdminAuth] Create department API failed, updating locally:', err);
      setDepartments(prev => [...prev, dept]);
      return dept;
    }
  };

  const updateDepartment = async (deptId: string, updatedData: Partial<Department>) => {
    try {
      await departmentService.updateDepartment(deptId, updatedData);
    } catch (err) {
      console.warn('[AdminAuth] Update department API failed, updating locally:', err);
    }
    setDepartments(prev =>
      prev.map(dept => (dept.id === deptId ? { ...dept, ...updatedData } : dept))
    );
  };

  const deleteDepartment = async (deptId: string) => {
    try {
      await departmentService.deleteDepartment(deptId);
    } catch (err) {
      console.warn('[AdminAuth] Delete department API failed, updating locally:', err);
    }
    setDepartments(prev => prev.filter(d => d.id !== deptId));
  };

  // --- Appointment Operations connected to Backend ---
  const updateAppointmentStatus = async (
    appointmentId: string,
    status: 'upcoming' | 'completed' | 'cancelled'
  ) => {
    try {
      await appointmentService.updateStatus(appointmentId, status);
    } catch (err) {
      console.warn('[AdminAuth] Update appointment status API failed, updating locally:', err);
    }
    setAppointments(prev =>
      prev.map(a => (a.id === appointmentId ? { ...a, status } : a))
    );
  };

  const addManualAppointment = async (data: Partial<PatientAppointment>): Promise<PatientAppointment> => {
    try {
      const created = await appointmentService.bookAppointment(data);
      setAppointments(prev => [created, ...prev]);
      refreshAdminData();
      return created;
    } catch (err) {
      console.warn('[AdminAuth] Book appointment API failed, updating locally:', err);
      const newApt: PatientAppointment = {
        id: `apt-${Date.now()}`,
        bookingReference: `CS-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName: data.patientName || 'مريض جديد',
        patientPhone: data.patientPhone || '01000000000',
        doctorId: data.doctorId || doctors[0]?.id || 'doc-1',
        doctorName: data.doctorName || doctors[0]?.name || 'طبيب استشاري',
        doctorSpecialty: data.doctorSpecialty || doctors[0]?.title || 'استشاري',
        doctorImage: data.doctorImage || doctors[0]?.imageUrl || '',
        departmentName: data.departmentName || doctors[0]?.departmentName || 'العيادات العامة',
        departmentId: data.departmentId || doctors[0]?.departmentId || 'general',
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || '05:00 م',
        status: 'upcoming',
        roomNumber: 'عيادة 201 - الدور الثاني',
        consultationFee: data.consultationFee || 400,
        paymentStatus: 'pending',
        notes: data.notes || 'حجز إداري مباشر'
      };
      setAppointments(prev => [newApt, ...prev]);
      return newApt;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
    } catch (err) {
      console.warn('[AdminAuth] Delete appointment API failed, updating locally:', err);
    }
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
  };

  // --- Financial Operations connected to Backend ---
  const addFinancialRecord = async (record: Omit<ClinicFinancialRecord, 'id' | 'invoiceNumber'>): Promise<ClinicFinancialRecord> => {
    try {
      const created = await financeService.createFinancialRecord(record);
      setFinancials(prev => [created, ...prev]);
      refreshAdminData();
      return created;
    } catch (err) {
      console.warn('[AdminAuth] Create financial record API failed, updating locally:', err);
      const newRecord: ClinicFinancialRecord = {
        ...record,
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setFinancials(prev => [newRecord, ...prev]);
      return newRecord;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminProfile,
        isAuthenticated,
        loading,
        stats,
        refreshAdminData,
        loginAdmin,
        logoutAdmin,
        doctors,
        appointments,
        departments,
        financials,
        activityLogs,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        toggleDoctorStatus,
        updateDoctorFee,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        updateAppointmentStatus,
        addManualAppointment,
        deleteAppointment,
        addFinancialRecord,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
