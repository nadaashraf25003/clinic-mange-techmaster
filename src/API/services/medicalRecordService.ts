/**
 * Medical Record Service
 * Handles prescriptions, laboratory reports, and doctor consultation notes
 */
import { apiClient } from '../Config';
import { API_URLS } from '../URLs';
import { Prescription, LabReport, DoctorConsultationNote } from '../../utils/types';
import { INITIAL_PATIENT_PRESCRIPTIONS, INITIAL_LAB_REPORTS } from '../../utils/constants';

export const medicalRecordService = {
  // Get prescriptions
  async getPrescriptions(params?: {
    patientId?: string;
    doctorId?: string;
    appointmentId?: string;
  }): Promise<Prescription[]> {
    try {
      return await apiClient.get<Prescription[]>(API_URLS.medicalRecords.getPrescriptions(params));
    } catch {
      if (params?.patientId && params.patientId !== 'pat-101') {
        return [];
      }
      return INITIAL_PATIENT_PRESCRIPTIONS;
    }
  },

  // Get prescription by ID
  async getPrescriptionById(id: string): Promise<Prescription> {
    return await apiClient.get<Prescription>(API_URLS.medicalRecords.getPrescriptionById(id));
  },

  // Create new prescription
  async createPrescription(prescription: Omit<Prescription, 'id'>): Promise<Prescription> {
    return await apiClient.post<Prescription>(API_URLS.medicalRecords.createPrescription, prescription);
  },

  // Get laboratory reports
  async getLabReports(patientId?: string): Promise<LabReport[]> {
    try {
      return await apiClient.get<LabReport[]>(API_URLS.medicalRecords.getLabReports(patientId));
    } catch {
      if (patientId && patientId !== 'pat-101') {
        return [];
      }
      return INITIAL_LAB_REPORTS;
    }
  },

  // Get lab report details by ID
  async getLabReportById(id: string): Promise<LabReport> {
    return await apiClient.get<LabReport>(API_URLS.medicalRecords.getLabReportById(id));
  },

  // Save doctor consultation notes
  async createConsultation(note: Omit<DoctorConsultationNote, 'id'>): Promise<DoctorConsultationNote> {
    return await apiClient.post<DoctorConsultationNote>(API_URLS.medicalRecords.createConsultation, note);
  }
};
