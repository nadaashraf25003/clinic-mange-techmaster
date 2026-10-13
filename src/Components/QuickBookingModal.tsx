import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { DEPARTMENTS, FEATURED_DOCTORS } from '../utils/constants';
import { useBooking } from '../Hooks/useBooking';
import { usePatientAuth } from '../Hooks/usePatientAuth';
import { AppointmentBookingRequest } from '../utils/types';
import { formatCurrency } from '../utils/formatters';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorId?: string;
  initialDoctorName?: string;
  initialDepartmentId?: string;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  initialDoctorId,
  initialDoctorName,
  initialDepartmentId
}) => {
  const [departmentId, setDepartmentId] = useState<string>(initialDepartmentId || DEPARTMENTS[0]?.id || '');
  const [doctorId, setDoctorId] = useState<string>(initialDoctorId || '');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('17:00');
  const [patientName, setPatientName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const { bookAppointment, submitting, bookingResult, bookingError, resetBooking } = useBooking();

  // Filter doctors based on selected department
  const availableDoctors = FEATURED_DOCTORS.filter(
    (doc) => !departmentId || doc.departmentId === departmentId
  );

  const selectedDoctor = FEATURED_DOCTORS.find((d) => d.id === doctorId);

  useEffect(() => {
    if (initialDepartmentId) {
      setDepartmentId(initialDepartmentId);
    }
    if (initialDoctorId) {
      setDoctorId(initialDoctorId);
      const found = FEATURED_DOCTORS.find(d => d.id === initialDoctorId);
      if (found) {
        setDepartmentId(found.departmentId);
      }
    } else if (initialDoctorName) {
      const found = FEATURED_DOCTORS.find(d => d.name.includes(initialDoctorName) || initialDoctorName.includes(d.name));
      if (found) {
        setDoctorId(found.id);
        setDepartmentId(found.departmentId);
      }
    }
  }, [initialDepartmentId, initialDoctorId, initialDoctorName, isOpen]);

  // Set default appointment date to tomorrow
  useEffect(() => {
    if (!appointmentDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setAppointmentDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [appointmentDate]);

  if (!isOpen) return null;

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!patientName.trim()) errors.patientName = 'يرجى إدخال اسم المريض كاملاً';
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'يرجى إدخال رقم الهاتف';
    } else if (!/^[0-9+ ]{10,15}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'يرجى إدخال رقم هاتف صحيح (11 رقم)';
    }
    if (!departmentId) errors.departmentId = 'يرجى اختيار القسم الطبي';
    if (!appointmentDate) errors.appointmentDate = 'يرجى تحديد تاريخ الكشف';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { addAppointment } = usePatientAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const doc = selectedDoctor || availableDoctors[0] || FEATURED_DOCTORS[0];
    const dept = DEPARTMENTS.find(d => d.id === departmentId) || DEPARTMENTS[0];

    const payload: AppointmentBookingRequest = {
      patientName,
      phoneNumber,
      departmentId,
      doctorId: doc.id,
      appointmentDate,
      appointmentTime,
      notes,
    };

    const isSuccess = await bookAppointment(payload);
    if (isSuccess) {
      addAppointment({
        doctorId: doc.id,
        doctorName: doc.name,
        doctorSpecialty: doc.title,
        doctorImage: doc.imageUrl,
        departmentName: dept.name,
        departmentId: dept.id,
        date: appointmentDate,
        time: appointmentTime === '10:00' ? '10:00 ص' : appointmentTime === '14:00' ? '02:00 م' : '06:00 م',
        roomNumber: `عيادة ${Math.floor(100 + Math.random() * 300)} - الدور الأول`,
        consultationFee: doc.consultationFee,
        paymentStatus: 'pending',
        notes: notes || 'حجز عبر البوابة الإلكترونية'
      });
    }
  };

  const handleModalClose = () => {
    resetBooking();
    setFormErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-cyan-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">حجز موعد استشاري</h3>
              <p className="text-xs text-brand-100">تأكيد فوري بدون فترات انتظار</p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {bookingResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">تم تسجيل طلب الحجز بنجاح!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {bookingResult.message}
              </p>

              {bookingResult.bookingReference && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 inline-block my-2">
                  <span className="text-xs text-slate-500 block">رقم مرجع الحجز:</span>
                  <span className="font-mono font-bold text-lg text-brand-700 tracking-wider">
                    {bookingResult.bookingReference}
                  </span>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleModalClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                  حسناً، فهمت
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {bookingError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Patient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brand-600" />
                    <span>اسم المريض بالكامل *</span>
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: محمد أحمد علي"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.patientName 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50/30' 
                        : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100 bg-slate-50/50'
                    }`}
                  />
                  {formErrors.patientName && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.patientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-brand-600" />
                    <span>رقم الهاتف المحمول *</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-right focus:outline-none focus:ring-2 transition-all ${
                      formErrors.phoneNumber 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50/30' 
                        : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100 bg-slate-50/50'
                    }`}
                  />
                  {formErrors.phoneNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Department & Doctor Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-brand-600" />
                    <span>العيادة / التخصص الطبي *</span>
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => {
                      setDepartmentId(e.target.value);
                      setDoctorId('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brand-600" />
                    <span>الطبيب المعالج</span>
                  </label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                  >
                    <option value="">أي طبيب متاح في هذا القسم</option>
                    {availableDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - ({doc.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctor Quick Badge Preview */}
              {selectedDoctor && (
                <div className="bg-brand-50/60 border border-brand-100 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={selectedDoctor.imageUrl} 
                      alt={selectedDoctor.name} 
                      className="w-9 h-9 rounded-full object-cover border border-brand-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{selectedDoctor.name}</p>
                      <p className="text-slate-500">{selectedDoctor.title}</p>
                    </div>
                  </div>
                  <div className="text-left font-semibold text-brand-800">
                    <span>قيمة الكشف: </span>
                    <span className="font-bold text-emerald-600">{formatCurrency(selectedDoctor.consultationFee)}</span>
                  </div>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>تاريخ الحجز المفضل *</span>
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>الفترة المناسبة</span>
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                  >
                    <option value="10:00">الفترة الصباحية (10:00 ص - 1:00 م)</option>
                    <option value="14:00">فترة الظهيرة (02:00 م - 5:00 م)</option>
                    <option value="17:00">الفترة المسائية (05:00 م - 9:00 م)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ملاحظات أو أعراض ترغب في ذكرها (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: استشارة بعد عملية، كشف لأول مرة، حساسية سابقة..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري إرسال طلب الحجز...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>تأكيد حجز الموعد الآن</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
