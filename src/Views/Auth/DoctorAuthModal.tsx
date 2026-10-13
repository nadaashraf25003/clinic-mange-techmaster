import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Stethoscope, 
  UserCheck, 
  Lock, 
  ArrowLeft,
  Sparkles 
} from 'lucide-react';
import { useDoctorAuth } from '../../Hooks/useDoctorAuth';
import { FEATURED_DOCTORS } from '../../utils/constants';

interface DoctorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorAuthModal: React.FC<DoctorAuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { loginDoctor } = useDoctorAuth();
  const [selectedDocId, setSelectedDocId] = useState(FEATURED_DOCTORS[0].id);

  if (!isOpen) return null;

  const handleSelectDoctor = async (docId: string) => {
    await loginDoctor(docId);
    onClose();
    navigate('/doctor/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden text-right">
        
        {/* Header */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">بوابة الأطباء والاستشاريين</h3>
              <p className="text-xs text-slate-500">اختر حساب الطبيب للدخول إلى عيادتك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctors Selector List */}
        <div className="p-5 space-y-2.5">
          <span className="text-xs font-semibold text-slate-700 block mb-1">الأطباء المتاحون في المنظومة:</span>

          {FEATURED_DOCTORS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleSelectDoctor(doc.id)}
              className="p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={doc.imageUrl}
                  alt={doc.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{doc.departmentName} • {doc.title}</p>
                </div>
              </div>

              <button
                className="px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-brand-600 group-hover:text-white text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>دخول</span>
                <ArrowLeft className="w-3 h-3" />
              </button>
            </div>
          ))}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>نظام إدارة العيادات الذكية CareSync</span>
            <span className="text-brand-600 font-medium">نسخة الاستشاريين</span>
          </div>
        </div>

      </div>
    </div>
  );
};
