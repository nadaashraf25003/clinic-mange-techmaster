import React from 'react';
import { Navigate } from 'react-router-dom';

export const DoctorPatients: React.FC = () => {
  return <Navigate to="/doctor/dashboard" replace />;
};
