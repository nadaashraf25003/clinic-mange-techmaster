import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Clock, 
  X, 
  Save, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';
import { DEPARTMENTS } from '../../utils/constants';
import { Doctor } from '../../utils/types';

export const AdminDoctors: React.FC = () => {
  const { doctors, departments, addDoctor, updateDoctor, deleteDoctor, toggleDoctorStatus } = useAdminAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<(Doctor & { isActive?: boolean }) | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  const activeDepartments = departments.length > 0 ? departments : DEPARTMENTS;

  // New / Edit Doctor Form State
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDeptId, setFormDeptId] = useState(activeDepartments[0]?.id || 'cardiology');
  const [formFee, setFormFee] = useState(400);
  const [formExp, setFormExp] = useState(10);
  const [formDays, setFormDays] = useState('السبت، الإثنين، الأربعاء');
  const [formSpecialties, setFormSpecialties] = useState('استشارات عامة، كشف تشخيصي');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedDept !== 'all' && doc.departmentId !== selectedDept) return false;
    return true;
  });

  const openAddModal = () => {
    setFormName('');
    setFormTitle('');
    setFormDeptId(activeDepartments[0]?.id || 'cardiology');
    setFormFee(400);
    setFormExp(10);
    setFormDays('السبت، الإثنين، الأربعاء');
    setFormSpecialties('استشارات عامة، كشف تشخيصي');
    setFormImage('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400');
    setIsAddModalOpen(true);
  };

  const openEditModal = (doc: Doctor & { isActive?: boolean }) => {
    setEditingDoctor(doc);
    setFormName(doc.name);
    setFormTitle(doc.title);
    setFormDeptId(doc.departmentId);
    setFormFee(doc.consultationFee);
    setFormExp(doc.experienceYears);
    setFormDays(doc.availableDays?.join('، ') || 'السبت، الإثنين، الأربعاء');
    setFormSpecialties(doc.specialties?.join('، ') || '');
    setFormImage(doc.imageUrl);
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTitle) {
      alert('يرجى كتابة اسم الطبيب واللقب العلمي');
      return;
    }

    const deptObj = activeDepartments.find(d => d.id === formDeptId) || activeDepartments[0];

    addDoctor({
      name: formName,
      title: formTitle,
      departmentId: deptObj.id,
      departmentName: deptObj.name,
      experienceYears: Number(formExp),
      consultationFee: Number(formFee),
      availableDays: formDays.split('،').map(s => s.trim()),
      specialties: formSpecialties.split('،').map(s => s.trim()),
      imageUrl: formImage,
    });

    setIsAddModalOpen(false);
  };

  const handleEditDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    const deptObj = activeDepartments.find(d => d.id === formDeptId) || activeDepartments[0];

    updateDoctor(editingDoctor.id, {
      name: formName,
      title: formTitle,
      departmentId: deptObj.id,
      departmentName: deptObj.name,
      experienceYears: Number(formExp),
      consultationFee: Number(formFee),
      availableDays: formDays.split('،').map(s => s.trim()),
      specialties: formSpecialties.split('،').map(s => s.trim()),
      imageUrl: formImage,
    });

    setEditingDoctor(null);
  };

  const confirmDeleteDoctor = () => {
    if (deletingDocId) {
      deleteDoctor(deletingDocId);
      setDeletingDocId(null);
    }
  };

  return (
    <div className="space-y-5 text-right">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">إدارة الأطباء والكادر الطبي</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            إجمالي الأطباء المسجلين: {doctors.length} طبيباً واستشارياً
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طبيب جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Department Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDept === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            جميع التخصصات ({doctors.length})
          </button>

          {activeDepartments.map(dept => {
            const count = doctors.filter(d => d.departmentId === dept.id).length;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === dept.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {dept.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم الطبيب أو التخصص..."
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:bg-white text-right"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

      </div>

      {/* Doctors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => {
          const isActive = doc.isActive !== false;

          return (
            <div 
              key={doc.id}
              className={`bg-white rounded-2xl border p-4.5 space-y-3 transition-all flex flex-col justify-between ${
                isActive ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 bg-slate-50/70 opacity-80'
              }`}
            >
              {/* Doctor Avatar and Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.imageUrl || '/doctors/doctor-ahmed.jpg'}
                      alt={doc.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/doctors/doctor-ahmed.jpg';
                      }}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
                      <p className="text-[11px] text-brand-700 font-semibold">{doc.departmentName}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{doc.title}</p>
                    </div>
                  </div>

                  {/* Active Status Toggle */}
                  <button
                    onClick={() => toggleDoctorStatus(doc.id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors shrink-0 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                    }`}
                    title="انقر لتبديل حالة التوفر"
                  >
                    {isActive ? 'نشط ومتاح' : 'غير متاح'}
                  </button>
                </div>

                {/* Details Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">التقييم</span>
                    <span className="font-bold text-slate-800 flex items-center justify-center gap-0.5 text-xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{doc.rating}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">الخبرة</span>
                    <span className="font-bold text-slate-800 text-xs">{doc.experienceYears} سنة</span>
                  </div>

                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">سعر الكشف</span>
                    <span className="font-bold text-slate-900 text-xs">{doc.consultationFee} ج.م</span>
                  </div>
                </div>

                {/* Available Days */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">
                    الأيام: <strong className="text-slate-700">{doc.availableDays?.join('، ') || 'يومياً'}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(doc)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل الطبيب</span>
                </button>

                <button
                  onClick={() => setDeletingDocId(doc.id)}
                  className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                  title="حذف الطبيب"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Doctor Modal Form */}
      {(isAddModalOpen || editingDoctor) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-right">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm">
                  {editingDoctor ? `تعديل بيانات: ${editingDoctor.name}` : 'تسجيل طبيب جديد بالمنظومة'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDoctor(null);
                }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingDoctor ? handleEditDoctorSubmit : handleAddDoctorSubmit} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم الطبيب الكامل *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: د. حسام عبد العزيز"
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-right"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">اللقب والدرجة العلمية *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: استشاري جراحة المناظير والعمود الفقري"
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-right"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القسم / التخصص *</label>
                  <select
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right bg-white"
                  >
                    {activeDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">قيمة الكشف (ج.م) *</label>
                  <input
                    type="number"
                    value={formFee}
                    onChange={(e) => setFormFee(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">سنوات الخبرة</label>
                  <input
                    type="number"
                    value={formExp}
                    onChange={(e) => setFormExp(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">أيام العمل المتاحة</label>
                  <input
                    type="text"
                    value={formDays}
                    onChange={(e) => setFormDays(e.target.value)}
                    placeholder="السبت، الإثنين، الأربعاء"
                    className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">التخصصات الدقيقة</label>
                <input
                  type="text"
                  value={formSpecialties}
                  onChange={(e) => setFormSpecialties(e.target.value)}
                  placeholder="مفصول بفاصلة: القسطرة، الإيكو، ضغط الدم"
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رابط الصورة الشخصية (Image URL)</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-left font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDoctor(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingDoctor ? 'حفظ التعديلات' : 'حفظ الطبيب'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDocId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4 text-right">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">تأكيد حذف الطبيب</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا الطبيب من المنظومة؟ لن يتمكن المرضى من حجز مواعيد جديدة معه.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingDocId(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDeleteDoctor}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تأكيد الحذف</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
