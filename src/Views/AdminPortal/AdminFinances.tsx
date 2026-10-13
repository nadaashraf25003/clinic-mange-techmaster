import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  FileText,
  Calendar,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../Hooks/useAdminAuth';
import { ClinicFinancialRecord } from '../../utils/types';

export const AdminFinances: React.FC = () => {
  const { financials } = useAdminAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'cash' | 'card' | 'insurance'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<ClinicFinancialRecord | null>(null);

  // Financial aggregates
  const totalRevenue = financials.reduce((sum, item) => sum + (item.status === 'paid' ? item.amount : 0), 0);
  const cashTotal = financials
    .filter(item => item.paymentMethod === 'cash' && item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const insuranceTotal = financials
    .filter(item => item.paymentMethod === 'insurance' && item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const cardTotal = financials
    .filter(item => item.paymentMethod === 'card' && item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);

  const filteredRecords = financials.filter(rec => {
    const matchesSearch = rec.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (methodFilter !== 'all' && rec.paymentMethod !== methodFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">التقارير المالية والفوترة المركزية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تسوية الخزينة، مطالبات التأمين الطبي، وإجمالي تحصيلات العيادات.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة تقرير التسوية</span>
        </button>
      </div>

      {/* Revenue Breakdown KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Collections */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
          <span className="text-xs text-slate-500">إجمالي الإيرادات المسددة</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {totalRevenue.toLocaleString()} ج.م
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% تسوية مؤكدة</span>
          </p>
        </div>

        {/* Cash Collections */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
          <span className="text-xs text-slate-500">التحصيل النقدي (كاش)</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {cashTotal.toLocaleString()} ج.م
          </div>
          <p className="text-[11px] text-slate-400">
            خزينة الاستقبال الرئيسية
          </p>
        </div>

        {/* Insurance Claims */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
          <span className="text-xs text-slate-500">مطالبات التأمين الطبي</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {insuranceTotal.toLocaleString()} ج.م
          </div>
          <p className="text-[11px] text-teal-700 font-semibold">
            شركات: بوبا، أكسا، ميدنت
          </p>
        </div>

        {/* Card / Electronic */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
          <span className="text-xs text-slate-500">المدفوعات الإلكترونية / فيزا</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {cardTotal.toLocaleString()} ج.م
          </div>
          <p className="text-[11px] text-slate-400">
            ماكينات الدفع POS & فوري
          </p>
        </div>

      </div>

      {/* Filter and Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        
        {/* Table Header & Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setMethodFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                methodFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع الفواتير ({financials.length})
            </button>

            <button
              onClick={() => setMethodFilter('cash')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                methodFilter === 'cash'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              نقدي (كاش)
            </button>

            <button
              onClick={() => setMethodFilter('insurance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                methodFilter === 'insurance'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              تأمين صحي
            </button>

            <button
              onClick={() => setMethodFilter('card')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                methodFilter === 'card'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              فيزا / بطاقة
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث برقم الفاتورة أو المريض..."
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
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
                <th className="p-3">المريض</th>
                <th className="p-3">العيادة والطبيب</th>
                <th className="p-3">المبلغ</th>
                <th className="p-3">طريقة السداد</th>
                <th className="p-3">التاريخ والتوقيت</th>
                <th className="p-3 text-center">الحالة</th>
                <th className="p-3 text-left">إيصال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  <td className="p-3 font-mono font-bold text-slate-800 text-xs">
                    {rec.invoiceNumber}
                  </td>

                  <td className="p-3 font-semibold text-slate-900">
                    {rec.patientName}
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-slate-800 text-xs">{rec.departmentName}</div>
                    <div className="text-[10px] text-slate-400">{rec.doctorName}</div>
                  </td>

                  <td className="p-3 font-bold font-mono text-slate-900 text-xs">
                    {rec.amount} ج.م
                  </td>

                  <td className="p-3">
                    {rec.paymentMethod === 'insurance' && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-semibold border border-teal-200">
                        {rec.insuranceProvider || 'تأمين طبي'}
                      </span>
                    )}
                    {rec.paymentMethod === 'cash' && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                        نقدي (كاش)
                      </span>
                    )}
                    {rec.paymentMethod === 'card' && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
                        بطاقة بنكية POS
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="text-slate-800 font-mono text-xs">{rec.time}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{rec.date}</div>
                  </td>

                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>مسدد</span>
                    </span>
                  </td>

                  <td className="p-3 text-left">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>عرض</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Invoice Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm">إيصال سداد رسوم كشف طبي</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="text-center py-2 border-b border-slate-100">
                <span className="text-[10px] text-slate-400 block font-mono">رقم الإيصال</span>
                <span className="font-bold text-sm text-slate-900 font-mono">{selectedReceipt.invoiceNumber}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">اسم المريض:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.patientName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">العيادة / القسم:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.departmentName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">الطبيب المعالج:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.doctorName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">طريقة الدفع:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.paymentMethod === 'insurance' ? selectedReceipt.insuranceProvider : selectedReceipt.paymentMethod === 'cash' ? 'نقدي (كاش)' : 'بطاقة بنكية'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">التاريخ والتوقيت:</span>
                  <span className="font-mono text-slate-700">{selectedReceipt.date} • {selectedReceipt.time}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between font-bold">
                <span className="text-emerald-900 text-xs">المبلغ الإجمالي المسدد:</span>
                <span className="text-emerald-950 font-mono text-base">{selectedReceipt.amount} ج.م</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الإيصال</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
