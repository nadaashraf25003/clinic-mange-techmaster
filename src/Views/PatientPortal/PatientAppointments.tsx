import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CalendarPlus, 
  CheckCircle2, 
  QrCode, 
  FileText,
  X
} from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';
import { FEATURED_DOCTORS, DEPARTMENTS } from '../../utils/constants';
import { PatientAppointment } from '../../utils/types';

export const PatientAppointments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    appointments, 
    addAppointment, 
    cancelAppointment, 
    rescheduleAppointment 
  } = usePatientAuth();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<PatientAppointment | null>(null);
  const [ticketApt, setTicketApt] = useState<PatientAppointment | null>(null);

  // Reschedule state
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('06:30 م');

  // New Booking state
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0].id);
  const [selectedDocId, setSelectedDocId] = useState(FEATURED_DOCTORS[0].id);
  const [bookingDate, setBookingDate] = useState('2026-09-22');
  const [bookingTime, setBookingTime] = useState('06:00 م');
  const [bookingNotes, setBookingNotes] = useState('');

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsNewBookingModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filteredAppointments = appointments.filter(a => a.status === activeTab);
  const availableDoctors = FEATURED_DOCTORS.filter(d => !selectedDept || d.departmentId === selectedDept);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = FEATURED_DOCTORS.find(d => d.id === selectedDocId) || FEATURED_DOCTORS[0];
    const dept = DEPARTMENTS.find(d => d.id === selectedDept) || DEPARTMENTS[0];

    addAppointment({
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.title,
      doctorImage: doc.imageUrl,
      departmentName: dept.name,
      departmentId: dept.id,
      date: bookingDate,
      time: bookingTime,
      roomNumber: `عيادة ${Math.floor(100 + Math.random() * 300)}`,
      consultationFee: doc.consultationFee,
      paymentStatus: 'pending',
      notes: bookingNotes || 'كشف ومتابعة صحية',
    });

    setIsNewBookingModalOpen(false);
    setActiveTab('upcoming');
    setBookingNotes('');
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleApt || !newDate) return;
    rescheduleAppointment(rescheduleApt.id, newDate, newTime);
    setRescheduleApt(null);
  };

  return (
    <div className="space-y-5 text-right max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">مواعيدي الطبية</h2>
          <p className="text-xs text-slate-500">إدارة ومتابعة كشوفاتك في عيادات كير سينك</p>
        </div>

        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>حجز موعد كشف</span>
        </button>
      </div>

      {/* Clean Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          المواعيد القادمة ({appointments.filter(a => a.status === 'upcoming').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'completed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الزيارات المكتملة ({appointments.filter(a => a.status === 'completed').length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'cancelled'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الملغاة ({appointments.filter(a => a.status === 'cancelled').length})
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400 text-xs">
            لا توجد مواعيد في هذا القسم حالياً
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={apt.doctorImage}
                    alt={apt.doctorName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{apt.doctorName}</h3>
                    <p className="text-xs text-slate-500">{apt.departmentName} • {apt.doctorSpecialty}</p>
                  </div>
                </div>

                <div className="text-left font-mono text-xs text-slate-600">
                  <span className="text-[10px] text-slate-400 block">رقم الحجز</span>
                  <strong>{apt.bookingReference}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">تاريخ الكشف</span>
                  <span className="font-semibold text-slate-800">{apt.date}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">وقت الموعد</span>
                  <span className="font-semibold text-slate-800">{apt.time}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">العيادة</span>
                  <span className="font-semibold text-slate-800 truncate block">{apt.roomNumber}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">قيمة الكشف</span>
                  <span className="font-semibold text-slate-800">{apt.consultationFee} ج.م</span>
                </div>
              </div>

              {apt.diagnosisSummary && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <strong>التشخيص:</strong> {apt.diagnosisSummary}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={() => setTicketApt(apt)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>تذكرة العيادة</span>
                </button>

                {apt.status === 'upcoming' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRescheduleApt(apt);
                        setNewDate(apt.date);
                        setNewTime(apt.time);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('هل ترغب في إلغاء الحجز؟')) {
                          cancelAppointment(apt.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Booking Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">حجز موعد كشف</h3>
              <button onClick={() => setIsNewBookingModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">القسم الطبي</label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    const matchingDocs = FEATURED_DOCTORS.filter(d => d.departmentId === e.target.value);
                    if (matchingDocs.length > 0) setSelectedDocId(matchingDocs[0].id);
                  }}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الطبيب</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  {availableDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.consultationFee} ج.م)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min="2026-09-07"
                    className="w-full p-2 text-xs rounded-lg border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الوقت</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="05:00 م">05:00 م</option>
                    <option value="06:00 م">06:00 م</option>
                    <option value="07:00 م">07:00 م</option>
                    <option value="08:00 م">08:00 م</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold"
                >
                  تأكيد الحجز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 text-right space-y-4">
            <h4 className="font-bold text-sm text-slate-900">تعديل موعد {rescheduleApt.doctorName}</h4>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">التاريخ الجديد</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min="2026-09-07"
                  className="w-full p-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الوقت الجديد</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="05:00 م">05:00 م</option>
                  <option value="06:00 م">06:00 م</option>
                  <option value="07:00 م">07:00 م</option>
                  <option value="08:00 م">08:00 م</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                تراجع
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg"
              >
                حفظ التعديل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {ticketApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900">تذكرة العيادة</h4>
            <div className="w-28 h-28 bg-white border border-slate-200 rounded-lg mx-auto flex items-center justify-center">
              <QrCode className="w-20 h-20 text-slate-800" />
            </div>
            <p className="font-mono text-xs font-bold text-brand-700">{ticketApt.bookingReference}</p>
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg text-right space-y-1">
              <p><strong>الطبيب:</strong> {ticketApt.doctorName}</p>
              <p><strong>الموعد:</strong> {ticketApt.date} ({ticketApt.time})</p>
              <p><strong>العيادة:</strong> {ticketApt.roomNumber}</p>
            </div>
            <button
              onClick={() => setTicketApt(null)}
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
