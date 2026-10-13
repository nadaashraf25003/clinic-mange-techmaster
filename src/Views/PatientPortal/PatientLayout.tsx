import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  HeartPulse, 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  FlaskConical, 
  Activity, 
  UserCircle, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  CalendarPlus, 
  ChevronDown, 
  ExternalLink,
  Phone,
  Check,
  CreditCard
} from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';
import { CLINIC_INFO } from '../../utils/constants';

interface PatientLayoutProps {
  onOpenBookingModal?: () => void;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ onOpenBookingModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    patient, 
    logout, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead 
  } = usePatientAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'لوحة التحكم', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'مواعيدي', path: '/patient/appointments', icon: CalendarDays },
    { label: 'الروشتات الطبية', path: '/patient/prescriptions', icon: FileText },
    { label: 'التحاليل والأشعة', path: '/patient/lab-reports', icon: FlaskConical },
    { label: 'المؤشرات الحيوية', path: '/patient/vitals', icon: Activity },
    { label: 'الفواتير والمدفوعات', path: '/patient/invoices', icon: CreditCard },
    { label: 'الملف الطبي', path: '/patient/profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans" dir="rtl">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* Clean Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900">CareSync</span>
                <span className="text-[11px] block text-slate-400">بوابة المريض</span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Patient Info */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
              {patient?.name?.charAt(0) || 'م'}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-slate-900 truncate">{patient?.name || 'مريض'}</p>
              <p className="text-[11px] text-slate-500">رقم الملف: {patient?.id || 'pat-101'}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>الموقع الرئيسي</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900">
                أهلاً، {patient?.name?.split(' ')[0] || 'المريض'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                title="التنبيهات"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-right"
                  onMouseLeave={() => setNotifDropdownOpen(false)}
                >
                  <div className="px-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">التنبيهات</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-brand-600 hover:underline"
                      >
                        تحديد كمقروء
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-center text-xs text-slate-400">لا توجد إشعارات</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <p className="font-bold text-slate-800">{n.title}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Book Button */}
            <button
              onClick={() => {
                if (onOpenBookingModal) {
                  onOpenBookingModal();
                } else {
                  navigate('/patient/appointments?action=new');
                }
              }}
              className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>حجز موعد</span>
            </button>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
