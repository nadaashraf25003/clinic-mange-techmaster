import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Printer, 
  X, 
  QrCode 
} from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';
import { CLINIC_INFO } from '../../utils/constants';
import { Prescription } from '../../utils/types';

export const PatientPrescriptions: React.FC = () => {
  const { prescriptions, patient } = usePatientAuth();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  return (
    <div className="space-y-5 text-right max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">الروشتات الطبية الرقمية</h2>
          <p className="text-xs text-slate-500">استعراض تفاصيل الأدوية والجرعات الموصوفة</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400 text-xs">
            لا توجد روشتات مسجلة حالياً
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs text-brand-700 font-bold block">{rx.prescriptionNumber}</span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{rx.doctorName}</h3>
                  <p className="text-xs text-slate-500">{rx.doctorSpecialty}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>تاريخ الصدور: {rx.date}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">التشخيص:</span>
                {rx.diagnosis}
              </div>

              {/* Medicines table */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-2">الأدوية الموصوفة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {rx.medications.map((med) => (
                    <div key={med.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{med.name}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">التكرار: {med.frequency}</p>
                      <p className="text-[11px] text-slate-500">المدة: {med.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPrescription(rx)}
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>معاينة الروشتة الرسمية والطباعة</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 overflow-hidden text-right">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold">الروشتة الطبية الرسمية</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة</span>
                </button>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{CLINIC_INFO.nameAr}</h3>
                  <p className="text-slate-400 text-[11px]">{CLINIC_INFO.nameEn}</p>
                </div>
                <div className="text-left font-mono text-[11px] text-slate-500">
                  <p>{selectedPrescription.prescriptionNumber}</p>
                  <p>{selectedPrescription.date}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                <div>
                  <p><strong>المريض:</strong> {patient?.name || 'مريض'}</p>
                  <p><strong>رقم الملف:</strong> {patient?.id || 'pat-101'}</p>
                </div>
                <div>
                  <p><strong>الطبيب:</strong> {selectedPrescription.doctorName}</p>
                  <p><strong>التخصص:</strong> {selectedPrescription.doctorSpecialty}</p>
                </div>
              </div>

              <div className="p-2.5 bg-brand-50/50 border border-brand-100 rounded-lg">
                <strong>التشخيص:</strong> {selectedPrescription.diagnosis}
              </div>

              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {selectedPrescription.medications.map((med, i) => (
                  <div key={med.id} className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{i + 1}. {med.name} ({med.dosage})</p>
                      <p className="text-slate-500 text-[11px] mr-3">{med.instructions}</p>
                    </div>
                    <div className="text-left text-slate-500">
                      <span>{med.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 text-slate-400 text-[11px]">
                <span>روشتة إلكترونية معتمدة</span>
                <QrCode className="w-8 h-8 text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
