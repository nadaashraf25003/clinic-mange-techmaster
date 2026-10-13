import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PatientProfile, 
  PatientAppointment, 
  Prescription, 
  LabReport, 
  HealthVitalRecord, 
  PatientNotification 
} from '../utils/types';
import { 
  DEFAULT_PATIENT_PROFILE, 
  INITIAL_PATIENT_APPOINTMENTS, 
  INITIAL_PATIENT_PRESCRIPTIONS, 
  INITIAL_LAB_REPORTS, 
  INITIAL_HEALTH_VITALS, 
  INITIAL_NOTIFICATIONS 
} from '../utils/constants';
import { authService, patientService, appointmentService, tokenManager } from '../API';

interface PatientAuthContextType {
  patient: PatientProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  appointments: PatientAppointment[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  vitals: HealthVitalRecord[];
  notifications: PatientNotification[];
  login: (phoneOrEmail: string, pinOrPass?: string) => Promise<boolean>;
  loginDemo: () => void;
  register: (newProfile: Partial<PatientProfile> & { password?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<PatientProfile>) => Promise<void>;
  addAppointment: (appointment: Omit<PatientAppointment, 'id' | 'bookingReference' | 'status'>) => Promise<PatientAppointment>;
  cancelAppointment: (appointmentId: string, reason?: string) => Promise<void>;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => Promise<void>;
  addVitalRecord: (record: Omit<HealthVitalRecord, 'id'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refreshPatientData: () => Promise<void>;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENT: 'caresync_patient_profile',
  AUTH: 'caresync_patient_auth',
  APPOINTMENTS: 'caresync_patient_appointments',
  PRESCRIPTIONS: 'caresync_patient_prescriptions',
  LABS: 'caresync_patient_labs',
  VITALS: 'caresync_patient_vitals',
  NOTIFICATIONS: 'caresync_patient_notifications',
};

export const PatientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const hasToken = tokenManager.hasToken();
    return Boolean(hasToken && isAuth === 'true');
  });

