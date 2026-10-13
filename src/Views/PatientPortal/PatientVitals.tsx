import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';

export const PatientVitals: React.FC = () => {
  const { vitals, addVitalRecord } = usePatientAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [sugar, setSugar] = useState<number>(95);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [weight, setWeight] = useState<number>(78);
  const [temp, setTemp] = useState<number>(36.8);
  const [notes, setNotes] = useState('');

  const latest = vitals.length > 0 ? vitals[0] : null;

  const handleAddVital = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addVitalRecord({
      date: dateStr,
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      bloodSugar: Number(sugar),
      heartRate: Number(heartRate),
      weight: Number(weight),
      temperature: Number(temp),
      notes: notes || 'تسجيل يدوي'
    });

    setIsAddModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-5 text-right max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">سجل المؤشرات الحيوية</h2>
          <p className="text-xs text-slate-500">متابعة وتسجيل قياسات الضغط والسكر والنبض</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قياس جديد</span>
        </button>
      </div>

      {/* Latest Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs text-slate-500">ضغط الدم</span>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {latest ? `${latest.bloodPressureSystolic} / ${latest.bloodPressureDiastolic}` : '-- / --'}
          </div>
          <span className="text-[10px] text-slate-400">mmHg</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs text-slate-500">سكر الدم</span>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {latest ? latest.bloodSugar : '--'}
          </div>
          <span className="text-[10px] text-slate-400">mg/dL</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs text-slate-500">النبض</span>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {latest ? latest.heartRate : '--'}
          </div>
          <span className="text-[10px] text-slate-400">bpm</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs text-slate-500">الوزن</span>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {latest ? `${latest.weight} ` : '-- '}
            <span className="text-xs font-normal">كجم</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {latest ? `الحرارة: ${latest.temperature}°` : 'الحرارة: --'}
          </span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="font-bold text-xs text-slate-800">سجل القياسات السابقة</h3>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-2.5">التاريخ والوقت</th>
                <th className="p-2.5 text-center">الضغط</th>
                <th className="p-2.5 text-center">السكر</th>
                <th className="p-2.5 text-center">النبض</th>
                <th className="p-2.5 text-center">الوزن</th>
                <th className="p-2.5">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vitals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    لا توجد قياسات مسجلة حتى الآن. اضغط على زر "إضافة قياس جديد" لتسجيل قراءاتك.
                  </td>
                </tr>
              ) : (
                vitals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-700">{item.date}</td>
                    <td className="p-2.5 text-center font-bold text-slate-900 font-mono">
                      {item.bloodPressureSystolic}/{item.bloodPressureDiastolic}
                    </td>
                    <td className="p-2.5 text-center font-mono">{item.bloodSugar}</td>
                    <td className="p-2.5 text-center font-mono">{item.heartRate}</td>
                    <td className="p-2.5 text-center font-mono">{item.weight} kg</td>
                    <td className="p-2.5 text-slate-500">{item.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 text-right space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">تسجيل قراءة جديدة</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVital} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الضغط (العالي)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 font-mono text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الضغط (الواطي)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 font-mono text-right"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">السكر (mg/dL)</label>
                  <input
                    type="number"
                    value={sugar}
                    onChange={(e) => setSugar(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">النبض (bpm)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 font-mono text-right"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
