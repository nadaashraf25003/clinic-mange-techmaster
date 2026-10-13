import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  X, 
  Printer, 
  Pill, 
  Calendar, 
  User, 
  Sparkles,
  FileCheck,
  RefreshCw,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useDoctorAuth } from '../../Hooks/useDoctorAuth';
import { PatientAppointment, Prescription } from '../../utils/types';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentDoctor, 
    appointments, 
    prescriptions, 
    queue, 
    finances, 
    loading, 
    refreshDoctorData, 
    toggleAppointmentStatus 
  } = useDoctorAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'has_rx'>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<{ rx: Prescription; patientName: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDoctorData();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Filter appointments for the current doctor (or show all if not scoped)
  const doctorAppointments = appointments.filter(
    apt => !apt.doctorId || apt.doctorId === currentDoctor.id
  );

  // Helper to find prescription for a given appointment
  const getPrescriptionForAppointment = (apt: PatientAppointment): Prescription | undefined => {
    return prescriptions.find(
      rx => (apt.prescriptionId && rx.id === apt.prescriptionId) || 
            (rx.appointmentId && rx.appointmentId === apt.id)
    );
  };

  // Filter appointments according to search and status
  const filteredAppointments = doctorAppointments.filter(apt => {
    const pName = apt.patientName || 'مريض مسجل';
    const notes = apt.notes || '';
    const matchesSearch = pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notes.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const rx = getPrescriptionForAppointment(apt);

    if (activeFilter === 'upcoming') return apt.status === 'upcoming';
    if (activeFilter === 'completed') return apt.status === 'completed';
    if (activeFilter === 'has_rx') return !!rx;
    return true;
  });

  // Counts for tabs
  const upcomingCount = doctorAppointments.filter(a => a.status === 'upcoming').length;
  const completedCount = doctorAppointments.filter(a => a.status === 'completed').length;
  const withRxCount = doctorAppointments.filter(a => !!getPrescriptionForAppointment(a)).length;
  const todayEarnings = finances?.todayEarnings 
    ?? finances?.dailyEarnings?.[0]?.amount 
    ?? (completedCount * (currentDoctor.consultationFee || 400) * 0.8);

  return (
    <div className="space-y-5 text-right">
      
      {/* Simple Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              عيادة {currentDoctor.name} ({currentDoctor.departmentName})
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              متصل بالخادم
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            إجمالي الحالات المسجلة بالعيادة: {doctorAppointments.length} مريض • قائمة الانتظار: {queue.length > 0 ? queue.length : upcomingCount}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="تحديث البيانات من الخادم"
          >
            <RefreshCw className={`w-4 h-4 ${loading || isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          <button
            onClick={() => navigate('/doctor/consultation')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>كتابة روشتة جديدة</span>
          </button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">إجمالي كشوفات اليوم</span>
            <span className="text-lg font-bold text-slate-900 font-mono">{doctorAppointments.length}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">بانتظار الكشف</span>
            <span className="text-lg font-bold text-amber-600 font-mono">{upcomingCount}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">تم الكشف</span>
            <span className="text-lg font-bold text-emerald-600 font-mono">{completedCount}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">أرباح اليوم التقديرية</span>
            <span className="text-lg font-bold text-blue-600 font-mono">{Math.round(todayEarnings)} ج.م</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>الكل</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {doctorAppointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'upcoming'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>بانتظار الكشف</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeFilter === 'upcoming' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {upcomingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>تم الكشف</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeFilter === 'completed' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('has_rx')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'has_rx'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>الروشتات المكتوبة</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeFilter === 'has_rx' ? 'bg-teal-800 text-white' : 'bg-teal-100 text-teal-800'
            }`}>
              {withRxCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم المريض أو الملاحظات..."
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:bg-white transition-all text-right"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800">
            قائمة المرضى والكشوفات ({filteredAppointments.length})
          </span>
          <span className="text-xs text-slate-400">اليوم</span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p>لا توجد كشوفات مسجلة تطابق خيارات البحث والفلترة المحددة.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((apt, index) => {
              const rx = getPrescriptionForAppointment(apt);
              const patientName = apt.patientName || 'مريض مسجل';

              return (
                <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{patientName}</h4>
                        {rx && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            <FileCheck className="w-3 h-3" />
                            <span>روشتة جاهزة</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{apt.notes || 'كشف استشاري ومتابعة'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs">
                    <span className="text-slate-500 font-mono text-xs">{apt.time || '06:00 م'}</span>

                    {/* Status Toggle Button */}
                    <button
                      onClick={() => toggleAppointmentStatus(apt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                        apt.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {apt.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>تم الكشف</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>بانتظار الكشف</span>
                        </>
                      )}
                    </button>

                    {/* Prescription Button: Show existing prescription or write new */}
                    {rx ? (
                      <button
                        onClick={() => setSelectedPrescription({ rx, patientName })}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-700" />
                        <span>عرض الروشتة</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/doctor/consultation?appointmentId=${apt.id}&patient=${encodeURIComponent(patientName)}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>كتابة روشتة</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prescription Preview Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                  Rx
                </div>
                <div>
                  <h3 className="font-bold text-sm">الروشتة الطبية المعتمدة</h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    رقم الوصفة: {selectedPrescription.rx.prescriptionNumber || selectedPrescription.rx.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs text-right max-h-[75vh] overflow-y-auto">
              
              {/* Doctor & Patient Info Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">اسم المريض</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedPrescription.patientName}</span>
                </div>
                <div className="text-left">
                  <span className="text-slate-400 block text-[10px]">تاريخ الكشف والتحرير</span>
                  <span className="font-medium text-slate-700 font-mono">{selectedPrescription.rx.date}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
                <span className="text-emerald-800 font-bold block text-xs mb-0.5">التشخيص الطبي للحالة:</span>
                <p className="text-emerald-950 font-semibold text-xs leading-relaxed">
                  {selectedPrescription.rx.diagnosis || 'فحص روتيني ومتابعة'}
                </p>
              </div>

              {/* Medications List */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <Pill className="w-3.5 h-3.5 text-brand-600" />
                  <span>الأدوية والجرعات المقررة:</span>
                </div>

                <div className="space-y-2">
                  {selectedPrescription.rx.medications && selectedPrescription.rx.medications.length > 0 ? (
                    selectedPrescription.rx.medications.map((med, i) => (
                      <div key={med.id || i} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{med.name}</span>
                          <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                            {med.dosage}
                          </span>
                        </div>
                        {med.frequency && (
                          <div className="text-slate-500 text-[11px]">
                            التكرار: <span className="text-slate-700 font-medium">{med.frequency}</span>
                            {med.duration && <span> ({med.duration})</span>}
                          </div>
                        )}
                        {med.instructions && (
                          <div className="text-slate-600 text-[11px] bg-slate-50 p-1.5 rounded-lg mt-1">
                            ℹ️ {med.instructions}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                      لم تسجل أدوية تفصيلية.
                    </div>
                  )}
                </div>
              </div>

              {/* Notes / Advice */}
              {selectedPrescription.rx.notes && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-900 text-xs block">تعليمات وتوصيات الطبيب:</span>
                  <p className="text-amber-950 text-xs leading-relaxed">{selectedPrescription.rx.notes}</p>
                </div>
              )}

              {/* Doctor Stamp Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
                <div>
                  <p className="font-bold text-slate-800">{selectedPrescription.rx.doctorName || currentDoctor.name}</p>
                  <p className="text-[10px] text-slate-400">{selectedPrescription.rx.doctorSpecialty || currentDoctor.title}</p>
                </div>
                <div className="text-left">
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-mono rounded border border-slate-200">
                    CareSync Verified
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الروشتة</span>
              </button>

              <button
                onClick={() => setSelectedPrescription(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
