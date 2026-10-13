import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Save, 
  ArrowLeft,
  Pill,
  User,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useDoctorAuth } from '../../Hooks/useDoctorAuth';

export const DoctorConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentDoctor, appointments, addPrescription } = useDoctorAuth();

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(searchParams.get('appointmentId') || '');
  const [patientName, setPatientName] = useState<string>(searchParams.get('patient') || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Doctor's active appointments
  const doctorAppointments = appointments.filter(
    apt => !apt.doctorId || apt.doctorId === currentDoctor.id
  );

  useEffect(() => {
    const p = searchParams.get('patient');
    if (p) setPatientName(p);

    const aptId = searchParams.get('appointmentId');
    if (aptId) {
      setSelectedAppointmentId(aptId);
      const found = doctorAppointments.find(a => a.id === aptId);
      if (found && found.patientName) {
        setPatientName(found.patientName);
      }
    }
  }, [searchParams, doctorAppointments]);

  const handleSelectAppointment = (aptId: string) => {
    setSelectedAppointmentId(aptId);
    if (!aptId) return;
    const found = doctorAppointments.find(a => a.id === aptId);
    if (found && found.patientName) {
      setPatientName(found.patientName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!patientName.trim()) {
      setErrorMessage('يرجى تحديد أو كتابة اسم المريض');
      return;
    }
    if (!diagnosis.trim() || !medicines.trim()) {
      setErrorMessage('يرجى كتابة التشخيص الطبي والأدوية الموصوفة');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPrescription({
        appointmentId: selectedAppointmentId || undefined,
        patientName,
        diagnosis,
        medicines,
        notes,
      });

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        navigate('/doctor/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'تعذر حفظ الروشتة في الخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 text-right max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">كتابة روشتة طبية معتمدة</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
              Rx إلكتروني
            </span>
          </div>
          <p className="text-xs text-slate-500">الطبيب المعالج: {currentDoctor.name} ({currentDoctor.departmentName})</p>
        </div>

        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>العودة للمواعيد</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ الروشتة بنجاح وربطها بملف المريض وتحديث حالة الكشف إلى "تم الكشف"!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs shadow-2xs">
        
        {/* Select Appointment (Optional if not opened from specific appointment) */}
        {doctorAppointments.length > 0 && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ربط بموعد كشف من قائمة اليوم (اختياري)
            </label>
            <select
              value={selectedAppointmentId}
              onChange={(e) => handleSelectAppointment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none text-right focus:border-brand-500 focus:bg-white"
            >
              <option value="">-- كشف مباشر أو مريض جديد --</option>
              {doctorAppointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.patientName || 'مريض مسجل'} ({apt.time || '06:00 م'}) - {apt.notes || 'كشف استشاري'}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1">اسم المريض *</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="اكتب اسم المريض الرباعي..."
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-right font-bold text-slate-900 focus:border-brand-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">التشخيص الطبي للحالة *</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="مثال: فحص روتيني / ضغط دم أولي مستقر / التهاب معوي حاد..."
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-right focus:border-brand-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">الأدوية والجرعات المقررة *</label>
          <textarea
            rows={3}
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder="مثال: كونكور 5 مجم (قرص صباحاً بعد الإفطار) + بنادول إكسترا عند اللزوم..."
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-right resize-none focus:border-brand-500 font-sans"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">تعليمات وتوصيات إضافية للمريض</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثال: الراحة التامة لمدة يومين مع تجنب الموالح والسكريات وإعادة الفحص بعد أسبوع..."
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-right resize-none focus:border-brand-500 font-sans"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSubmitting ? 'جارِ اعتماد الروشتة...' : 'اعتماد وحفظ الروشتة للمريض'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
