import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Building2, 
  UserCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { adminProfile } = useAdminAuth();
  const [pin, setPin] = useState('1234');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      navigate('/admin/dashboard');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right">
        
        {/* Header */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">بوابة الإدارة المركزية</h3>
              <p className="text-xs text-slate-300">نظام الإشراف الطبي والإداري CareSync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Admin Identity Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <img
              src={adminProfile.avatarUrl}
              alt={adminProfile.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-300"
            />
            <div>
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                مشرف النظام المعتمد
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">{adminProfile.name}</h4>
              <p className="text-slate-500 text-[11px]">{adminProfile.role} • {adminProfile.email}</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                رمز المرور الإداري السريع (PIN)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-center font-mono font-bold text-slate-900 text-sm tracking-widest focus:border-brand-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">الرمز التجريبي الافتراضي: 1234</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>جاري الدخول للوحة الإدارة...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>تسجيل الدخول كمدير للنظام</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
            <span>صلاحيات كاملة: الأطباء، الحجوزات، والمالية</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>خادم آمن ومحمي</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
