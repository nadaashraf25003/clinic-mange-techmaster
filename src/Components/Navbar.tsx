import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  Phone, 
  CalendarPlus, 
  Menu, 
  X, 
  User, 
  UserCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { CLINIC_INFO } from '../utils/constants';
import { usePatientAuth } from '../Hooks/usePatientAuth';
import { PatientAuthModal } from '../Views/Auth/PatientAuthModal';

interface NavbarProps {
  onOpenBooking: (doctorName?: string, departmentId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const navigate = useNavigate();
  const { patient, isAuthenticated: isPatientAuth, logout } = usePatientAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'العيادات', href: '#departments' },
    { label: 'الأطباء', href: '#doctors' },
    { label: 'المميزات', href: '#features' },
    { label: 'آراء المرضى', href: '#testimonials' },
  ];

  const handlePatientPortalClick = () => {
    if (isPatientAuth) {
      navigate('/patient/dashboard');
    } else {
      setIsPatientModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-all text-right">
        
        {/* Top Info Bar */}
        <div className="bg-slate-900 text-slate-400 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-brand-400" />
                <span>الخط الساخن: <strong className="text-white">{CLINIC_INFO.hotline}</strong></span>
              </span>
            </div>

            {/* Patient Auth Section Only */}
            <div className="flex items-center gap-3">
              {isPatientAuth ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 text-brand-400 hover:text-white font-semibold transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-brand-400" />
                    <span>الملف الطبي: {patient?.name?.split(' ')[0] || 'المريض'}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute left-0 top-full mt-1 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 text-right space-y-1"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/patient/dashboard');
                        }}
                        className="w-full text-right p-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700"
                      >
                        لوحة التحكم والمواعيد
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/patient/profile');
                        }}
                        className="w-full text-right p-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700"
                      >
                        الملف الطبي وبيانات التأمين
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-right p-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsPatientModalOpen(true)}
                  className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                >
                  <User className="w-3.5 h-3.5 text-brand-400" />
                  <span>تسجيل الدخول / حساب مريض جديد</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-2xs">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900">CareSync</span>
                <span className="text-[10px] block text-slate-400 -mt-1">مجمع العيادات الطبية</span>
              </div>
            </a>

            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              {isPatientAuth ? (
                <button
                  onClick={handlePatientPortalClick}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <UserCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>بوابة المريض</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsPatientModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>تسجيل الدخول</span>
                </button>
              )}

              <button
                onClick={() => onOpenBooking()}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>حجز موعد</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 sm:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePatientPortalClick();
                }}
                className="w-full py-2 text-xs font-semibold bg-slate-100 rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <UserCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isPatientAuth ? 'بوابة المريض والملف الطبي' : 'تسجيل دخول المريض'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>حجز موعد جديد</span>
              </button>
            </div>
          </div>
        )}

      </header>

      <PatientAuthModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
      />
    </>
  );
};
