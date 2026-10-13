import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Download, 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  Building2, 
  X, 
  Plus, 
  QrCode,
  Sparkles,
  Receipt
} from 'lucide-react';
import { usePatientAuth } from '../../Hooks/usePatientAuth';

interface PatientInvoice {
  id: string;
  invoiceNumber: string;
  title: string;
  doctorName: string;
  departmentName: string;
  date: string;
  time: string;
  totalAmount: number;
  insuranceDiscount: number;
  netPaid: number;
  paymentMethod: 'insurance' | 'card' | 'cash' | 'instapay';
  status: 'paid' | 'pending';
  receiptNotes?: string;
}

const INITIAL_INVOICES: PatientInvoice[] = [
  {
    id: 'inv-pat-01',
    invoiceNumber: 'INV-2026-8841',
    title: 'كشف استشاري ومتابعة رسم قلب وإيكو',
    doctorName: 'د. أحمد الشناوي',
    departmentName: 'القلب والأوعية الدموية',
    date: '2026-09-06',
    time: '06:30 م',
    totalAmount: 450,
    insuranceDiscount: 360, // 80%
    netPaid: 90,
    paymentMethod: 'insurance',
    status: 'paid',
    receiptNotes: 'تمت التغطية بنسبة 80% بموجب وثيقة بوبا BUP-8849-EG'
  },
  {
    id: 'inv-pat-02',
    invoiceNumber: 'INV-2026-8312',
    title: 'فحص صورة دم كاملة (CBC) وتحاليل إنزيمات كبد',
    doctorName: 'معمل CareSync المركزي',
    departmentName: 'المختبر والتحاليل الطبية',
    date: '2026-08-28',
    time: '10:15 ص',
    totalAmount: 650,
    insuranceDiscount: 520, // 80%
    netPaid: 130,
    paymentMethod: 'card',
    status: 'paid',
    receiptNotes: 'سداد إلكتروني عبر بطاقة Visa منتهية بـ 4092'
  },
  {
    id: 'inv-pat-03',
    invoiceNumber: 'INV-2026-7901',
    title: 'جلسة تنظيف وإزالة جير الأسنان مع تلميع وقائي',
    doctorName: 'د. سارة المنصوري',
    departmentName: 'طب وجراحة الأسنان',
    date: '2026-08-10',
    time: '04:00 م',
    totalAmount: 350,
    insuranceDiscount: 0,
    netPaid: 350,
    paymentMethod: 'cash',
    status: 'paid',
    receiptNotes: 'سداد نقدي بخزينة الاستقبال الرئيسية'
  },
  {
    id: 'inv-pat-04',
    invoiceNumber: 'INV-2026-9214',
    title: 'كشف استشاري جراحة عظام ومفاصل ومتابعة',
    doctorName: 'د. يوسف عبد الرحمن',
    departmentName: 'العظام والمفاصل',
    date: '2026-09-15',
    time: '05:30 م',
    totalAmount: 400,
    insuranceDiscount: 320,
    netPaid: 80,
    paymentMethod: 'insurance',
    status: 'pending',
    receiptNotes: 'حجز قادم - مستحق السداد عند الاستقبال أو أونلاين'
  }
];

