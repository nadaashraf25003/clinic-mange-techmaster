import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';

export const PatientProfile: React.FC = () => {
  const { patient, updateProfile } = usePatientAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [name, setName] = useState(patient?.name || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [email, setEmail] = useState(patient?.email || '');
  const [nationalId, setNationalId] = useState(patient?.nationalId || '');
  const [age, setAge] = useState<number | ''>(patient?.age ?? '');
  const [bloodType, setBloodType] = useState(patient?.bloodType || '');
  const [chronicConditions, setChronicConditions] = useState(
    patient?.chronicConditions?.join('، ') || ''
  );
  const [allergies, setAllergies] = useState(
    patient?.allergies?.join('، ') || ''
  );
  const [emergencyName, setEmergencyName] = useState(
    patient?.emergencyContact?.name || ''
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    patient?.emergencyContact?.phone || ''
  );
  const [insuranceProvider, setInsuranceProvider] = useState(
    patient?.insurance?.provider || ''
  );
  const [insurancePolicy, setInsurancePolicy] = useState(
    patient?.insurance?.policyNumber || ''
  );

  React.useEffect(() => {
    if (patient) {
      setName(patient.name || '');
      setPhone(patient.phone || '');
      setEmail(patient.email || '');
      setNationalId(patient.nationalId || '');
      setAge(patient.age ?? '');
      setBloodType(patient.bloodType || '');
      setChronicConditions(patient.chronicConditions?.join('، ') || '');
      setAllergies(patient.allergies?.join('، ') || '');
      setEmergencyName(patient.emergencyContact?.name || '');
      setEmergencyPhone(patient.emergencyContact?.phone || '');
      setInsuranceProvider(patient.insurance?.provider || '');
      setInsurancePolicy(patient.insurance?.policyNumber || '');
    }
  }, [patient]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      email,
      nationalId,
      age: Number(age),
      bloodType: bloodType as any,
      chronicConditions: chronicConditions.split('،').map(s => s.trim()).filter(Boolean),
      allergies: allergies.split('،').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: patient?.emergencyContact?.relation || 'أقارب'
      },
      insurance: {
        provider: insuranceProvider,
        policyNumber: insurancePolicy,
        coveragePercentage: patient?.insurance?.coveragePercentage || 80,
        expiryDate: patient?.insurance?.expiryDate || '2026-12-31'
      }
    });

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 text-right max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">الملف الطبي والتأمين</h2>
          <p className="text-xs text-slate-500">البيانات الشخصية والصحية للمريض</p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              <Check className="w-3.5 h-3.5" />
              <span>تم الحفظ</span>
            </span>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isEditing 
                ? 'bg-slate-100 text-slate-700' 
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {isEditing ? 'إلغاء' : 'تعديل البيانات'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Personal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-xs text-slate-800 pb-2 border-b border-slate-100">البيانات الأساسية</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم بالكامل</label>
              <input
                type="text"
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف</label>
              <input
                type="text"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">فصيلة الدم</label>
              <input
                type="text"
                disabled={!isEditing}
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right font-mono"
              />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-xs text-slate-800 pb-2 border-b border-slate-100">التاريخ الصحي</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الأمراض المزمنة</label>
              <input
                type="text"
                disabled={!isEditing}
                value={chronicConditions}
                onChange={(e) => setChronicConditions(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الحساسية من أدوية</label>
              <input
                type="text"
                disabled={!isEditing}
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right"
              />
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-xs text-slate-800 pb-2 border-b border-slate-100">بيانات التأمين والطوارئ</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شركة التأمين</label>
              <input
                type="text"
                disabled={!isEditing}
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">رقم بطاقة التأمين</label>
              <input
                type="text"
                disabled={!isEditing}
                value={insurancePolicy}
                onChange={(e) => setInsurancePolicy(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">رقم هاتف الطوارئ</label>
              <input
                type="text"
                disabled={!isEditing}
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 disabled:bg-slate-50 text-right"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        )}

      </form>

    </div>
  );
};
