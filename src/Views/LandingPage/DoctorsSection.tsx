import React, { useState } from 'react';
import { 
  Star, 
  Calendar, 
  Award, 
  Clock 
} from 'lucide-react';
import { Doctor, Department } from '../../utils/types';
import { formatCurrency, formatRating } from '../../utils/formatters';

interface DoctorsSectionProps {
  doctors: Doctor[];
  departments: Department[];
  selectedDepartmentId: string;
  onSelectDepartment: (deptId: string) => void;
  onOpenBooking: (doctorName?: string, departmentId?: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  doctors,
  departments,
  selectedDepartmentId,
  onSelectDepartment,
  onOpenBooking,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(selectedDepartmentId || 'all');

  const handleFilterClick = (deptId: string) => {
    setActiveFilter(deptId);
    onSelectDepartment(deptId === 'all' ? '' : deptId);
  };

  const filteredDoctors = activeFilter === 'all' 
    ? doctors 
    : doctors.filter(d => d.departmentId === activeFilter);

  return (
    <section id="doctors" className="py-16 bg-white border-t border-slate-100 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-semibold text-brand-600">الطاقم الطبي</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            نخبة من كبار الأطباء والاستشاريين
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            أطباء ذوو خبرة واسعة معتمدون لتوفير أفضل خطة علاجية مخصصة لحالتك
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => handleFilterClick('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({doctors.length})
          </button>

          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => handleFilterClick(dept.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === dept.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-brand-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 bg-slate-100 overflow-hidden flex items-center justify-center">
                  {doc.imageUrl ? (
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      onError={(e) => {
                        // If image fails, hide it and reveal the fallback background
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}
                  
                  {/* Fallback Icon if image fails or missing */}
                  <div className="absolute inset-0 -z-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand-100 to-sky-100 text-brand-700">
                    <span className="text-3xl font-bold mb-1">{doc.name.replace('د. ', '').charAt(0)}</span>
                    <span className="text-xs font-semibold">{doc.name}</span>
                  </div>
                  
                  <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs rounded-lg px-2 py-0.5 flex items-center gap-1 text-[11px] font-bold text-slate-900 shadow-sm border border-slate-100">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{formatRating(doc.rating)}</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 z-10 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm">
                    {doc.departmentName}
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{doc.title}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
                    <span className="text-slate-500">خبرة {doc.experienceYears} سنة</span>
                    <span className="font-bold text-brand-700">الكشف: {formatCurrency(doc.consultationFee)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {doc.specialties.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onOpenBooking(doc.id, doc.departmentId)}
                  className="w-full py-2 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-semibold text-xs border border-brand-200/80 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>حجز موعد</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
