import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Building2, 
  CreditCard, 
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';
import { AdminLoginPage } from '../Auth/AdminLoginPage';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { adminProfile, appointments, doctors, isAuthenticated, logoutAdmin } = useAdminAuth();

  // If not authenticated, render dedicated Admin Login Page
  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  const activeDoctorsCount = doctors.filter(d => d.isActive !== false).length;
  const pendingAptsCount = appointments.filter(a => a.status === 'upcoming').length;

  const navLinks = [
    { label: 'نظرة عامة', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'إدارة الأطباء', path: '/admin/doctors', icon: Users, badge: activeDoctorsCount },
    { label: 'المواعيد والكشوفات', path: '/admin/appointments', icon: CalendarDays, badge: pendingAptsCount },
    { label: 'الأقسام والعيادات', path: '/admin/departments', icon: Building2 },
    { label: 'التقارير المالية', path: '/admin/finances', icon: CreditCard },
  ];

  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-right" dir="rtl">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Admin Badge & Profile */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{adminProfile.name}</span>
                  <span className="px-2 py-0.2 bg-slate-900 text-white rounded-md text-[10px] font-bold">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">{adminProfile.role}</span>
              </div>
            </div>

            {/* Navigation Links Desktop */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick Actions: Logout & Site */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1"
                title="تسجيل الخروج من لوحة الإدارة"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>

              <span className="text-slate-200">|</span>

              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>الموقع الرئيسي</span>
              </button>
            </div>

          </div>

          {/* Mobile & Tablet Nav Links */}
          <div className="lg:hidden flex items-center justify-between pb-3 gap-1 overflow-x-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 shrink-0 ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-3 h-3" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>

    </div>
  );
};
