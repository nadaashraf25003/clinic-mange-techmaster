/**
 * Finance & Billing Service
 * Handles financial records, invoices, payments, and insurance claims
 */
import { apiClient } from '../Config';
import { API_URLS } from '../URLs';
import { ClinicFinancialRecord } from '../../utils/types';

export const financeService = {
  // Get financial records / invoices
  async getFinancialRecords(params?: {
    patientId?: string;
    doctorId?: string;
    status?: string;
  }): Promise<ClinicFinancialRecord[]> {
    try {
      return await apiClient.get<ClinicFinancialRecord[]>(API_URLS.finances.getAll(params));
    } catch {
      return [];
    }
  },

  // Create new invoice / financial transaction
  async createFinancialRecord(record: Omit<ClinicFinancialRecord, 'id' | 'invoiceNumber'>): Promise<ClinicFinancialRecord> {
    return await apiClient.post<ClinicFinancialRecord>(API_URLS.finances.create, record);
  }
};
