import React from 'react';
import { 
  CalendarCheck, 
  FileText, 
  Award, 
  Headset, 
  CheckCircle2 
} from 'lucide-react';
import { FEATURES } from '../../utils/constants';

export const FeaturesSection: React.FC = () => {
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'CalendarCheck': return <CalendarCheck className="w-5 h-5 text-brand-600" />;
      case 'FileText': return <FileText className="w-5 h-5 text-cyan-600" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-600" />;
      case 'Headset': return <Headset className="w-5 h-5 text-purple-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-brand-600" />;
    }
  };

  return (
    <section id="features" className="py-16 bg-slate-50 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-brand-600">مميزات الخدمة</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            لماذا يختار المرضى عيادات CareSync؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            صممنا منظومة العمل لتضع راحة وصحة المريض في المقام الأول
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feat) => (
            <div
              key={feat.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                  {getFeatureIcon(feat.icon)}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
