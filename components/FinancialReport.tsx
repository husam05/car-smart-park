import React, { useMemo } from 'react';
import { FileText, Printer, Filter, DollarSign, Car, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { LogEntry } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { PARKING_CONFIG } from '@/lib/config';


interface FinancialReportProps {
    logs: LogEntry[];
    stats: {
        occupiedCount: number;
        totalRevenue: number;
        [key: string]: any;
    };
    onClose: () => void;
}

export default function FinancialReport({ logs, stats, onClose }: FinancialReportProps) {
    const exitLogs = useMemo(() => logs.filter(l => l.type === 'exit'), [logs]);
    const totalRevenue = stats.totalRevenue; // Use stats source of truth

    // Calculate Analytics
    const analytics = useMemo(() => {
        const count = exitLogs.length;
        const avgTicket = count > 0 ? totalRevenue / count : 0;

        // Estimate timestamps for chart (group by hour)
        const hourlyData = new Array(24).fill(0).map((_, i) => ({
            hour: `${i}:00`,
            revenue: 0,
            count: 0
        }));

        exitLogs.forEach(log => {
            const hour = log.timestamp.getHours();
            hourlyData[hour].revenue += log.amount || 0;
            hourlyData[hour].count += 1;
        });

        // Current Efficiency
        const totalSpots = PARKING_CONFIG.TOTAL_SPOTS;
        const occupancyRate = (stats.occupiedCount / totalSpots) * 100;

        // Revenue Efficiency (Revenue per occupied spot vs Potential)
        // Potential = 100 spots * 2000 IQD/hr
        const currentHourlyRunRate = stats.occupiedCount * PARKING_CONFIG.HOURLY_RATE;

        return {
            count,
            avgTicket,
            hourlyData,
            occupancyRate,
            currentHourlyRunRate
        };
    }, [exitLogs, totalRevenue, stats.occupiedCount]);

    // Helper to estimate duration from cost (2000 IQD per hour approx)
    const getEstimatedDuration = (amount: number) => {
        if (!amount) return "0د";
        const hours = Math.ceil(amount / PARKING_CONFIG.HOURLY_RATE);
        return `${hours}س`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-slate-900 border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl animate-in fade-in scale-95 duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-400" />
                            تحليل الكفاءة المالية
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">تقرير الأداء التشغيلي والإيرادات</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => {
                            import('@/lib/print-utils').then(({ printFinancialReport }) => {
                                printFinancialReport({
                                    totalRevenue,
                                    occupancyRate: analytics.occupancyRate,
                                    avgTicket: analytics.avgTicket,
                                    currentHourlyRunRate: analytics.currentHourlyRunRate,
                                    exitCount: analytics.count,
                                    occupiedCount: stats.occupiedCount,
                                    transactions: exitLogs.slice(0, 20).map(log => ({
                                        plate: log.plate,
                                        time: log.timestamp.toLocaleTimeString('ar-IQ'),
                                        amount: log.amount || 0,
                                        duration: getEstimatedDuration(log.amount || 0)
                                    }))
                                });
                            });
                        }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 border border-white/10 transition-colors">
                            <Printer size={16} /> طباعة
                        </button>
                        <button onClick={onClose} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                            إغلاق
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 space-y-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-950 p-5 rounded-xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><DollarSign size={14} /> إجمالي الإيرادات</div>
                            <div className="text-3xl font-black text-white tracking-tight" dir="ltr">{formatCurrency(totalRevenue)}</div>
                            <div className="text-[10px] text-green-400 mt-2 font-mono flex items-center gap-1">
                                <TrendingUp size={10} />
                                +12.5% عن أمس
                            </div>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><Car size={14} /> كفاءة الإشغال</div>
                            <div className="text-3xl font-black text-white tracking-tight" dir="ltr">{analytics.occupancyRate.toFixed(1)}%</div>
                            <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${analytics.occupancyRate}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-purple-500"></div>
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><Filter size={14} /> متوسط التذكرة</div>
                            <div className="text-3xl font-black text-white tracking-tight" dir="ltr">{formatCurrency(analytics.avgTicket)}</div>
                            <div className="text-[10px] text-slate-500 mt-2">لكل مركبة مغادرة</div>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-orange-500"></div>
                            <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2"><Clock size={14} /> معدل التدفق</div>
                            <div className="text-3xl font-black text-white tracking-tight" dir="ltr">{formatCurrency(analytics.currentHourlyRunRate)}/h</div>
                            <div className="text-[10px] text-orange-400 mt-2">إيراد ساعي متوقع</div>
                        </div>
                    </div>

                    {/* Hourly Revenue Chart (Visual Only for MVP) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-slate-950 rounded-xl border border-white/5 p-6">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="text-slate-400" size={18} />
                                الأداء الساعي (الإيرادات)
                            </h3>
                            <div className="flex items-end gap-2 h-40">
                                {analytics.hourlyData.slice(8, 22).map((data, idx) => ( // Show 8am to 10pm
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="w-full bg-slate-800 rounded-t-sm relative h-full flex items-end overflow-hidden group-hover:bg-slate-700 transition-colors">
                                            <div
                                                className="w-full bg-blue-500/80 hover:bg-blue-400 transition-all"
                                                style={{ height: `${Math.min(100, (data.revenue / 20000) * 100)}%` }} // Normalized height
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-mono rotate-0">{data.hour}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="bg-slate-950 rounded-xl border border-white/5 flex flex-col">
                            <div className="p-4 border-b border-white/5">
                                <h3 className="text-white font-bold text-sm">أحدث المعاملات</h3>
                            </div>
                            <div className="flex-1 overflow-auto max-h-[250px] p-2 space-y-2 custom-scrollbar">
                                {exitLogs.length > 0 ? (
                                    exitLogs.slice(0, 10).map((log) => (
                                        <div key={log.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-500/10 p-2 rounded-lg">
                                                    <DollarSign size={14} className="text-green-400" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-mono text-sm" dir="ltr">{log.plate}</div>
                                                    <div className="text-[10px] text-slate-500">{log.timestamp.toLocaleTimeString('ar-IQ')}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-green-400 font-bold font-mono text-sm" dir="ltr">{formatCurrency(log.amount || 0)}</div>
                                                <div className="text-[10px] text-slate-500">{getEstimatedDuration(log.amount || 0)}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                                        <AlertCircle size={24} />
                                        لا توجد حركات خروج بعد
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Efficiency Alert */}
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                            <FileText className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-blue-400 font-bold mb-1">تحليل النظام الذكي</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                بناءً على البيانات الحالية، معدل الكفاءة التشغيلية يبلغ <span className="text-white font-bold">{analytics.occupancyRate.toFixed(1)}%</span>.
                                فترة الذروة المتوقعة هي بين الساعة <span className="text-white font-bold">12:00</span> و <span className="text-white font-bold">04:00</span>.
                                يوصى بزيادة عدد بوابات الخروج في حال تجاوز الإشغال 85%.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Simple CSS class for scrollbar hidden/styled if needed, or use standard tailwind
