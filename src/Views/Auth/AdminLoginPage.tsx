import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Key
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminProfile, loginAdmin } = useAdminAuth();
  
  const [emailOrUsername, setEmailOrUsername] = useState('admin@caresync.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrUsername.trim()) {
      setError('يرجى إدخال اسم المستخدم أو البريد الإلكتروني');
      return;
    }

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const success = await loginAdmin(emailOrUsername, password);
      if (success) {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base">بوابة الإدارة المركزية</h2>
              <p className="text-xs text-slate-400">CareSync Medical Administration</p>
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
        <div className="p-6 space-y-5 text-xs">
          
          {/* Admin Profile Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3.5">
            <img
              src={adminProfile.avatarUrl}
              alt={adminProfile.name}
              className="w-13 h-13 rounded-2xl object-cover border border-slate-300 shadow-2xs"
            />
            <div>
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                مشرف النظام المعتمد
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-1">{adminProfile.name}</h3>
              <p className="text-slate-500 text-[11px] font-mono">{adminProfile.email}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                اسم المستخدم / البريد الإلكتروني *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="admin@caresync.com"
                  className="w-full p-3 pl-10 pr-10 rounded-xl border border-slate-200 outline-none text-right font-mono text-xs focus:border-brand-500 focus:bg-white text-slate-900 font-semibold"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

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
                  className="w-full p-3 pl-10 pr-10 rounded-xl border border-slate-200 outline-none text-right font-mono text-sm focus:border-brand-500 focus:bg-white text-slate-900"
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
              <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                <span>بيانات دخول المشرف الافتراضية:</span>
                <span className="font-mono font-bold text-slate-900">admin@caresync.com / admin123</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>جاري التحقق والدخول...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>تسجيل الدخول إلى لوحة الإدارة</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
            <span>صلاحيات النظام الطبي الموحد</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>اتصال آمن ومحمي</span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
