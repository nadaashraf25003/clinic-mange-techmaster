import React from 'react';
import { CalendarPlus, PhoneCall } from 'lucide-react';
import { CLINIC_INFO } from '../../utils/constants';

interface BookingCTASectionProps {
  onOpenBooking: () => void;
}

export const BookingCTASection: React.FC<BookingCTASectionProps> = ({ onOpenBooking }) => {
  return (
    <section className="py-12 bg-slate-900 text-white text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-xl text-center lg:text-right">
            <h2 className="text-xl sm:text-2xl font-bold">
              هل تحتاج إلى استشارة طبية أو كشف تخصصي؟
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              احجز موعدك الآن مع الاستشاري المناسب لتجنب فترات الانتظار.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>احجز كشفك الآن</span>
            </button>

            <a
              href={`tel:${CLINIC_INFO.hotline}`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-brand-400" />
              <span>الخط الساخن: {CLINIC_INFO.hotline}</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
