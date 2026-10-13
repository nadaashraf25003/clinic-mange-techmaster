import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CalendarDays, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Building2, 
  Plus, 
  ArrowLeft, 
  Activity, 
  Stethoscope,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    doctors, 
    appointments, 
    financials, 
    activityLogs, 
    stats, 
    loading, 
    refreshAdminData, 
    updateAppointmentStatus 
  } = useAdminAuth();

  // Metrics calculations (combining live stats & active lists)
  const totalRevenue = stats?.totalRevenue ?? financials.reduce((sum, item) => sum + (item.status === 'paid' ? item.amount : 0), 0);
  const totalPatientsCount = stats?.totalPatients ?? (new Set(appointments.map(a => a.patientName)).size || 14);
  const completedApts = appointments.filter(a => a.status === 'completed').length;
  const upcomingApts = appointments.filter(a => a.status === 'upcoming').length;
  const activeDoctors = stats?.activeDoctors ?? doctors.filter(d => d.isActive !== false).length;
  const completionRate = appointments.length > 0 ? Math.round((completedApts / appointments.length) * 100) : 0;

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Welcome Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              لوحة التحكم والإشراف العام للعيادات
            </h2>
            <button
              onClick={() => refreshAdminData()}
              disabled={loading}
              className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              {loading ? '● جاري التحديث...' : '● النظام متصل ومباشر (تحديث ↻)'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة حركة المرضى، إيرادات اليوم، وجداول الأطباء المناوبين في المركز الطبي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/doctors')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طبيب</span>
          </button>

          <button
            onClick={() => navigate('/admin/finances')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>التقرير المالي</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>إجمالي الإيرادات المسجلة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ج.م
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {totalRevenue.toLocaleString()} ج.م
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+18% اليوم</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {financials.length} فواتير مسددة عبر الخزينة والتأمين
          </p>
        </div>

        {/* Patients Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>إجمالي المترددين</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {totalPatientsCount} مريض
            </span>
            <span className="text-[10px] font-semibold text-blue-600">
              ملفات نشطة
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {appointments.length} مواعيد مسجلة بالنظام
          </p>
        </div>

        {/* Completed Consultations Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>نسبة إنجاز الكشوفات</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {completionRate}%
            </span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              {completedApts} تم كشفهم
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            متبقي {upcomingApts} بانتظار الكشف
          </p>
        </div>

        {/* Active Doctors Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>الأطباء المناوبون</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {activeDoctors} / {doctors.length}
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              جاهزون للاستقبال
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            في 5 تخصصات وعيادات رئيسية
          </p>
        </div>

      </div>

      {/* Main Grid: Live Appointments & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent / Live Appointments (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-xs text-slate-900">أحدث كشوفات ومواعيد اليوم</h3>
            </div>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              <span>عرض كل المواعيد ({appointments.length})</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {appointments.slice(0, 5).map((apt, index) => (
              <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{apt.patientName || 'مريض مجهول'}</h4>
                    <p className="text-[11px] text-slate-500">
                      مع {apt.doctorName} • <span className="text-slate-700 font-medium">{apt.departmentName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                  <span className="font-mono text-slate-500 text-xs">{apt.time}</span>

                  <button
                    onClick={() => updateAppointmentStatus(apt.id, apt.status === 'completed' ? 'upcoming' : 'completed')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      apt.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {apt.status === 'completed' ? '✓ تم الكشف' : 'بانتظار الكشف'}
                  </button>

                  <span className="font-bold font-mono text-slate-800 text-xs">
                    {apt.consultationFee} ج.م
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs & Quick Stats (1 Col) */}
        <div className="space-y-4">
          
          {/* Recent Operations Log */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-600" />
                <h3 className="font-bold text-xs text-slate-900">سجل العمليات الإدارية</h3>
              </div>
              <span className="text-[10px] text-slate-400">تحديث فوري</span>
            </div>

            <div className="space-y-2.5">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">{log.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{log.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Clinic Capacity Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 text-xs">حالة استيعاب العيادات اليوم</h4>
            
            <div className="space-y-2 pt-1 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>عيادة القلب والأوعية</span>
                  <span className="font-bold text-slate-900">85%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full w-[85%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>عيادة طب وجراحة الأسنان</span>
                  <span className="font-bold text-slate-900">60%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full w-[60%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>عيادة العظام والمفاصل</span>
                  <span className="font-bold text-slate-900">70%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full w-[70%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
