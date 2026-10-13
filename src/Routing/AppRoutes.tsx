import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../Views/LandingPage/LandingPage';
import { PatientLayout } from '../Views/PatientPortal/PatientLayout';
import { PatientDashboard } from '../Views/PatientPortal/PatientDashboard';
import { PatientAppointments } from '../Views/PatientPortal/PatientAppointments';
import { PatientPrescriptions } from '../Views/PatientPortal/PatientPrescriptions';
import { PatientLabReports } from '../Views/PatientPortal/PatientLabReports';
import { PatientVitals } from '../Views/PatientPortal/PatientVitals';
import { PatientProfile } from '../Views/PatientPortal/PatientProfile';
import { PatientInvoices } from '../Views/PatientPortal/PatientInvoices';
import { DoctorLayout } from '../Views/DoctorPortal/DoctorLayout';
import { DoctorDashboard } from '../Views/DoctorPortal/DoctorDashboard';
import { DoctorConsultation } from '../Views/DoctorPortal/DoctorConsultation';
import { DoctorProfile } from '../Views/DoctorPortal/DoctorProfile';
import { DoctorPayments } from '../Views/DoctorPortal/DoctorPayments';
import { AdminLayout } from '../Views/AdminPortal/AdminLayout';
import { AdminDashboard } from '../Views/AdminPortal/AdminDashboard';
import { AdminDoctors } from '../Views/AdminPortal/AdminDoctors';
import { AdminAppointments } from '../Views/AdminPortal/AdminAppointments';
import { AdminDepartments } from '../Views/AdminPortal/AdminDepartments';
import { AdminFinances } from '../Views/AdminPortal/AdminFinances';
import { QuickBookingModal } from '../Components/QuickBookingModal';

export const AppRoutes: React.FC = () => {
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<string | undefined>();
  const [bookingDept, setBookingDept] = useState<string | undefined>();

  const handleOpenBooking = (doctorName?: string, departmentId?: string) => {
    setBookingDoctor(doctorName);
    setBookingDept(departmentId);
    setIsQuickBookingOpen(true);
  };

  return (
    <>
      <Routes>
        {/* Main Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Patient Portal Area */}
        <Route 
          path="/patient" 
          element={<PatientLayout onOpenBookingModal={() => handleOpenBooking()} />}
        >
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard onOpenBookingModal={() => handleOpenBooking()} />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="lab-reports" element={<PatientLabReports />} />
          <Route path="vitals" element={<PatientVitals />} />
          <Route path="invoices" element={<PatientInvoices />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* Doctor Portal Area */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="consultation" element={<DoctorConsultation />} />
          <Route path="payments" element={<DoctorPayments />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        {/* Admin Portal Area */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="finances" element={<AdminFinances />} />
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Quick Booking Modal */}
      <QuickBookingModal
        isOpen={isQuickBookingOpen}
        onClose={() => setIsQuickBookingOpen(false)}
        initialDoctorName={bookingDoctor}
        initialDepartmentId={bookingDept}
      />
    </>
  );
};
