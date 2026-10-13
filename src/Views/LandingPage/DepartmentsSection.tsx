import React from 'react';
import { 
  HeartPulse, 
  Baby, 
  Smile, 
  Activity, 
  Eye, 
  Sparkles, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { Department } from '../../utils/types';

interface DepartmentsSectionProps {
  departments: Department[];
  onSelectDepartment: (deptId: string) => void;
  onOpenBooking: (doctorName?: string, departmentId?: string) => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  departments,
  onSelectDepartment,
  onOpenBooking,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Baby': return <Baby className="w-5 h-5 text-amber-600" />;
      case 'Smile': return <Smile className="w-5 h-5 text-cyan-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'Eye': return <Eye className="w-5 h-5 text-blue-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-600" />;
      default: return <HeartPulse className="w-5 h-5 text-brand-600" />;
    }
  };

  return (
    <section id="departments" className="py-16 bg-slate-50 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold text-brand-600">العيادات التخصصية</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            تخصصات طبية شاملة بأحدث المعايير
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            عيادات مجهزة بأحدث المعدات التشخيصية والعلاجية لتقديم رعاية صحية متكاملة
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {getIcon(dept.icon)}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {dept.doctorsCount} أطباء متاحين
                  </span>
                </div>

                <div className="mb-2">
                  <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                  <span className="text-xs text-slate-400">{dept.nameEn}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {dept.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href="#doctors"
                  onClick={() => onSelectDepartment(dept.id)}
                  className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>عرض الأطباء</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenBooking(undefined, dept.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 transition-colors"
                >
                  حجز موعد
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
