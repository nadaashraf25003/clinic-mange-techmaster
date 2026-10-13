/**
 * Administration & Management Service
 * Handles admin profile, system-wide analytics, and activity logs
 */
import { apiClient } from '../Config';
import { API_URLS } from '../URLs';
import { AdminProfile, AdminActivityLog } from '../../utils/types';

const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  id: 'adm-01',
  name: 'د. عبد الرحمن المنشاوي',
  role: 'المدير الطبي والتنفيذي',
  email: 'admin@caresync-clinic.com',
  phone: '01108894920',
  avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'
};

export interface AdminStatsSummary {
  totalPatients: number;
  totalDoctors?: number;
  activeDoctors?: number;
  totalAppointments: number;
  todayAppointments?: number;
  totalRevenue: number;
  todayRevenue?: number;
  occupancyRate?: number;
  bedCount?: number;
  overallRating?: number;
  satisfiedPatientsCount?: number;
}

export const adminService = {
  // Get admin profile
  async getProfile(): Promise<AdminProfile> {
    try {
      return await apiClient.get<AdminProfile>(API_URLS.admin.getProfile);
    } catch {
      return DEFAULT_ADMIN_PROFILE;
    }
  },

  // Get clinic statistics & KPIs
  async getStats(): Promise<AdminStatsSummary> {
    return await apiClient.get<AdminStatsSummary>(API_URLS.admin.getStats);
  },

  // Get admin activity audit logs
  async getActivityLogs(): Promise<AdminActivityLog[]> {
    try {
      return await apiClient.get<AdminActivityLog[]>(API_URLS.admin.getActivityLogs);
    } catch {
      return [];
    }
  }
};
