import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  CalendarDays, 
  FileText, 
  UserCircle, 
  ExternalLink,
  ChevronDown,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useDoctorAuth } from '../../Hooks/useDoctorAuth';
import { FEATURED_DOCTORS } from '../../utils/constants';
import { DoctorLoginPage } from '../Auth/DoctorLoginPage';

export const DoctorLayout: React.FC = () => {
  const navigate = useNavigate();
  const { currentDoctor, switchDoctor, allDoctors, isAuthenticated, logoutDoctor } = useDoctorAuth();
  const [docSwitcherOpen, setDocSwitcherOpen] = useState(false);

  // If not authenticated, render Doctor Login page directly
  if (!isAuthenticated) {
    return <DoctorLoginPage />;
  }

  const activeDoctorsList = allDoctors.length > 0 ? allDoctors : FEATURED_DOCTORS;

  const navLinks = [
    { label: 'مواعيد وكشوفات اليوم', path: '/doctor/dashboard', icon: CalendarDays },
    { label: 'كتابة روشتة سريعة', path: '/doctor/consultation', icon: FileText },
    { label: 'المستحقات والأرباح', path: '/doctor/payments', icon: CreditCard },
    { label: 'الملف المهني ومواعيد العمل', path: '/doctor/profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    logoutDoctor();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-right" dir="rtl">
      
      {/* Simple Clean Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Doctor Info & Switcher */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>

              <div className="relative">
                <button
                  onClick={() => setDocSwitcherOpen(!docSwitcherOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand-600"
                >
                  <span>{currentDoctor.name} ({currentDoctor.departmentName})</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                <span className="text-[10px] text-slate-400 block -mt-0.5">بوابة الاستشاريين</span>

                {docSwitcherOpen && (
                  <div 
                    className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50 text-right space-y-1 max-h-80 overflow-y-auto"
                    onMouseLeave={() => setDocSwitcherOpen(false)}
                  >
                    <span className="text-[10px] text-slate-400 font-bold px-2 block">تبديل الطبيب:</span>
                    {activeDoctorsList.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          switchDoctor(d.id);
                          setDocSwitcherOpen(false);
                        }}
                        className={`w-full text-right p-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                          d.id === currentDoctor.id ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img src={d.imageUrl} alt={d.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{d.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions: Logout & Site */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1"
                title="تسجيل الخروج من عيادة الطبيب"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>

              <span className="text-slate-200">|</span>

              <button
                onClick={() => navigate('/')}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>الموقع الرئيسي</span>
              </button>
            </div>

          </div>

          {/* Mobile Nav */}
          <div className="sm:hidden flex items-center justify-between pb-3 gap-1 overflow-x-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>

    </div>
  );
};
