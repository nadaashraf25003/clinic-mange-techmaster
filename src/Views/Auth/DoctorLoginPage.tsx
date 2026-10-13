import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  UserCheck,
  Building2,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Key
} from 'lucide-react';
import { useDoctorAuth } from '../../Hooks/useDoctorAuth';
import { FEATURED_DOCTORS } from '../../utils/constants';
import { Doctor } from '../../utils/types';

export const DoctorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginDoctor, allDoctors } = useDoctorAuth();
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('doctor123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeDoctorsList = allDoctors.length > 0 ? allDoctors : FEATURED_DOCTORS;

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setEmailOrPhone(doc.email || doc.phone || doc.id);
    setPassword('doctor123');
    setError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const identifier = selectedDoctor ? (selectedDoctor.email || selectedDoctor.id) : emailOrPhone;

    if (!identifier.trim()) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
      return;
    }

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginDoctor(identifier, password);
      navigate('/doctor/dashboard');
    } catch (err: any) {
      setError(err?.message || 'بيانات الدخول أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 text-right" dir="rtl">
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/2 translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base">بوابة الأطباء والاستشاريين</h2>
              <p className="text-xs text-slate-400">CareSync Doctors & Consultants Portal</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>الموقع</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {!selectedDoctor ? (
            /* Step 1: Select Doctor from List or enter credentials */
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">اختر حسابك الطبي للدخول:</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  حدد اسمك للانتقال إلى كتابة كلمة المرور وتسجيل الدخول المباشر.
                </p>
              </div>

              {/* Doctors List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-0.5">
                {activeDoctorsList.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoctor(doc)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">{doc.departmentName} • {doc.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{doc.email}</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-brand-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors shrink-0">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Step 2: Enter Password for Selected Doctor */
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">تأكيد كلمة مرور الطبيب</h3>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-0.5"
                >
                  <span>تغيير الطبيب</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Selected Doctor Preview */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3.5">
                <img
                  src={selectedDoctor.imageUrl}
                  alt={selectedDoctor.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-300 shadow-2xs"
                />
                <div>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                    {selectedDoctor.departmentName}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedDoctor.name}</h4>
                  <p className="text-slate-500 text-[11px] font-mono">{selectedDoctor.email}</p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    كلمة المرور (Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="اكتب كلمة المرور..."
                      className="w-full p-3 pl-10 pr-10 rounded-xl border border-slate-200 outline-none text-right font-mono text-sm focus:border-brand-500 focus:bg-white"
                      autoFocus
                      required
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="p-2.5 bg-brand-50/70 border border-brand-100 rounded-xl mt-2 text-[11px] text-brand-900">
                    💡 كلمة المرور الافتراضية لجميع الأطباء: <strong className="font-mono font-bold">doctor123</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span>جاري التحقق من كلمة المرور...</span>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 text-brand-400" />
                      <span>تسجيل الدخول إلى العيادة</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
            <span>نظام إدارة العيادات الذكية CareSync</span>
            <span className="text-brand-600 font-medium">بوابة الاستشاريين 2026</span>
          </div>

        </div>

      </div>

    </div>
  );
};
