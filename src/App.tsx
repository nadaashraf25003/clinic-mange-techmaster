import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './Routing/AppRoutes';
import { PatientAuthProvider } from './Hooks/usePatientAuth';
import { DoctorAuthProvider } from './Hooks/useDoctorAuth';
import { AdminAuthProvider } from './Hooks/useAdminAuth';
import './App.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PatientAuthProvider>
        <DoctorAuthProvider>
          <AdminAuthProvider>
            <AppRoutes />
          </AdminAuthProvider>
        </DoctorAuthProvider>
      </PatientAuthProvider>
    </BrowserRouter>
  );
};

export default App;
