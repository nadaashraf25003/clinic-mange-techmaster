/**
 * Department Service
 * Handles fetching, creating, updating, and deleting clinical departments
 */
import { apiClient } from '../Config';
import { API_URLS } from '../URLs';
import { Department } from '../../utils/types';
import { DEPARTMENTS } from '../../utils/constants';

export const departmentService = {
  // Get all medical departments
  async getDepartments(): Promise<Department[]> {
    try {
      return await apiClient.get<Department[]>(API_URLS.departments.getAll);
    } catch (err) {
      console.warn('[DepartmentService] Falling back to local data:', err);
      return DEPARTMENTS;
    }
  },

  // Get department by ID
  async getDepartmentById(id: string): Promise<Department> {
    return await apiClient.get<Department>(API_URLS.departments.getById(id));
  },

  // Create department
  async createDepartment(department: Omit<Department, 'id'> & { code?: string }): Promise<Department> {
    const payload = {
      ...department,
      code: department.code || (department.nameEn ? department.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-') : `dept-${Date.now()}`),
      nameEn: department.nameEn || department.name,
      icon: department.icon || 'Stethoscope',
      colorClass: department.colorClass || 'from-blue-500/10 to-indigo-500/5 text-blue-600 border-blue-100',
      doctorsCount: department.doctorsCount || 0
    };
    return await apiClient.post<Department>(API_URLS.departments.create, payload);
  },

  // Update department
  async updateDepartment(id: string, department: Partial<Department>): Promise<Department> {
    return await apiClient.put<Department>(API_URLS.departments.update(id), department);
  },

  // Delete department
  async deleteDepartment(id: string): Promise<void> {
    return await apiClient.delete<void>(API_URLS.departments.delete(id));
  }
};