export const PatientInvoices: React.FC = () => {
  const { patient } = usePatientAuth();
  const storageKey = patient?.id ? `caresync_patient_invoices_${patient.id}` : 'caresync_patient_invoices_guest';

  const [invoices, setInvoices] = useState<PatientInvoice[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    if (patient?.id === 'pat-101' || patient?.email === 'demo.patient@caresync.com') {
      return INITIAL_INVOICES;
    }
    return [];
  });

  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<PatientInvoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<PatientInvoice | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'card' | 'instapay' | 'fawry'>('card');

  // Sync state if patient changes
  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setInvoices(JSON.parse(saved));
    } else if (patient?.id === 'pat-101' || patient?.email === 'demo.patient@caresync.com') {
      setInvoices(INITIAL_INVOICES);
    } else {
      setInvoices([]);
    }
  }, [storageKey, patient?.id, patient?.email]);

  // Aggregates
  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.netPaid, 0);

  const totalInsuranceSavings = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.insuranceDiscount, 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.netPaid, 0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterStatus === 'paid') return inv.status === 'paid';
    if (filterStatus === 'pending') return inv.status === 'pending';
    return true;
  });

  const handlePayConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    setInvoices(prev => {
      const updated = prev.map(inv =>
        inv.id === payingInvoice.id ? { ...inv, status: 'paid' as const, paymentMethod: selectedPayMethod as any } : inv
      );
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setPayingInvoice(null);
    }, 1500);
  };

  const hasInsurance = Boolean(patient?.insurance?.provider);

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">سجل الفواتير والمدفوعات</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة إيصالات سداد الكشوفات، التحاليل الطبية، ونسب التغطية التأمينية.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة كشف الحساب</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Net Paid */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>إجمالي المسدد من المريض</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ج.م
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {totalPaid.toLocaleString()} ج.م
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {invoices.filter(i => i.status === 'paid').length > 0 ? 'مسدد وموثق' : 'لا يوجد مسدد'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            إجمالي الفواتير المسددة بالكامل
          </p>
        </div>

        {/* Insurance Savings */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>وفورات التغطية التأمينية</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {totalInsuranceSavings.toLocaleString()} ج.م
            </span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              {hasInsurance ? `تغطية تأمينية` : 'بدون تأمين'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {hasInsurance ? `تحملتها شركة ${patient?.insurance?.provider}` : 'الدفع شخصي مباشر'}
          </p>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>فواتير قيد السداد</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {pendingAmount} ج.م
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              {invoices.filter(i => i.status === 'pending').length} فواتير
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            يمكن سدادها أونلاين أو بالاستقبال
          </p>
        </div>

        {/* Insurance Card Info */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>بيانات بطاقة التأمين</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {patient?.insurance?.provider || 'لا يوجد تأمين مسجل'}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {patient?.insurance?.policyNumber ? `رقم الوثيقة: ${patient.insurance.policyNumber}` : 'الدفع نقدي / شخصي'}
          </p>
        </div>

      </div>

      {/* Invoices List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع الفواتير ({invoices.length})
            </button>

            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === 'paid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              مسددة بالكامل ({invoices.filter(i => i.status === 'paid').length})
            </button>

            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              بانتظار السداد ({invoices.filter(i => i.status === 'pending').length})
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالخدمة أو الطبيب أو الرقم..."
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-right focus:border-brand-500 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">رقم الفاتورة</th>
                <th className="p-3">الخدمة الطبية / العيادة</th>
                <th className="p-3">الطبيب المعالج</th>
                <th className="p-3">التاريخ والتوقيت</th>
                <th className="p-3">المبلغ الأصلي</th>
                <th className="p-3 text-teal-700">تغطية التأمين</th>
                <th className="p-3 font-bold text-slate-900">الصافي المطلوب</th>
                <th className="p-3 text-center">حالة السداد</th>
                <th className="p-3 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    لا توجد فواتير أو مدفوعات مسجلة حالياً
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800 text-xs">
                      {inv.invoiceNumber}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{inv.title}</div>
                      <div className="text-[10px] text-slate-400">{inv.departmentName}</div>
                    </td>

                    <td className="p-3 font-semibold text-slate-800">
                      {inv.doctorName}
                    </td>

                    <td className="p-3 font-mono">
                      <div className="text-slate-800 text-xs">{inv.date}</div>
                      <div className="text-[10px] text-slate-400">{inv.time}</div>
                    </td>

                    <td className="p-3 font-mono font-medium text-slate-500">
                      {inv.totalAmount} ج.م
                    </td>

                    <td className="p-3 font-mono font-bold text-teal-700">
                      {inv.insuranceDiscount > 0 ? `-${inv.insuranceDiscount} ج.م (80%)` : '—'}
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-900 text-xs bg-slate-50/60">
                      {inv.netPaid} ج.م
                    </td>

                    <td className="p-3 text-center">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>مسدد</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>سداد الآن</span>
                        </button>
                      )}
                    </td>

                    <td className="p-3 text-left">
                      <button
                        onClick={() => setSelectedReceipt(inv)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>عرض الإيصال</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Official Invoice Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm">إيصال سداد خدمات طبية معتمد</h3>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              
              {/* Receipt Clinic Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">CareSync Medical Center</h4>
                  <p className="text-[10px] text-slate-400 font-mono">رقم الإيصال: {selectedReceipt.invoiceNumber}</p>
                </div>
                <div className="text-left">
                  <span className="text-slate-400 block text-[10px]">تاريخ السداد</span>
                  <span className="font-mono font-bold text-slate-700">{selectedReceipt.date}</span>
                </div>
              </div>

              {/* Patient and Service Details */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">اسم المريض:</span>
                  <span className="font-bold text-slate-900">{patient?.name || 'محمد عبد الله الشريف'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الخدمة الطبية:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الطبيب / الجهة:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.doctorName} ({selectedReceipt.departmentName})</span>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>إجمالي قيمة الخدمة:</span>
                  <span className="font-mono font-semibold">{selectedReceipt.totalAmount} ج.م</span>
                </div>

                {selectedReceipt.insuranceDiscount > 0 && (
                  <div className="flex justify-between text-teal-700 font-semibold">
                    <span>خصم التغطية التأمينية (80% بوبا):</span>
                    <span className="font-mono">-{selectedReceipt.insuranceDiscount} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>المبلغ الصافي المسدد:</span>
                  <span className="font-mono text-emerald-700 text-base">{selectedReceipt.netPaid} ج.م</span>
                </div>
              </div>

              {selectedReceipt.receiptNotes && (
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 text-emerald-900 rounded-xl text-[11px]">
                  ℹ️ {selectedReceipt.receiptNotes}
                </div>
              )}

              {/* Stamp & Verification */}
              <div className="pt-2 flex items-center justify-between text-slate-400 text-[10px] border-t border-slate-100">
                <span>إيصال إلكتروني موثق من الإدارة المالية</span>
                <span className="font-mono font-bold text-emerald-600">PAID & VERIFIED</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الإيصال الرسمي</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Online Pay Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm">سداد قيمة الفاتورة أونلاين</h3>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {paySuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">تم سداد الفاتورة وتوثيق الإيصال بنجاح!</h4>
                <p className="text-xs text-slate-500">تم تسجيل الدفعة في حسابك وتأكيد موعد الكشف.</p>
              </div>
            ) : (
              <form onSubmit={handlePayConfirm} className="p-5 space-y-4 text-xs">
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] block">الخدمة المطلوب سدادها:</span>
                  <div className="font-bold text-slate-900 text-xs">{payingInvoice.title}</div>
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-200 font-bold">
                    <span className="text-slate-700">المبلغ المطلوب:</span>
                    <span className="text-emerald-700 font-mono text-sm">{payingInvoice.netPaid} ج.م</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">اختر وسيلة الدفع الإلكتروني</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod('card')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        selectedPayMethod === 'card'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      بطاقة فيزا / ماستر
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod('instapay')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        selectedPayMethod === 'instapay'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      إنستاباي (Instapay)
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod('fawry')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        selectedPayMethod === 'fawry'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      كود فوري (Fawry)
                    </button>
                  </div>
                </div>

                {selectedPayMethod === 'card' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">رقم البطاقة البنكية</label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 4092"
                        className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-left font-mono"
                        defaultValue="5240 8821 9012 4092"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">تاريخ الانتهاء</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          defaultValue="12/28"
                          className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-center font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">رمز الأمان CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          defaultValue="842"
                          maxLength={4}
                          className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-center font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayMethod === 'instapay' && (
                  <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-center space-y-1">
                    <span className="text-brand-800 font-bold block">عنوان الدفع اللحظي للمركز:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">caresync@instapay</span>
                  </div>
                )}

                {selectedPayMethod === 'fawry' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1">
                    <span className="text-amber-800 font-bold block">كود دفع فوري المرجعي:</span>
                    <span className="font-mono font-bold text-slate-900 text-base">784 920 119</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPayingInvoice(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>تأكيد سداد ({payingInvoice.netPaid} ج.م)</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
