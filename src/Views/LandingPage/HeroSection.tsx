import React from 'react';
import { 
  CalendarPlus, 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowLeft
} from 'lucide-react';
import { CLINIC_STATS, CLINIC_INFO } from '../../utils/constants';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="hero" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-100 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Right Column: Hero Copy & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-600"></span>
              <span>منظومة حجز رقمية متكاملة لعام 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              رعاية صحية موثوقة تبدأ <br className="hidden sm:inline" />
              بحجز <span className="text-brand-600">موعدك الطبي</span> في دقائق
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              تخلص من عناء الانتظار الطويل. نوفر لك نخبة من أفضل الاستشاريين، ملف طبي رقمي موحد، ونظام حجز مرن مع تأكيد فوري.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>احجز كشفك الآن</span>
              </button>

              <a
                href="#doctors"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-brand-600" />
                <span>استكشف الأطباء</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-right text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>أطباء معتمدون</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>مواعيد دقيقة</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span>تقييم 4.9 / 5</span>
              </div>
            </div>

          </div>

          {/* Left Column: Simple Clean Image Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <img
                src="/clinic-hero.jpg"
                alt="مركز العيادات التخصصية"
                className="w-full h-80 sm:h-96 object-cover object-center"
              />
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">مجمع كير سينك الطبي التخصصي</h3>
                  <p className="text-xs text-slate-500">عيادات استشارية متكاملة بأعلى معايير الجودة</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.95</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Numbers Row */}
        <div className="mt-14 pt-8 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {CLINIC_STATS.map((stat) => (
            <div key={stat.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-slate-900 font-mono text-brand-700">
                {stat.value}
              </div>
              <div className="font-bold text-xs text-slate-800 mt-1">{stat.label}</div>
              <div className="text-[11px] text-slate-400">{stat.sublabel}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
