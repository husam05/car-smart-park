'use client';

import { useState, useMemo } from 'react';
import { LogEntry } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Printer, CheckCircle, Search, Filter, History, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function LogList({ logs }: { logs: LogEntry[] }) {
    const [filter, setFilter] = useState<'all' | 'entry' | 'exit'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [printedReceipts, setPrintedReceipts] = useState<Set<string>>(new Set());

    // Filter and Search Logic
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesFilter = filter === 'all' || log.type === filter;
            const matchesSearch = log.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [logs, filter, searchQuery]);

    const handlePrintReceipt = (log: LogEntry) => {
        setPrintedReceipts(prev => new Set(prev).add(log.id));
    };

    const isReceiptPrinted = (log: LogEntry) => {
        return log.receiptPrinted || printedReceipts.has(log.id);
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[600px] border border-white/10 shadow-xl bg-slate-900/40 backdrop-blur-md">

            {/* Header Area */}
            <div className="p-4 border-b border-white/5 bg-slate-900/60 z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <History size={18} className="text-blue-400" />
                        سجل العمليات
                    </h3>
                    <div className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded-full">
                        {filteredLogs.length}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                        type="text"
                        placeholder="بحث عن رقم لوحة أو تذكرة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                        dir="rtl"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-950/50 p-1 rounded-lg border border-white/5">
                    {(['all', 'entry', 'exit'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all capitalize",
                                filter === f
                                    ? "bg-slate-700 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            {f === 'all' ? 'الكل' : f === 'entry' ? 'دخول' : 'خروج'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar relative">
                <AnimatePresence initial={false}>
                    {filteredLogs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 py-10"
                        >
                            <Filter size={24} className="opacity-20" />
                            <span className="text-xs">لا توجد نتائج مطابقة</span>
                        </motion.div>
                    ) : (
                        filteredLogs.map((log) => (
                            <motion.div
                                key={log.id}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={cn(
                                    "p-3 rounded-xl border transition-all group relative overflow-hidden",
                                    log.type === 'entry'
                                        ? "bg-slate-800/20 border-white/5 hover:bg-slate-800/40 hover:border-green-500/20"
                                        : "bg-slate-800/10 border-white/5 hover:bg-slate-800/30 hover:border-blue-500/20"
                                )}
                            >
                                {/* Decorative side bar */}
                                <div className={cn(
                                    "absolute top-0 right-0 w-1 h-full",
                                    log.type === 'entry' ? "bg-green-500/50" : "bg-blue-500/50"
                                )}></div>

                                <div className="flex items-start justify-between pr-3">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "mt-0.5 p-1.5 rounded-lg border border-white/5",
                                            log.type === 'entry' ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                                        )}>
                                            {log.type === 'entry' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                        </div>
                                        <div>
                                            <div className="text-white font-mono text-sm font-bold tracking-tight" dir="ltr">
                                                {log.plate}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={cn(
                                                    "text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/5",
                                                    log.type === 'entry' ? "bg-green-500/10 text-green-300" : "bg-blue-500/10 text-blue-300"
                                                )}>
                                                    {log.type === 'entry' ? 'دخول' : 'خروج'}
                                                </span>
                                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {log.timestamp.toLocaleTimeString('ar-IQ', { hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-left flex flex-col items-end">
                                        {log.amount ? (
                                            <span className="font-mono text-green-400 font-bold text-sm" dir="ltr">
                                                {formatCurrency(log.amount)}
                                            </span>
                                        ) : (
                                            <span className="font-mono text-slate-600 text-[10px] uppercase">Ticket</span>
                                        )}

                                        {/* Status Icon */}
                                        <div className="mt-1">
                                            {isReceiptPrinted(log) ? (
                                                <CheckCircle size={12} className="text-green-500/50" />
                                            ) : (
                                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions (Hover) */}
                                {!isReceiptPrinted(log) && (
                                    <motion.button
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        onClick={() => handlePrintReceipt(log)}
                                        className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 hover:text-white transition-colors border border-white/5"
                                    >
                                        <Printer size={12} />
                                        {log.type === 'entry' ? 'طباعة الوصل' : 'تأكيد المخالصة'}
                                    </motion.button>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Footer gradient */}
            <div className="h-4 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none absolute bottom-0 w-full"></div>
        </div>
    );
}
