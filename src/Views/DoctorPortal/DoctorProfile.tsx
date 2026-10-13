import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  Clock, 
  CreditCard,
  Award,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Building,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useDoctorAuth } from '../../Hooks/useDoctorAuth';

export const DoctorProfile: React.FC = () => {
  const { currentDoctor, updateCurrentDoctor } = useDoctorAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [name, setName] = useState(currentDoctor.name);
  const [title, setTitle] = useState(currentDoctor.title);
  const [departmentName, setDepartmentName] = useState(currentDoctor.departmentName);
  const [experienceYears, setExperienceYears] = useState(currentDoctor.experienceYears || 10);
  const [consultationFee, setConsultationFee] = useState(currentDoctor.consultationFee || 400);
  const [availableDays, setAvailableDays] = useState(currentDoctor.availableDays?.join('، ') || 'السبت، الإثنين، الأربعاء');
  const [specialties, setSpecialties] = useState(currentDoctor.specialties?.join(' • ') || '');
  const [imageUrl, setImageUrl] = useState(currentDoctor.imageUrl);
  const [phone, setPhone] = useState(currentDoctor.phone || '01012345678');
  const [email, setEmail] = useState(currentDoctor.email || 'doctor@caresync.com');
  const [roomNumber, setRoomNumber] = useState(currentDoctor.roomNumber || 'عيادة 104');
  const [bio, setBio] = useState(currentDoctor.bio || 'استشاري متخصص ومعتمد بخبرة طبية واسعة.');

  const handleStartEditing = () => {
    setName(currentDoctor.name);
    setTitle(currentDoctor.title);
    setDepartmentName(currentDoctor.departmentName);
    setExperienceYears(currentDoctor.experienceYears || 10);
    setConsultationFee(currentDoctor.consultationFee || 400);
    setAvailableDays(currentDoctor.availableDays?.join('، ') || '');
    setSpecialties(currentDoctor.specialties?.join(' • ') || '');
    setImageUrl(currentDoctor.imageUrl);
    setPhone(currentDoctor.phone || '01012345678');
    setEmail(currentDoctor.email || 'doctor@caresync.com');
    setRoomNumber(currentDoctor.roomNumber || 'عيادة 104');
    setBio(currentDoctor.bio || 'استشاري متخصص ومعتمد بخبرة طبية واسعة.');
    setErrorMessage('');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      await updateCurrentDoctor({
        name,
        title,
        departmentName,
        experienceYears: Number(experienceYears),
        consultationFee: Number(consultationFee),
        availableDays: availableDays.split('،').map(s => s.trim()).filter(Boolean),
        specialties: specialties.split('•').map(s => s.trim()).filter(Boolean),
        imageUrl,
        phone,
        email,
        roomNumber,
        bio
      });

      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء حفظ التعديلات على الخادم');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 text-right max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">الملف المهني ومواعيد العيادة</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              معتمد بالنظام
            </span>
          </div>
          <p className="text-xs text-slate-500">بيانات الاستشاري وساعات استقبال المرضى متصلة بقاعدة البيانات المركزية</p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleStartEditing}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل بياناتي</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>إلغاء التعديل</span>
          </button>
        )}
      </div>

      {showSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ وتحديث بيانات الملف المهني مباشرة بالخادم بنجاح!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Card / Edit Form */}
      {!isEditing ? (
        /* View Mode */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={currentDoctor.imageUrl || '/doctors/doctor-ahmed.jpg'}
              alt={currentDoctor.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/doctors/doctor-ahmed.jpg';
              }}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-2xs"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">{currentDoctor.name}</h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                  استشاري معتمد
                </span>
              </div>
              <p className="text-xs text-brand-700 font-semibold">
                {currentDoctor.departmentName} • {currentDoctor.title}
              </p>
              {currentDoctor.bio && (
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  {currentDoctor.bio}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block mb-0.5">سنوات الخبرة</span>
              <span className="font-bold text-slate-900">{currentDoctor.experienceYears || 10} سنة</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block mb-0.5">سعر الكشف</span>
              <span className="font-bold text-slate-900 font-mono">{currentDoctor.consultationFee || 400} ج.م</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block mb-0.5">موقع العيادة / الغرفة</span>
              <span className="font-bold text-slate-900">{currentDoctor.roomNumber || 'عيادة 104'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block mb-0.5">رقم الهاتف للتواصل</span>
              <span className="font-bold text-slate-900 font-mono">{currentDoctor.phone || '01012345678'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="text-[10px] text-slate-400 block mb-0.5">البريد الإلكتروني المهني</span>
              <span className="font-bold text-slate-900 font-mono">{currentDoctor.email || 'doctor@caresync.com'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-3">
              <span className="text-[10px] text-slate-400 block mb-0.5">أيام استقبال المرضى بالعيادة</span>
              <span className="font-bold text-slate-900">
                {currentDoctor.availableDays?.join('، ') || 'طوال أيام الأسبوع'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-3">
              <span className="text-[10px] text-slate-400 block mb-0.5">التخصصات الدقيقة والاهتمامات الطبية</span>
              <span className="font-semibold text-slate-800">
                {currentDoctor.specialties?.join(' • ') || 'استشارات عامة وكشوفات متخصصة'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode Form */
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs shadow-2xs">
          
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={imageUrl || currentDoctor.imageUrl}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
            />
            <div className="flex-1">
              <label className="block font-semibold text-slate-700 mb-1 text-[11px]">رابط الصورة الشخصية (URL)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 outline-none text-left font-mono text-[11px] focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">الاسم الكامل للطبيب *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500 font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">الدرجة واللقب المهني *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">القسم / العيادة</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">سنوات الخبرة</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">سعر الكشف (ج.م) *</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500 font-bold font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم الغرفة / العيادة</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              أيام استقبال المرضى (مفصول بفاصلة)
            </label>
            <input
              type="text"
              value={availableDays}
              onChange={(e) => setAvailableDays(e.target.value)}
              placeholder="السبت، الإثنين، الأربعاء"
              className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              التخصصات الفرعية (مفصول بنقطة •)
            </label>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="القسطرة التداخلية • ضغط الدم المرتفع • رسم القلب"
              className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              نبذة تعريفية مختصرة (Bio)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب نبذة مختصرة عن مؤهلاتك وخبرتك السريرية..."
              className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-brand-500 resize-none text-right"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'جارِ الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
