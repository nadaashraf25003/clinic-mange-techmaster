import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Calendar, 
  Printer, 
  Download, 
  CheckCircle2, 
  ArrowUpRight, 
  Building2, 
  Send,
  X,
  Wallet,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useDoctorAuth } from '../../Hooks/useDoctorAuth';

interface DoctorPaymentItem {
  id: string;
  patientName: string;
  date: string;
  time: string;
  fee: number;
  doctorShare: number; // 80%
  clinicShare: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  status: 'paid' | 'pending';
  invoiceRef: string;
}

export const DoctorPayments: React.FC = () => {
  const { currentDoctor, appointments, finances, loading, refreshDoctorData } = useDoctorAuth();

  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [transferMethod, setTransferMethod] = useState<'instapay' | 'bank' | 'cash'>('instapay');
  const [transferAccount, setTransferAccount] = useState('01012345678@instapay');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDoctorData();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Generate earnings records based on doctor's appointments
  const doctorShareRate = 0.80; // 80% to doctor, 20% clinic facility
  const doctorAppointments = appointments.filter(
    apt => !apt.doctorId || apt.doctorId === currentDoctor.id
  );

  const earningsRecords: DoctorPaymentItem[] = doctorAppointments.map((apt, index) => {
    const fee = apt.consultationFee || currentDoctor.consultationFee || 400;
    const doctorShare = Math.round(fee * doctorShareRate);
    const clinicShare = fee - doctorShare;
    const isPaid = apt.status === 'completed' || apt.paymentStatus === 'paid' || apt.paymentStatus === 'insurance_covered';

    return {
      id: `pay-${apt.id}`,
      patientName: apt.patientName || 'مريض مسجل',
      date: apt.date || '2026-10-06',
      time: apt.time || '06:00 م',
      fee,
      doctorShare,
      clinicShare,
      paymentMethod: apt.paymentStatus === 'insurance_covered' ? 'insurance' : index % 2 === 0 ? 'card' : 'cash',
      status: isPaid ? 'paid' : 'pending',
      invoiceRef: `INV-2026-${Math.floor(1000 + (index * 137) % 9000)}`
    };
  });

  // Calculate totals (preferring backend finances if available)
  const computedGross = earningsRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.fee, 0);

  const computedDoctorEarnings = earningsRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.doctorShare, 0);

  const totalDoctorEarnings = (finances?.netEarnings && finances.netEarnings > 0)
    ? finances.netEarnings
    : (finances?.totalEarnings && finances.totalEarnings > 0
        ? finances.totalEarnings
        : computedDoctorEarnings);

  const totalGrossRevenue = (finances?.totalRevenue && finances.totalRevenue > 0)
    ? finances.totalRevenue
    : (computedGross > 0 ? computedGross : Math.round(totalDoctorEarnings / 0.8));

  const pendingDoctorEarnings = earningsRecords
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.doctorShare, 0);

  const completedCount = finances?.completedConsultations 
    ?? finances?.completedVisitsCount 
    ?? earningsRecords.filter(r => r.status === 'paid').length;

  // Filter records
  const filteredRecords = earningsRecords.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              مستحقات وأرباح العيادة ({currentDoctor.name})
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              تسوية مباشرة
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة إيرادات الكشوفات، حصة الطبيب (80%)، وطلبات التحويل المالي الفوري.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="تحديث البيانات المالية"
          >
            <RefreshCw className={`w-4 h-4 ${loading || isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Wallet className="w-4 h-4 text-brand-400" />
            <span>طلب تسوية / سحب الأرباح</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Doctor Net Share */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>صافي مستحقات الطبيب</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ج.م
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {Math.round(totalDoctorEarnings).toLocaleString()} ج.م
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              نسبة 80%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            جاهزة للتسوية والتحويل الفوري
          </p>
        </div>

        {/* Total Gross Consultations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>إجمالي تحصيلات الكشوفات</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {Math.round(totalGrossRevenue).toLocaleString()} ج.م
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">
              {completedCount} كشف محصل
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            شامل الكاش والتأمين والفيزا
          </p>
        </div>

        {/* Pending Share */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>مستحقات قيد الكشف</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {Math.round(pendingDoctorEarnings).toLocaleString()} ج.م
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              بانتظار الإتمام
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            تحصيلات عند إنهاء الكشوفات
          </p>
        </div>

        {/* Doctor Consultation Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>سعر كشف العيادة الحالي</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {currentDoctor.consultationFee || 400} ج.م
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              لكل كشف
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            صافي الطبيب: {Math.round((currentDoctor.consultationFee || 400) * 0.8)} ج.م
          </p>
        </div>

      </div>

      {/* Earnings Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                dateFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع الحالات ({earningsRecords.length})
            </button>

            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                dateFilter === 'today'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              كشوفات اليوم
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالمريض أو رقم الفاتورة..."
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
                <th className="p-3">#</th>
                <th className="p-3">المريض</th>
                <th className="p-3">رقم الإيصال</th>
                <th className="p-3">التوقيت والتاريخ</th>
                <th className="p-3">قيمة الكشف</th>
                <th className="p-3 font-bold text-slate-900">صافي الطبيب (80%)</th>
                <th className="p-3">طريقة السداد</th>
                <th className="p-3 text-center">حالة التحصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    لا توجد سجلات مالية مسجلة.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 text-slate-400 font-bold text-[11px]">
                      {index + 1}
                    </td>

                    <td className="p-3 font-bold text-slate-900 text-xs">
                      {item.patientName}
                    </td>

                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {item.invoiceRef}
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-slate-800 text-xs">{item.time}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.date}</div>
                    </td>

                    <td className="p-3 font-mono font-medium text-slate-600 text-xs">
                      {item.fee} ج.م
                    </td>

                    <td className="p-3 font-mono font-bold text-emerald-700 text-xs bg-emerald-50/40">
                      +{item.doctorShare} ج.م
                    </td>

                    <td className="p-3">
                      {item.paymentMethod === 'insurance' && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-semibold border border-teal-200">
                          تأمين طبي
                        </span>
                      )}
                      {item.paymentMethod === 'cash' && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                          نقدي (كاش)
                        </span>
                      )}
                      {item.paymentMethod === 'card' && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-semibold border border-blue-200">
                          فيزا / إلكتروني
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {item.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>تم التحصيل</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>قيد الكشف</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Withdrawal / Payout Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm">طلب تسوية وتحويل الأرباح</h3>
              </div>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">تم إرسال طلب التحويل بنجاح!</h4>
                <p className="text-xs text-slate-500">
                  سيتم تحويل مبلغ <strong className="text-slate-900 font-mono">{Math.round(totalDoctorEarnings)} ج.م</strong> إلى حسابك خلال 15 دقيقة مع إشعار بالرسائل.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="p-5 space-y-4 text-xs">
                
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500 font-medium">الرصيد المتاح للسحب الآن:</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {Math.round(totalDoctorEarnings).toLocaleString()} ج.م
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">طريقة استلام المستحقات</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTransferMethod('instapay');
                        setTransferAccount('01012345678@instapay');
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        transferMethod === 'instapay'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      إنستاباي (Instapay)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTransferMethod('bank');
                        setTransferAccount('EG29000200010000001234567890');
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        transferMethod === 'bank'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      تحويل بنكي
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTransferMethod('cash');
                        setTransferAccount('الخزينة الرئيسية للاستقبال');
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        transferMethod === 'cash'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      خزينة المركز (نقدي)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {transferMethod === 'instapay' ? 'عنوان الدفع اللحظي (IPA / Mobile)' : transferMethod === 'bank' ? 'رقم الحساب البنكي / IBAN' : 'مكان الاستلام'}
                  </label>
                  <input
                    type="text"
                    value={transferAccount}
                    onChange={(e) => setTransferAccount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-left font-mono text-xs focus:border-brand-500"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>تأكيد طلب التحويل</span>
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
