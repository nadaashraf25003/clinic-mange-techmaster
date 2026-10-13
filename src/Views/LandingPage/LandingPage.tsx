import React, { useState } from 'react';
import { Navbar } from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import { QuickBookingModal } from '../../Components/QuickBookingModal';
import { HeroSection } from './HeroSection';
import { DepartmentsSection } from './DepartmentsSection';
import { DoctorsSection } from './DoctorsSection';
import { FeaturesSection } from './FeaturesSection';
import { BookingCTASection } from './BookingCTASection';
import { TestimonialsSection } from './TestimonialsSection';
import { useClinicData } from '../../Hooks/useClinicData';

export const LandingPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

  const { departments, doctors } = useClinicData();

  const handleOpenBooking = (doctorId?: string, departmentId?: string) => {
    setSelectedDoctorId(doctorId);
    if (departmentId) {
      setSelectedDepartmentId(departmentId);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedDoctorId(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection onOpenBooking={() => handleOpenBooking()} />

        {/* 2. Departments Section */}
        <DepartmentsSection
          departments={departments}
          onSelectDepartment={(deptId) => setSelectedDepartmentId(deptId)}
          onOpenBooking={(docId, deptId) => handleOpenBooking(docId, deptId)}
        />

        {/* 3. Doctors Section */}
        <DoctorsSection
          doctors={doctors}
          departments={departments}
          selectedDepartmentId={selectedDepartmentId}
          onSelectDepartment={(deptId) => setSelectedDepartmentId(deptId)}
          onOpenBooking={(docId, deptId) => handleOpenBooking(docId, deptId)}
        />

        {/* 4. Features & Why Us */}
        <FeaturesSection />

        {/* 5. Booking Call To Action Banner */}
        <BookingCTASection onOpenBooking={() => handleOpenBooking()} />

        {/* 6. Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Interactive Quick Booking Modal */}
      <QuickBookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialDoctorId={selectedDoctorId}
        initialDepartmentId={selectedDepartmentId}
      />
    </div>
  );
};
