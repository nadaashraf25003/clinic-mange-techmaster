import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  X,
  Printer,
  Eye
} from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';
import { LabReport } from '../../utils/types';
import { CLINIC_INFO } from '../../utils/constants';

export const PatientLabReports: React.FC = () => {
  const { labReports, patient } = usePatientAuth();
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = labReports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesSearch = report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 text-right max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">سجل الفحوصات والتحاليل</h2>
          <p className="text-xs text-slate-500">نتائج وتقارير المختبر والأشعة المعتمدة</p>
        </div>
      </div>

      {/* Search & Category */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث عن فحص..."
            className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none text-right"
          />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto">
          {['all', 'تحاليل دم', 'أشعة ومناظير'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'الكل' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400 text-xs">
            لا توجد تقارير مطابقة
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{report.reportNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      report.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {report.status === 'completed' ? 'جاهز ومعتمد' : 'قيد التحليل'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{report.testName}</h3>
                  <p className="text-xs text-slate-500">د. {report.orderedByDoctor} • {report.date}</p>
                </div>

                <button
                  onClick={() => setSelectedReport(report)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة النتائج</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <strong>الخلاصة:</strong> {report.summary}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden text-right">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold">{selectedReport.testName}</span>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-2">المؤشر</th>
                      <th className="p-2 text-center">النتيجة</th>
                      <th className="p-2 text-center">المعدل الطبيعي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedReport.results.map((r, i) => (
                      <tr key={i} className={r.isAbnormal ? 'bg-amber-50/70 font-semibold' : ''}>
                        <td className="p-2 text-slate-800">{r.name}</td>
                        <td className="p-2 text-center font-bold text-slate-900">{r.result} {r.unit !== '-' ? r.unit : ''}</td>
                        <td className="p-2 text-center text-slate-500">{r.normalRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                <strong>ملاحظات المختبر:</strong> {selectedReport.summary}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-1.5 bg-slate-900 text-white text-xs rounded-lg font-semibold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
