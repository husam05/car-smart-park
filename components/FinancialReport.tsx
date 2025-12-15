import React from 'react';
import { FileText, Download, Printer, Filter, DollarSign, Calendar, Car } from 'lucide-react';
import { LogEntry } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface FinancialReportProps {
    logs: LogEntry[];
    onClose: () => void;
}

export default function FinancialReport({ logs, onClose }: FinancialReportProps) {
    const exitLogs = logs.filter(l => l.type === 'exit');
    const totalRevenue = exitLogs.reduce((acc, l) => acc + (l.amount || 0), 0);
    const averageTicket = exitLogs.length > 0 ? totalRevenue / exitLogs.length : 0;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl animate-in fade-in scale-95 duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FileText className="text-blue-400" />
                            التقرير المالي
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">ملخص الإيرادات والمعاملات اليومية</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 border border-white/10 transition-colors">
                            <Printer size={16} /> طباعة
                        </button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors">
                            <Download size={16} /> تصدير CSV
                        </button>
                        <button onClick={onClose} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                            إغلاق
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><DollarSign size={14} /> إجمالي الإيرادات</div>
                            <div className="text-3xl font-mono text-green-400" dir="ltr">{formatCurrency(totalRevenue)}</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><Car size={14} /> عدد المركبات</div>
                            <div className="text-3xl font-mono text-white">{exitLogs.length}</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><Filter size={14} /> متوسط التذكرة</div>
                            <div className="text-3xl font-mono text-blue-400" dir="ltr">{formatCurrency(averageTicket)}</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><Calendar size={14} /> الفترة</div>
                            <div className="text-lg font-mono text-white mt-1">اليوم</div>
                            <div className="text-xs text-slate-500">{new Date().toLocaleDateString('ar-IQ')}</div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="bg-slate-950 rounded-xl border border-white/5 overflow-hidden">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-slate-900 text-slate-400 font-mono text-xs uppercase">
                                <tr>
                                    <th className="p-4">رقم المعاملة</th>
                                    <th className="p-4">الوقت</th>
                                    <th className="p-4">رقم اللوحة</th>
                                    <th className="p-4">المدة</th>
                                    <th className="p-4">طريقة الدفع</th>
                                    <th className="p-4 text-left">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {exitLogs.length > 0 ? (
                                    exitLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-mono text-slate-500" dir="ltr">#{log.id.toUpperCase()}</td>
                                            <td className="p-4 text-white" dir="ltr">{log.timestamp.toLocaleTimeString('ar-IQ')}</td>
                                            <td className="p-4">
                                                <span className="bg-slate-800 px-2 py-1 rounded border border-white/10 text-white font-mono" dir="ltr">
                                                    {log.plate}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-400">۱س ۲٤د</td>
                                            <td className="p-4"><span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">نقداً</span></td>
                                            <td className="p-4 text-left font-mono text-green-400" dir="ltr">{formatCurrency(log.amount || 0)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">لا توجد سجلات دفع لهذا اليوم</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
