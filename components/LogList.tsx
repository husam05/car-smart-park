'use client';

import { useState } from 'react';
import { LogEntry } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, ArrowLeft, Printer, CheckCircle } from 'lucide-react';

export default function LogList({ logs }: { logs: LogEntry[] }) {
    const [printedReceipts, setPrintedReceipts] = useState<Set<string>>(new Set());

    const handlePrintReceipt = (log: LogEntry) => {
        // Mark as printed
        setPrintedReceipts(prev => new Set(prev).add(log.id));

        // Could trigger actual print here
        // window.print();
    };

    const isReceiptPrinted = (log: LogEntry) => {
        return log.receiptPrinted || printedReceipts.has(log.id);
    };

    return (
        <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-white/10 bg-slate-900/50">
                <h3 className="text-white font-semibold">سجل الدخول/الخروج</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {logs.length === 0 ? (
                    <div className="text-center text-slate-500 py-10">لا يوجد نشاط مسجل</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${log.type === 'entry' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {log.type === 'entry' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-mono text-sm uppercase" dir="ltr">{log.plate}</div>
                                        <div className="text-slate-500 text-xs">
                                            {log.type === 'entry' ? 'دخول' : 'خروج'} • {log.timestamp.toLocaleTimeString('ar-IQ')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isReceiptPrinted(log) && (
                                        <CheckCircle size={14} className="text-green-400" />
                                    )}
                                    {log.amount && (
                                        <div className="text-green-400 font-mono text-sm" dir="ltr">
                                            {formatCurrency(log.amount)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Print Receipt Button - Only if not already printed */}
                            {!isReceiptPrinted(log) && (
                                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                                    <button
                                        onClick={() => handlePrintReceipt(log)}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${log.type === 'entry'
                                                ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-500/30'
                                                : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30'
                                            }`}
                                    >
                                        <Printer size={14} />
                                        {log.type === 'entry' ? 'طباعة وصل الدخول' : 'تأكيد الدفع وطباعة الوصل'}
                                    </button>

                                    <div className="text-slate-500 text-[10px]">
                                        #{log.id}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
