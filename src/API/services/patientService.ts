/**
 * Patient Service
 * Handles fetching/updating patient profile, vitals history, and notifications
 */
import { apiClient } from '../Config';
import { API_URLS } from '../URLs';
import { PatientProfile, HealthVitalRecord, PatientNotification } from '../../utils/types';
import { DEFAULT_PATIENT_PROFILE, INITIAL_HEALTH_VITALS, INITIAL_NOTIFICATIONS } from '../../utils/constants';

export const patientService = {
  // Get current patient profile
  async getProfile(patientId?: string): Promise<PatientProfile> {
    return await apiClient.get<PatientProfile>(API_URLS.patients.getMe(patientId));
  },

  // Update profile
  async updateProfile(profile: Partial<PatientProfile>): Promise<PatientProfile> {
    return await apiClient.put<PatientProfile>(API_URLS.patients.updateMe, profile);
  },

  // Get patient vitals history
  async getVitals(patientId?: string): Promise<HealthVitalRecord[]> {
    try {
      return await apiClient.get<HealthVitalRecord[]>(API_URLS.patients.getVitals(patientId));
    } catch {
      if (patientId === 'pat-101') return INITIAL_HEALTH_VITALS;
      return [];
    }
  },

  // Record a new vital sign entry
  async addVitalRecord(vital: Omit<HealthVitalRecord, 'id'>): Promise<HealthVitalRecord> {
    return await apiClient.post<HealthVitalRecord>(API_URLS.patients.addVital, vital);
  },

  // Get patient notifications
  async getNotifications(patientId?: string): Promise<PatientNotification[]> {
    try {
      return await apiClient.get<PatientNotification[]>(API_URLS.patients.getNotifications(patientId));
    } catch {
      if (patientId === 'pat-101') return INITIAL_NOTIFICATIONS;
      return [];
    }
  },

  // Mark single notification as read
  async markNotificationRead(id: string): Promise<void> {
    await apiClient.put<void>(API_URLS.patients.markNotificationRead(id));
  },

  // Mark all notifications as read
  async markAllNotificationsRead(patientId?: string): Promise<void> {
    await apiClient.put<void>(API_URLS.patients.markAllNotificationsRead(patientId));
  }
};
