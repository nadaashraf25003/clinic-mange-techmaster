import React, { useState } from 'react';
import { 
  CalendarDays, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  Plus, 
  User, 
  Stethoscope, 
  X, 
  Save,
  Phone,
  CreditCard
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';
import { DEPARTMENTS } from '../../utils/constants';

export const AdminAppointments: React.FC = () => {
  const { appointments, doctors, updateAppointmentStatus, deleteAppointment, addManualAppointment } = useAdminAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Manual Appointment Form State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newDoctorId, setNewDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [newTime, setNewTime] = useState('06:00 م');
  const [newNotes, setNewNotes] = useState('حجز إداري مباشر');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = (apt.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (apt.bookingReference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (apt.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (selectedDoctorId !== 'all' && apt.doctorId !== selectedDoctorId) return false;

    return true;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) {
      alert('يرجى إدخال اسم المريض');
      return;
    }

    const doc = doctors.find(d => d.id === newDoctorId) || doctors[0];

    addManualAppointment({
      patientName: newPatientName,
      patientPhone: newPatientPhone || '01000000000',
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.title,
      doctorImage: doc.imageUrl,
      departmentName: doc.departmentName,
      departmentId: doc.departmentId,
      consultationFee: doc.consultationFee,
      time: newTime,
      notes: newNotes,
    });

    setIsAddModalOpen(false);
    setNewPatientName('');
    setNewPatientPhone('');
  };

  return (
    <div className="space-y-5 text-right">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">سجل المواعيد والكشوفات المركزية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            إدارة كافة الحجوزات، تغيير الحالات، ومتابعة قائمة الانتظار لجميع العيادات.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل حجز يدوي مباشر</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            الكل ({appointments.length})
          </button>

          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'upcoming'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            بانتظار الكشف ({appointments.filter(a => a.status === 'upcoming').length})
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            تم الكشف ({appointments.filter(a => a.status === 'completed').length})
          </button>

          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            ملغي ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {/* Doctor selector & search */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="p-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none text-right font-medium"
          >
            <option value="all">جميع الأطباء</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.departmentName})</option>
            ))}
          </select>

          <div className="relative flex-1 lg:w-56">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالمريض أو الكود..."
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Appointments Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800">
            نتائج الحجوزات المفلترة ({filteredAppointments.length})
          </span>
          <span className="text-xs text-slate-400">تحديث دوري ومباشر</span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            لا توجد حجوزات تطابق معايير البحث والفلترة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">المريض وبيانات الاتصال</th>
                  <th className="p-3">الطبيب المعالج</th>
                  <th className="p-3">العيادة / الغرفة</th>
                  <th className="p-3">الموعد والتوقيت</th>
                  <th className="p-3">الرسوم والدفع</th>
                  <th className="p-3 text-center">حالة الكشف</th>
                  <th className="p-3 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt, index) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold text-slate-400 text-[11px]">
                      {index + 1}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{apt.patientName || 'مريض مجهول'}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5" />
                        <span>{apt.patientPhone || '01012345678'}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-800 text-xs">{apt.doctorName}</div>
                      <div className="text-[10px] text-slate-400">{apt.doctorSpecialty}</div>
                    </td>

                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {apt.departmentName}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{apt.roomNumber || 'عيادة 201'}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs font-mono">{apt.time}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{apt.date}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{apt.consultationFee} ج.م</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        {apt.paymentStatus === 'insurance_covered' ? 'تأمين طبي' : 'مسدد بالكامل'}
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const nextStatus = apt.status === 'completed' ? 'upcoming' : 'completed';
                          updateAppointmentStatus(apt.id, nextStatus);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center gap-1 ${
                          apt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {apt.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {apt.status === 'upcoming' && <Clock className="w-3 h-3 text-amber-600" />}
                        {apt.status === 'cancelled' && <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>
                          {apt.status === 'completed' ? 'تم الكشف' : apt.status === 'cancelled' ? 'ملغي' : 'بانتظار الكشف'}
                        </span>
                      </button>
                    </td>

                    <td className="p-3 text-left">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="إلغاء الموعد"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-right">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm">تسجيل حجز موعد مباشر</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم المريض *</label>
                <input
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="مثال: ياسمين عبد العزيز"
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رقم الهاتف المحمول</label>
                <input
                  type="tel"
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الطبيب والعيادة *</label>
                <select
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.departmentName}) - {d.consultationFee} ج.م</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">التوقيت المقترح</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="06:00 م"
                    className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ملاحظات الحجز</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>تأكيد الحجز</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
