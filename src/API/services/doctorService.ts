/**
 * Doctor Service
 * Handles doctor listing, queues, fees, profiles, and administration
 */
import { apiClient } from '../Config';
import { API_URLS } from '../URLs';
import { Doctor, DoctorQueuePatient } from '../../utils/types';
import { FEATURED_DOCTORS } from '../../utils/constants';

export interface DoctorFinancesSummary {
  doctorId: string;
  doctorName: string;
  totalConsultations: number;
  completedConsultations: number;
  totalRevenue: number;
  netEarnings: number;
  dailyEarnings: { date: string; amount: number; count: number }[];
  todayEarnings?: number;
  totalEarnings?: number;
  completedVisitsCount?: number;
}

export const doctorService = {
  // Get doctors list with optional department or search filter
  async getDoctors(params?: { departmentId?: string; search?: string }): Promise<Doctor[]> {
    try {
      return await apiClient.get<Doctor[]>(API_URLS.doctors.getAll(params));
    } catch (err) {
      console.warn('[DoctorService] Falling back to local data:', err);
      let list = FEATURED_DOCTORS;
      if (params?.departmentId) {
        list = list.filter(d => d.departmentId === params.departmentId);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(query) || d.title.toLowerCase().includes(query));
      }
      return list;
    }
  },

  // Get doctor profile by ID
  async getDoctorById(id: string): Promise<Doctor> {
    return await apiClient.get<Doctor>(API_URLS.doctors.getById(id));
  },

  // Get current active patient queue for doctor
  async getDoctorQueue(doctorId: string): Promise<DoctorQueuePatient[]> {
    try {
      return await apiClient.get<DoctorQueuePatient[]>(API_URLS.doctors.getQueue(doctorId));
    } catch {
      return [];
    }
  },

  // Get doctor financial summary
  async getDoctorFinances(doctorId: string): Promise<DoctorFinancesSummary> {
    return await apiClient.get<DoctorFinancesSummary>(API_URLS.doctors.getFinances(doctorId));
  },

  // Create new doctor
  async createDoctor(doctor: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>): Promise<Doctor> {
    const payload = {
      ...doctor,
      phone: doctor.phone || '01000000000',
      email: doctor.email || 'doctor@caresync.com',
      roomNumber: 'عيادة ' + (doctor.departmentName || 'الاستشارات'),
      specialties: doctor.specialties || ['استشارات عامة'],
      availableDays: doctor.availableDays || ['السبت', 'الإثنين', 'الأربعاء'],
      imageUrl: doctor.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
    };
    return await apiClient.post<Doctor>(API_URLS.doctors.create, payload);
  },

  // Update doctor
  async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
    return await apiClient.put<Doctor>(API_URLS.doctors.update(id), doctor);
  },

  // Toggle active/inactive status
  async toggleDoctorStatus(id: string): Promise<{ isActive: boolean }> {
    return await apiClient.put<{ isActive: boolean }>(API_URLS.doctors.toggleStatus(id));
  },

  // Update consultation fee
  async updateDoctorFee(id: string, newFee: number): Promise<{ newFee: number }> {
    return await apiClient.put<{ newFee: number }>(API_URLS.doctors.updateFee(id), { newFee });
  },

  // Delete doctor
  async deleteDoctor(id: string): Promise<void> {
    return await apiClient.delete<void>(API_URLS.doctors.delete(id));
  }
};
