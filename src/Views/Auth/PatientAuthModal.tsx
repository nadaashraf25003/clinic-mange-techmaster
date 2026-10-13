import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  User, 
  Phone, 
  Mail,
  Lock, 
  ArrowLeft, 
  ShieldCheck, 
  HeartPulse,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';
import { authService, PatientCheckResult } from '../../API';

interface PatientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const PatientAuthModal: React.FC<PatientAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login'
}) => {
  const navigate = useNavigate();
  const { login, loginDemo, register } = usePatientAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  
  // Login form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form states
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAge, setRegAge] = useState<number>(30);
  const [regGender, setRegGender] = useState<'male' | 'female'>('male');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [existingAccount, setExistingAccount] = useState<PatientCheckResult | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Real-time check if account exists by phone or email
  const checkAccount = async (identifier: string) => {
    if (!identifier || identifier.trim().length < 4) {
      setExistingAccount(null);
      return;
    }

    setChecking(true);
    try {
      const result = await authService.checkPatientExists(identifier.trim());
      if (result.exists) {
        setExistingAccount(result);
      } else {
        setExistingAccount(null);
      }
    } catch {
      setExistingAccount(null);
    } finally {
      setChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginIdentifier.trim()) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
      return;
    }
    if (!loginPassword.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }
    setLoading(true);
    try {
      await login(loginIdentifier.trim(), loginPassword.trim());
      onClose();
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err?.message || 'بيانات تسجيل الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!regFullName.trim()) {
      setError('يرجى إدخال الاسم بالكامل');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!regPhone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    if (!regPassword.trim() || regPassword.length < 4) {
      setError('كلمة المرور يجب أن لا تقل عن 4 رموز');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('كلمتا المرور غير متطابقتين، يرجى إعادة التأكد');
      return;
    }

    setLoading(true);

    try {
      // 1. Check phone or email duplication first
      const checkEmail = await authService.checkPatientExists(regEmail.trim());
      if (checkEmail.exists) {
        setExistingAccount(checkEmail);
        setError(`يوجد حساب مسجل مسبقاً بالبريد الإلكتروني (${regEmail}). يمكنك تسجيل الدخول مباشرة.`);
        setLoading(false);
        return;
      }

      const checkPhone = await authService.checkPatientExists(regPhone.trim());
      if (checkPhone.exists) {
        setExistingAccount(checkPhone);
        setError(`يوجد حساب مسجل مسبقاً برقم الهاتف (${regPhone}). يمكنك تسجيل الدخول مباشرة.`);
        setLoading(false);
        return;
      }

      // 2. Submit clean registration
      await register({
        name: regFullName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        age: Number(regAge) || 30,
        gender: regGender,
      });

      onClose();
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err?.message || 'تعذر إنشاء الحساب، يرجى التأكد من صحة البيانات والمحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    onClose();
    navigate('/patient/dashboard');
  };

  const handleSwitchToLoginWithExisting = () => {
    setMode('login');
    if (existingAccount?.phone || existingAccount?.email) {
      setLoginIdentifier(existingAccount.phone || existingAccount.email || '');
    }
    setError('');
    setExistingAccount(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden text-right">
        
        {/* Simple Clean Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {mode === 'login' ? 'تسجيل دخول المريض' : 'إنشاء حساب مريض جديد'}
              </h3>
              <p className="text-xs text-slate-500">منظومة كير سينك للرعاية الطبية الذكية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Button */}
        <div className="px-6 pt-4">
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-brand-200/60"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>تجربة النظام فوراً (دخول تجريبي سريع)</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 pt-4 max-h-[75vh] overflow-y-auto">
          
          {/* Detected Existing Account Banner */}
          {mode === 'register' && existingAccount?.exists && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">يوجد حساب مسجل مسبقاً بهذه البيانات!</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    الاسم المسجل: <span className="font-bold">{existingAccount.name || 'مريض مسجل'}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleSwitchToLoginWithExisting}
                    className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>الانتقال لتسجيل الدخول فوراً</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && !existingAccount && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم الهاتف أو البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      setError('');
                    }}
                    placeholder="010XXXXXXXX أو example@mail.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-right"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    كلمة المرور / رمز PIN
                  </label>
                  <span className="text-[10px] text-slate-400">الافتراضي: 1234</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors mt-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? 'جاري التحقق والدخول...' : 'تسجيل الدخول'}
              </button>

              <div className="pt-3 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { 
                    setMode('register'); 
                    setError(''); 
                    setExistingAccount(null); 
                  }}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  ليس لديك حساب بعد؟ إنشاء حساب مريض جديد
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister} className="space-y-3">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم بالكامل *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد علي"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-right"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* 2. Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">البريد الإلكتروني *</label>
                  {checking && (
                    <span className="text-[10px] text-brand-600 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>جاري التحقق...</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      setError('');
                    }}
                    onBlur={(e) => checkAccount(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-right"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* 3. Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف المحمول *</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => {
                      setRegPhone(e.target.value);
                      setError('');
                    }}
                    onBlur={(e) => checkAccount(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-right"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* 4. Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="أدخل 4 أحرف أو أرقام على الأقل"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-right"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 5. Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-right"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 6. Age & Gender */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">العمر</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="w-full px-3 py-1.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">النوع</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-1.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-right bg-white"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || checking}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors mt-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? 'جاري إنشاء الحساب...' : 'تأكيد وإنشاء الحساب'}
              </button>

              <div className="pt-3 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { 
                    setMode('login'); 
                    setError(''); 
                    setExistingAccount(null); 
                  }}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  لديك حساب بالفعل؟ تسجيل الدخول
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
