import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  FlaskConical, 
  Activity, 
  CalendarPlus, 
  QrCode, 
  ChevronLeft,
  Pill
} from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';

interface PatientDashboardProps {
  onOpenBookingModal?: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onOpenBookingModal }) => {
  const navigate = useNavigate();
  const { 
    patient, 
    appointments, 
    prescriptions, 
    labReports, 
    vitals, 
    cancelAppointment 
  } = usePatientAuth();

  const [selectedTicketApt, setSelectedTicketApt] = useState<any | null>(null);

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const nextAppointment = upcomingAppointments[0];
  const latestPrescription = prescriptions[0];
  const latestVital = vitals[0];
  const completedLabs = labReports.filter(l => l.status === 'completed');

  return (
    <div className="space-y-6 text-right max-w-6xl mx-auto">
      
      {/* Simple Clean Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-brand-600 mb-1">
            ملف طبي: {patient?.id ? patient.id.slice(0, 8) : 'مريض مسجل'} • فصيلة الدم: {patient?.bloodType || 'غير محددة'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            مرحباً بك، {patient?.name || 'المريض'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تابع مواعيدك الطبية، الروشتات الرقمية، ونتائج الفحوصات
          </p>
        </div>

        <button
          onClick={() => {
            if (onOpenBookingModal) {
              onOpenBookingModal();
            } else {
              navigate('/patient/appointments?action=new');
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>حجز موعد جديد</span>
        </button>
      </div>

      {/* KPI Stats - Clean Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => navigate('/patient/appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>المواعيد القادمة</span>
            <Calendar className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{upcomingAppointments.length}</div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {nextAppointment ? nextAppointment.date : 'لا توجد مواعيد قادمة'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/patient/prescriptions')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>الروشتات الطبية</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{prescriptions.length}</div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {latestPrescription ? latestPrescription.doctorName : 'لا توجد روشتات مسجلة'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/patient/lab-reports')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>نتائج الفحوصات</span>
            <FlaskConical className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedLabs.length}</div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {labReports.length > 0 ? `${labReports.length} تقارير مسجلة` : 'لا توجد تحاليل مسجلة'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/patient/vitals')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>آخر قياس ضغط</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {latestVital ? `${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic}` : '-- / --'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {latestVital ? 'معدل قياس حديث' : 'لا توجد قياسات بعد'}
          </p>
        </div>

      </div>

      {/* Main Row: Next Appointment & Active Meds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Next Appointment Card (Col-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>الموعد الطبي القادم</span>
            </h3>
            <button
              onClick={() => navigate('/patient/appointments')}
              className="text-xs text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>جميع المواعيد</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextAppointment ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={nextAppointment.doctorImage}
                    alt={nextAppointment.doctorName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {nextAppointment.departmentName}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{nextAppointment.doctorName}</h4>
                    <p className="text-xs text-slate-500">{nextAppointment.doctorSpecialty}</p>
                  </div>
                </div>

                <div className="text-left font-mono text-xs text-slate-600">
                  <span className="text-[10px] text-slate-400 block">رقم الحجز</span>
                  <strong>{nextAppointment.bookingReference}</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">التاريخ</span>
                  <span className="font-bold text-slate-800">{nextAppointment.date}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">الوقت</span>
                  <span className="font-bold text-slate-800">{nextAppointment.time}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">العيادة</span>
                  <span className="font-bold text-slate-800 truncate block">{nextAppointment.roomNumber}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedTicketApt(nextAppointment)}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>تذكرة الحجز (QR)</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('هل ترغب في إلغاء هذا الموعد؟')) {
                      cancelAppointment(nextAppointment.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                >
                  إلغاء الموعد
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              لا توجد لديك مواعيد قادمة مسجلة حالياً
            </div>
          )}
        </div>

        {/* Active Medications (Col-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>الأدوية الحالية</span>
            </h3>
            <button
              onClick={() => navigate('/patient/prescriptions')}
              className="text-xs text-emerald-600 hover:underline"
            >
              الروشتة
            </button>
          </div>

          <div className="space-y-2">
            {latestPrescription && latestPrescription.medications.length > 0 ? (
              latestPrescription.medications.slice(0, 3).map((med) => (
                <div key={med.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-[11px] text-slate-500">{med.frequency}</p>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                    {med.dosage}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-400">لا توجد أدوية مسجلة</p>
            )}
          </div>
        </div>

      </div>

      {/* Ticket Modal */}
      {selectedTicketApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center border border-slate-200 space-y-4">
            <h4 className="font-bold text-base text-slate-900">تذكرة العيادة</h4>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 inline-block">
              <div className="w-32 h-32 bg-white p-2 border border-slate-200 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <span className="font-mono text-xs font-bold text-brand-700 mt-2 block">
                {selectedTicketApt.bookingReference}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg text-right">
              <p><strong>الطبيب:</strong> {selectedTicketApt.doctorName}</p>
              <p><strong>الموعد:</strong> {selectedTicketApt.date} ({selectedTicketApt.time})</p>
              <p><strong>العيادة:</strong> {selectedTicketApt.roomNumber}</p>
            </div>

            <button
              onClick={() => setSelectedTicketApt(null)}
              className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
