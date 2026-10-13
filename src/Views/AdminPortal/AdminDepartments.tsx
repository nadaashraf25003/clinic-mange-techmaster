import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarDays, 
  Plus, 
  Stethoscope, 
  CheckCircle2, 
  Edit3,
  Trash2,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';
import { Department } from '../../utils/types';

export const AdminDepartments: React.FC = () => {
  const { doctors, appointments, departments, addDepartment, updateDepartment, deleteDepartment } = useAdminAuth();
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDeptId, setDeletingDeptId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const openAddModal = () => {
    setFormName('');
    setFormNameEn('');
    setFormDesc('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setFormName(dept.name);
    setFormNameEn(dept.nameEn);
    setFormDesc(dept.description);
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: formName,
      nameEn: formNameEn || formName,
      icon: 'Stethoscope',
      description: formDesc || 'عيادة استشارية متخصصة ومجهزة بأحدث الأجهزة الطبية.',
      doctorsCount: 1,
      colorClass: 'from-blue-500/10 to-indigo-500/5 text-blue-600 border-blue-100'
    };

    addDepartment(newDept);
    setIsAddModalOpen(false);
  };

  const handleEditDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !formName) return;

    updateDepartment(editingDept.id, {
      name: formName,
      nameEn: formNameEn || formName,
      description: formDesc,
    });

    setEditingDept(null);
  };

  const confirmDeleteDept = () => {
    if (deletingDeptId) {
      deleteDepartment(deletingDeptId);
      setDeletingDeptId(null);
    }
  };

  return (
    <div className="space-y-5 text-right">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الأقسام والعيادات التخصصية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            إجمالي العيادات النشطة: {departments.length} أقسام تخصصية
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم / عيادة جديدة</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const deptDoctors = doctors.filter(d => d.departmentId === dept.id || d.departmentName.includes(dept.name));
          const deptAppointments = appointments.filter(a => a.departmentId === dept.id || a.departmentName?.includes(dept.name));

          return (
            <div key={dept.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-base shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{dept.nameEn}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 shrink-0">
                    مفعلة
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                  {dept.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">الأطباء المتاحون</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      <span>{deptDoctors.length || dept.doctorsCount} أطباء</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">كشوفات اليوم</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                      <span>{deptAppointments.length} مريض</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Doctors preview */}
                {deptDoctors.length > 0 && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="text-slate-400 text-[10px]">الكادر:</span>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {deptDoctors.map(d => (
                        <img
                          key={d.id}
                          src={d.imageUrl}
                          alt={d.name}
                          title={d.name}
                          className="w-5 h-5 rounded-full object-cover border border-white"
                        />
                      ))}
                    </div>
                    <span className="truncate text-slate-700 font-medium mr-1">
                      {deptDoctors.map(d => d.name.split(' ')[1] || d.name).join('، ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(dept)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل العيادة</span>
                </button>

                <button
                  onClick={() => setDeletingDeptId(dept.id)}
                  className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                  title="حذف العيادة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Department Modal */}
      {(isAddModalOpen || editingDept) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-right">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm">
                  {editingDept ? `تعديل قسم: ${editingDept.name}` : 'إضافة تخصص / عيادة جديدة'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDept(null);
                }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingDept ? handleEditDept : handleAddDept} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم العيادة بالعربية *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: عيادة العيون والليزك"
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الاسم بالإنجليزية</label>
                <input
                  type="text"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  placeholder="Ophthalmology"
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-left font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">وصف العيادة والخدمات المقدمة</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="فحص قاع العين، تصحيح النظر، وأحدث أجهزة التشخيص..."
                  className="w-full p-2 rounded-lg border border-slate-200 outline-none text-right resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDept(null);
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
                  <span>{editingDept ? 'حفظ التعديلات' : 'إضافة العيادة'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Department Confirmation Modal */}
      {deletingDeptId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4 text-right">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">تأكيد حذف القسم</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا القسم التخصصي من المنظومة؟
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingDeptId(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDeleteDept}
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
