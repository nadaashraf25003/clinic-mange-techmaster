import React from 'react';
import { Navigate } from 'react-router-dom';

export const DoctorAppointments: React.FC = () => {
  return <Navigate to="/doctor/dashboard" replace />;
};
