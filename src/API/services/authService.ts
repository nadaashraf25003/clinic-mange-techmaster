/**
 * Authentication Service
 * Handles login, registration, and session token storage for Patients, Doctors, and Admins
 */
import { apiClient } from '../Config';
import { API_URLS } from '../URLs';
import { tokenManager } from '../token';
import { PatientProfile, Doctor, AdminProfile } from '../../utils/types';

export interface PatientLoginPayload {
  phoneOrEmail: string;
  pinCode?: string;
}

export interface PatientRegisterPayload {
  name: string;
  phone: string;
  email: string;
  password?: string;
  nationalId?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  age?: number;
  bloodType?: string;
}

export interface DoctorLoginPayload {
  doctorIdOrEmail?: string;
  emailOrPhone?: string;
  password?: string;
}

export interface AdminLoginPayload {
  emailOrUsername?: string;
  password?: string;
  pinCode?: string;
}

export interface PatientCheckResult {
  exists: boolean;
  patientId?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

export const authService = {
  // 0. Check if Patient already has an account
  async checkPatientExists(identifier: string): Promise<PatientCheckResult> {
    if (!identifier || identifier.trim().length === 0) {
      return { exists: false };
    }
    try {
      return await apiClient.get<PatientCheckResult>(API_URLS.auth.checkPatientExists(identifier.trim()));
    } catch {
      return { exists: false };
    }
  },

  // 1. Patient Login
  async loginPatient(payload: PatientLoginPayload | { identifier: string; password?: string }): Promise<PatientProfile> {
    const phoneOrEmail = 'phoneOrEmail' in payload ? payload.phoneOrEmail : payload.identifier;
    const pinCode = 'pinCode' in payload ? payload.pinCode : ('password' in payload ? payload.password : '1234');

    const data = await apiClient.post<any>(API_URLS.auth.patientLogin, {
      phoneOrEmail: phoneOrEmail.trim(),
      pinCode: pinCode || '1234',
    });

    const userProfile: PatientProfile = data?.user || data;
    const token = data?.token || `token_pat_${userProfile.id || Date.now()}`;

    tokenManager.setToken(token);
    tokenManager.setRole('patient');
    tokenManager.setUserSession(userProfile);

    return userProfile;
  },

  // 2. Patient Registration
  async registerPatient(payload: PatientRegisterPayload): Promise<PatientProfile> {
    const defaultBirthDate = payload.birthDate || '1995-01-01';
    const calculatedAge = payload.age || (new Date().getFullYear() - parseInt(defaultBirthDate.split('-')[0], 10)) || 30;

    const data = await apiClient.post<any>(API_URLS.auth.patientRegister, {
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      password: payload.password?.trim() || '1234',
      nationalId: payload.nationalId || '29408150102456',
      gender: payload.gender || 'male',
      birthDate: defaultBirthDate,
      age: calculatedAge,
      bloodType: payload.bloodType || 'A+',
    });

    const userProfile: PatientProfile = data?.user || data;
    const token = data?.token || `token_pat_${userProfile.id || Date.now()}`;

    tokenManager.setToken(token);
    tokenManager.setRole('patient');
    tokenManager.setUserSession(userProfile);

    return userProfile;
  },

  // 3. Doctor Login with Password
  async loginDoctor(payload: DoctorLoginPayload | { emailOrPhone: string; password?: string }): Promise<Doctor> {
    const emailOrPhone = 'emailOrPhone' in payload ? payload.emailOrPhone : payload.doctorIdOrEmail;
    const password = payload.password || 'doctor123';

    const data = await apiClient.post<any>(API_URLS.auth.doctorLogin, {
      emailOrPhone,
      doctorIdOrEmail: emailOrPhone,
      password,
    });

    const doctorProfile: Doctor = data?.user || data;
    const token = data?.token || `token_doc_${doctorProfile.id || Date.now()}`;

    tokenManager.setToken(token);
    tokenManager.setRole('doctor');
    tokenManager.setUserSession(doctorProfile);

    return doctorProfile;
  },

  // 4. Admin Login with Username / Password / PIN
  async loginAdmin(payload: AdminLoginPayload | { emailOrUsername?: string; password?: string; pin?: string }): Promise<AdminProfile> {
    const emailOrUsername = 'emailOrUsername' in payload ? payload.emailOrUsername : 'admin';
    const password = 'password' in payload ? payload.password : ('pin' in payload ? payload.pin : 'admin123');
    const pinCode = 'pinCode' in payload ? payload.pinCode : ('pin' in payload ? payload.pin : undefined);

    const data = await apiClient.post<any>(API_URLS.auth.adminLogin, {
      emailOrUsername,
      password,
      pinCode,
    });

    const adminProfile: AdminProfile = data?.user || data;
    const token = data?.token || `token_adm_${adminProfile.id || Date.now()}`;

    tokenManager.setToken(token);
    tokenManager.setRole('admin');
    tokenManager.setUserSession(adminProfile);

    return adminProfile;
  },

  // 5. Get current active session
  getCurrentUser<T = any>(): T | null {
    return tokenManager.getUserSession<T>();
  },

  // 6. Check if logged in
  isAuthenticated(): boolean {
    return tokenManager.hasToken();
  },

  // 7. Logout and clear credentials
  logout(): void {
    tokenManager.clearAuth();
  },
};
