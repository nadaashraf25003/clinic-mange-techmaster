import { Department, Doctor, AppointmentBookingRequest, BookingResponse } from '../utils/types';
import { departmentService } from './services/departmentService';
import { doctorService } from './services/doctorService';
import { appointmentService } from './services/appointmentService';

export const clinicService = {
  // Get all departments
  async getDepartments(): Promise<Department[]> {
    return await departmentService.getDepartments();
  },

  // Get all doctors with optional department filtering
  async getDoctors(departmentId?: string): Promise<Doctor[]> {
    return await doctorService.getDoctors(departmentId ? { departmentId } : undefined);
  },

  // Submit quick appointment booking request
  async submitAppointment(data: AppointmentBookingRequest): Promise<BookingResponse> {
    return await appointmentService.quickBook(data);
  }
};