  const [patient, setPatient] = useState<PatientProfile | null>(() => {
    const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const hasToken = tokenManager.hasToken();
    if (!hasToken || isAuth !== 'true') return null;
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT);
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<PatientAppointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LABS);
    return saved ? JSON.parse(saved) : [];
  });

  const [vitals, setVitals] = useState<HealthVitalRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VITALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<PatientNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state changes
  useEffect(() => {
    if (patient) {
      localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patient));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PATIENT);
    }
  }, [patient]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Load live data from Backend API when authenticated
  const refreshPatientData = async () => {
    if (!isAuthenticated || !patient?.id) return;
    try {
      const [liveProfile, liveVitals, liveNotifications, liveAppointments] = await Promise.all([
        patientService.getProfile(patient.id),
        patientService.getVitals(patient.id),
        patientService.getNotifications(patient.id),
        appointmentService.getAppointments({ patientId: patient.id }),
      ]);

      if (liveProfile) setPatient(liveProfile);
      if (liveVitals) setVitals(liveVitals);
      if (liveNotifications) setNotifications(liveNotifications);
      if (liveAppointments) setAppointments(liveAppointments);
    } catch (err) {
      console.warn('[PatientAuth] Backend sync failed, using cached local data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && patient?.id) {
      refreshPatientData();
    }
  }, [isAuthenticated, patient?.id]);

  // Real API Login
  const login = async (phoneOrEmail: string, pinOrPass?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const profile = await authService.loginPatient({
        phoneOrEmail,
        pinCode: pinOrPass || '1234',
      });
      setPatient(profile);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.warn('[PatientAuth] Login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    setPatient(DEFAULT_PATIENT_PROFILE);
    setAppointments(INITIAL_PATIENT_APPOINTMENTS);
    setPrescriptions(INITIAL_PATIENT_PRESCRIPTIONS);
    setLabReports(INITIAL_LAB_REPORTS);
    setVitals(INITIAL_HEALTH_VITALS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsAuthenticated(true);
    tokenManager.setRole('patient');
    tokenManager.setUserSession(DEFAULT_PATIENT_PROFILE);
  };

  // Real API Register
  const register = async (newProfile: Partial<PatientProfile> & { password?: string }): Promise<boolean> => {
    setLoading(true);
    try {
      const profile = await authService.registerPatient({
        name: newProfile.name || 'مريض جديد',
        phone: newProfile.phone || '01000000000',
        email: newProfile.email || 'patient@caresync.com',
        password: newProfile.password || '1234',
        nationalId: newProfile.nationalId,
        gender: newProfile.gender,
        birthDate: newProfile.birthDate,
        age: newProfile.age,
        bloodType: newProfile.bloodType,
      });
      setPatient(profile);
      setIsAuthenticated(true);
      setAppointments([]);
      setPrescriptions([]);
      setLabReports([]);
      setVitals([]);
      setNotifications([]);
      return true;
    } catch (err: any) {
      console.warn('[PatientAuth] Live register failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setPatient(null);
    setIsAuthenticated(false);
    setAppointments([]);
    setPrescriptions([]);
    setLabReports([]);
    setVitals([]);
    setNotifications([]);
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  };

  const updateProfile = async (updated: Partial<PatientProfile>) => {
    try {
      const res = await patientService.updateProfile(updated);
      setPatient(res);
    } catch {
      setPatient(prev => (prev ? { ...prev, ...updated } : null));
    }
  };

  const addAppointment = async (
    data: Omit<PatientAppointment, 'id' | 'bookingReference' | 'status'>
  ): Promise<PatientAppointment> => {
    let bookedApt: PatientAppointment;
    try {
      bookedApt = await appointmentService.bookAppointment({
        ...data,
        patientName: patient?.name,
        patientPhone: patient?.phone,
      });
    } catch {
      bookedApt = {
        ...data,
        id: `apt-${Date.now()}`,
        bookingReference: `CS-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'upcoming',
      };
    }

    setAppointments(prev => [bookedApt, ...prev]);

    // Create corresponding invoice
    if (patient?.id) {
      try {
        const invKey = `caresync_patient_invoices_${patient.id}`;
        const existingInvoicesStr = localStorage.getItem(invKey);
        const existingInvoices = existingInvoicesStr ? JSON.parse(existingInvoicesStr) : [];
        const coverage = patient.insurance?.coveragePercentage || 0;
        const totalAmount = data.consultationFee || 350;
        const discount = Math.round((totalAmount * coverage) / 100);
        const net = totalAmount - discount;

        const newInvoice = {
          id: `inv-${Date.now()}`,
          invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `كشف واستشارة طبية - ${data.doctorName}`,
          doctorName: data.doctorName,
          departmentName: data.departmentName,
          date: data.date,
          time: data.time,
          totalAmount: totalAmount,
          insuranceDiscount: discount,
          netPaid: net,
          paymentMethod: coverage > 0 ? 'insurance' : 'cash',
          status: 'pending',
          receiptNotes: coverage > 0 
            ? `تغطية تأمينية بنسبة ${coverage}% عبر ${patient.insurance?.provider || 'التأمين'}` 
            : 'مستحق السداد بالاستقبال أو إلكترونياً'
        };

        localStorage.setItem(invKey, JSON.stringify([newInvoice, ...existingInvoices]));
      } catch (e) {
        console.warn('Failed to save appointment invoice:', e);
      }
    }

    return bookedApt;
  };

  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    try {
      await appointmentService.cancelAppointment(appointmentId, reason);
    } catch (err) {
      console.warn('[PatientAuth] Live cancel failed, updating locally:', err);
    }

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'cancelled' as const, notes: reason ? `سبب الإلغاء: ${reason}` : apt.notes }
          : apt
      )
    );
  };

  const rescheduleAppointment = async (appointmentId: string, newDate: string, newTime: string) => {
    try {
      await appointmentService.rescheduleAppointment(appointmentId, newDate, newTime);
    } catch (err) {
      console.warn('[PatientAuth] Live reschedule failed, updating locally:', err);
    }

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, date: newDate, time: newTime, status: 'upcoming' as const }
          : apt
      )
    );
  };

  const addVitalRecord = async (record: Omit<HealthVitalRecord, 'id'>) => {
    try {
      const newVital = await patientService.addVitalRecord(record);
      setVitals(prev => [newVital, ...prev]);
    } catch {
      const newRecord: HealthVitalRecord = {
        ...record,
        id: `vit-${Date.now()}`,
      };
      setVitals(prev => [newRecord, ...prev]);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await patientService.markNotificationRead(id);
    } catch {}
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    try {
      await patientService.markAllNotificationsRead(patient?.id);
    } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <PatientAuthContext.Provider
      value={{
        patient,
        isAuthenticated,
        loading,
        appointments,
        prescriptions,
        labReports,
        vitals,
        notifications,
        login,
        loginDemo,
        register,
        logout,
        updateProfile,
        addAppointment,
        cancelAppointment,
        rescheduleAppointment,
        addVitalRecord,
        markNotificationRead,
        markAllNotificationsRead,
        refreshPatientData,
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  );
};

export const usePatientAuth = () => {
  const context = useContext(PatientAuthContext);
  if (!context) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
};
