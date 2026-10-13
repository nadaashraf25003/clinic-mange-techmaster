import { useState, useEffect } from 'react';
import { Department, Doctor } from '../utils/types';
import { clinicService } from '../API/clinicService';

export const useClinicData = (selectedDeptId?: string) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [deptList, docList] = await Promise.all([
          clinicService.getDepartments(),
          clinicService.getDoctors(selectedDeptId),
        ]);
        if (isMounted) {
          setDepartments(deptList);
          setDoctors(docList);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'فشل في تحميل بيانات العيادة');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [selectedDeptId]);

  return { departments, doctors, loading, error };
};
