import React from 'react';
import { 
  HeartPulse, 
  Phone, 
  Mail, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { CLINIC_INFO, DEPARTMENTS } from '../utils/constants';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200 text-slate-600 pt-12 pb-8 text-right text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900">CareSync</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              {CLINIC_INFO.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#hero" className="hover:text-brand-600">الرئيسية</a></li>
              <li><a href="#departments" className="hover:text-brand-600">الأقسام والعيادات</a></li>
              <li><a href="#doctors" className="hover:text-brand-600">قائمة الأطباء</a></li>
              <li><a href="#features" className="hover:text-brand-600">مميزات المركز</a></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3">العيادات التخصصية</h4>
            <ul className="space-y-2 text-slate-500">
              {DEPARTMENTS.slice(0, 4).map((d) => (
                <li key={d.id}>
                  <a href="#departments" className="hover:text-brand-600">{d.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3">الاتصال ومواعيد العمل</h4>
            <ul className="space-y-2 text-slate-500">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>الخط الساخن: {CLINIC_INFO.hotline}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>{CLINIC_INFO.address}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>{CLINIC_INFO.workingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 text-center text-slate-400">
          <p>© {new Date().getFullYear()} مجمع عيادات CareSync الطبي. جميع الحقوق محفوظة.</p>
        </div>

      </div>
    </footer>
  );
};
