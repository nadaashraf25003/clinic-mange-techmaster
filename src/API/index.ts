/**
 * CareSync Central API & Services Export Hub
 */

// 1. Core Config & Network
export * from './URLs';
export * from './token';
export * from './Config';

// 2. Specialized Modular Services
export * from './services/authService';
export * from './services/departmentService';
export * from './services/doctorService';
export * from './services/patientService';
export * from './services/appointmentService';
export * from './services/medicalRecordService';
export * from './services/financeService';
export * from './services/adminService';

// 3. Backward Compatibility
export { clinicService } from './clinicService';
