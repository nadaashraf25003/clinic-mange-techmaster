import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doctor, PatientAppointment, Prescription, DoctorQueuePatient } from '../utils/types';
import { FEATURED_DOCTORS, INITIAL_PATIENT_APPOINTMENTS, INITIAL_PATIENT_PRESCRIPTIONS } from '../utils/constants';
import { 
  authService, 
  doctorService, 
  DoctorFinancesSummary, 
  medicalRecordService, 
  appointmentService, 
  tokenManager 
} from '../API';

interface DoctorContextType {
  currentDoctor: Doctor;
  allDoctors: Doctor[];
  isAuthenticated: boolean;
  loading: boolean;
  appointments: PatientAppointment[];
  prescriptions: Prescription[];
  queue: DoctorQueuePatient[];
  finances: DoctorFinancesSummary | null;
  refreshDoctorData: () => Promise<void>;
  loginDoctor: (emailOrPhone: string, password?: string) => Promise<boolean>;
  logoutDoctor: () => void;
  switchDoctor: (doctorId: string) => void;
  updateCurrentDoctor: (data: Partial<Doctor>) => Promise<void>;
  addPrescription: (data: {
    appointmentId?: string;
    patientName: string;
    diagnosis: string;
    medicines: string;
    notes?: string;
  }) => Promise<Prescription>;
  toggleAppointmentStatus: (appointmentId: string) => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(FEATURED_DOCTORS);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>(() => {
    const saved = localStorage.getItem('caresync_current_doctor');
    return saved ? JSON.parse(saved) : FEATURED_DOCTORS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('caresync_doctor_auth');
    const hasToken = tokenManager.hasToken();
    return Boolean(saved && JSON.parse(saved) && hasToken);
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [queue, setQueue] = useState<DoctorQueuePatient[]>([]);
  const [finances, setFinances] = useState<DoctorFinancesSummary | null>(null);

  // Load all doctors list once
  useEffect(() => {
    doctorService.getDoctors()
      .then(docs => {
        if (docs && docs.length > 0) {
          setAllDoctors(docs);
          // If current doctor was not set or matches one of the remote doctors, update it
          setCurrentDoctor(prev => {
            const found = docs.find(d => d.id === prev.id || d.email === prev.email || d.name === prev.name);
            return found || docs[0];
          });
        }
      })
      .catch(err => {
        console.warn('[DoctorAuth] Failed to load doctors list:', err);
      });
  }, []);

  // Sync auth state
  useEffect(() => {
    localStorage.setItem('caresync_doctor_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Sync current doctor to localStorage
  useEffect(() => {
    localStorage.setItem('caresync_current_doctor', JSON.stringify(currentDoctor));
  }, [currentDoctor]);

  // Sync prescriptions changes to localStorage
  useEffect(() => {
    if (prescriptions.length > 0) {
      localStorage.setItem('caresync_patient_prescriptions', JSON.stringify(prescriptions));
    }
  }, [prescriptions]);

  // Fetch all live data for current doctor from Backend API
  const refreshDoctorData = useCallback(async () => {
    if (!currentDoctor?.id) return;
    setLoading(true);
    try {
      const [
        liveProfile,
        liveAppointments,
        livePrescriptions,
        liveQueue,
        liveFinances
      ] = await Promise.allSettled([
        doctorService.getDoctorById(currentDoctor.id),
        appointmentService.getAppointments({ doctorId: currentDoctor.id }),
        medicalRecordService.getPrescriptions({ doctorId: currentDoctor.id }),
        doctorService.getDoctorQueue(currentDoctor.id),
        doctorService.getDoctorFinances(currentDoctor.id)
      ]);

      if (liveProfile.status === 'fulfilled' && liveProfile.value) {
        setCurrentDoctor(liveProfile.value);
      }
      if (liveAppointments.status === 'fulfilled' && Array.isArray(liveAppointments.value)) {
        setAppointments(liveAppointments.value);
      }
      if (livePrescriptions.status === 'fulfilled' && Array.isArray(livePrescriptions.value)) {
        setPrescriptions(livePrescriptions.value);
      }
      if (liveQueue.status === 'fulfilled' && Array.isArray(liveQueue.value)) {
        setQueue(liveQueue.value);
      }
      if (liveFinances.status === 'fulfilled' && liveFinances.value) {
        setFinances(liveFinances.value);
      }
    } catch (err) {
      console.warn('[DoctorAuth] Refresh sync failed:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDoctor?.id]);

  // Load data on mount or when currentDoctor / authentication changes
  useEffect(() => {
    if (currentDoctor?.id) {
      refreshDoctorData();
    }
  }, [currentDoctor?.id, isAuthenticated, refreshDoctorData]);

  // Real backend doctor login with password
  const loginDoctor = async (emailOrPhone: string, password?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const doc = await authService.loginDoctor({ emailOrPhone, password });
      if (doc) {
        setCurrentDoctor(doc);
        setIsAuthenticated(true);
        tokenManager.setRole('doctor');
        tokenManager.setUserSession(doc);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[DoctorAuth] Live login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutDoctor = () => {
    authService.logout();
    setIsAuthenticated(false);
    localStorage.removeItem('caresync_doctor_auth');
  };

  const switchDoctor = (doctorId: string) => {
    const doc = allDoctors.find(d => d.id === doctorId) || allDoctors[0];
    setCurrentDoctor(doc);
    tokenManager.setUserSession(doc);
  };

  const updateCurrentDoctor = async (data: Partial<Doctor>) => {
    try {
      if (currentDoctor.id) {
        const updated = await doctorService.updateDoctor(currentDoctor.id, data);
        setCurrentDoctor(updated);
        return;
      }
    } catch (err) {
      console.warn('[DoctorAuth] Update doctor online failed, updating locally:', err);
    }
    setCurrentDoctor(prev => ({ ...prev, ...data }));
  };

  const addPrescription = async (data: {
    appointmentId?: string;
    patientName: string;
    diagnosis: string;
    medicines: string;
    notes?: string;
  }): Promise<Prescription> => {
    const aptId = data.appointmentId || undefined;
    const rxId = `rx-${Date.now()}`;
    const rxNum = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRx: Prescription = {
      id: rxId,
      prescriptionNumber: rxNum,
      appointmentId: aptId,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.title,
      doctorImage: currentDoctor.imageUrl,
      date: new Date().toISOString().split('T')[0],
      diagnosis: data.diagnosis,
      notes: data.notes || '',
      medications: [
        {
          id: `m-${Date.now()}`,
          name: data.medicines,
          dosage: 'حسب إرشادات الطبيب',
          frequency: 'يومياً',
          duration: 'مستمر',
          instructions: data.notes || ''
        }
      ]
    };

    try {
      const created = await medicalRecordService.createPrescription(newRx);
      if (created) {
        setPrescriptions(prev => [created, ...prev]);
      } else {
        setPrescriptions(prev => [newRx, ...prev]);
      }
    } catch (err) {
      console.warn('[DoctorAuth] Live prescription creation failed, saving locally:', err);
      setPrescriptions(prev => [newRx, ...prev]);
    }

    // Link prescription to appointment if exists
    if (data.appointmentId) {
      try {
        await appointmentService.updateStatus(data.appointmentId, 'completed');
      } catch (e) {
        console.warn('Failed to update appointment status online:', e);
      }

      setAppointments(prev =>
        prev.map(a =>
          a.id === data.appointmentId
            ? { ...a, status: 'completed' as const, prescriptionId: rxId, diagnosisSummary: data.diagnosis }
            : a
        )
      );
    }

    return newRx;
  };

  const toggleAppointmentStatus = async (appointmentId: string) => {
    const targetApt = appointments.find(a => a.id === appointmentId);
    const nextStatus = targetApt?.status === 'completed' ? 'upcoming' : 'completed';

    try {
      await appointmentService.updateStatus(appointmentId, nextStatus);
    } catch (err) {
      console.warn('[DoctorAuth] Live toggle appointment status failed:', err);
    }

    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId
          ? { ...a, status: nextStatus }
          : a
      )
    );
  };

  return (
    <DoctorContext.Provider
      value={{
        currentDoctor,
        allDoctors,
        isAuthenticated,
        loading,
        appointments,
        prescriptions,
        queue,
        finances,
        refreshDoctorData,
        loginDoctor,
        logoutDoctor,
        switchDoctor,
        updateCurrentDoctor,
        addPrescription,
        toggleAppointmentStatus,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorAuth = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctorAuth must be used within DoctorAuthProvider');
  }
  return context;
};
