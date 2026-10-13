import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../../utils/constants';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 bg-white border-t border-slate-100 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-brand-600">آراء المرضى</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            ماذا يقول مرضانا عن تجربتهم في العيادة؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{item.patientName}</h4>
                  <span className="text-[11px] text-brand-600">{item.department}</span>
                </div>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
