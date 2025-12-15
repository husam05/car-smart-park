'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Network, Cpu, Wifi, HardDrive, Shield, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import DatabaseTerminal, { DbLog } from './DatabaseTerminal';

interface SystemMonitorProps {
    dbLogs: DbLog[];
}

export default function SystemMonitor({ dbLogs }: SystemMonitorProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'database' | 'network'>('overview');
    const [stats, setStats] = useState({
        cpu: 12,
        ram: 45,
        pwr: 24,
        net: 142
    });

    // Simulate fluctuating stats
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() - 0.5) * 10)),
                ram: Math.min(100, Math.max(20, prev.ram + (Math.random() - 0.5) * 5)),
                pwr: 24.1 + (Math.random() - 0.5) * 0.2,
                net: Math.max(5, prev.net + (Math.random() - 0.5) * 20)
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const StatusBadge = ({ status }: { status: 'ok' | 'warn' | 'err' }) => (
        <div className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
            status === 'ok' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                status === 'warn' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                    "bg-red-500/10 text-red-400 border border-red-500/20"
        )}>
            <div className={cn("w-1.5 h-1.5 rounded-full",
                status === 'ok' ? "bg-green-500" : status === 'warn' ? "bg-yellow-500" : "bg-red-500"
            )}></div>
            {status === 'ok' ? 'متصل' : status === 'warn' ? 'متأخر' : 'غير متصل'}
        </div>
    );

    return (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col min-h-[400px]">
            {/* Professional Header / Tabs */}
            <div className="flex border-b border-white/5 bg-slate-950/50">
                <div className="p-4 border-l border-white/5 flex items-center gap-3 w-64 shrink-0">
                    <Activity className="text-blue-400" />
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">مراقب النظام</h2>
                        <div className="text-[10px] text-slate-500 font-mono">V2.4.0 • CLUSTER-ALPHA</div>
                    </div>
                </div>
                <div className="flex-1 flex">
                    {[
                        { id: 'overview', label: 'نظرة عامة', icon: Activity },
                        { id: 'nodes', label: 'الأجهزة', icon: Server },
                        { id: 'database', label: 'قاعدة البيانات', icon: Database },
                        { id: 'network', label: 'الشبكة', icon: Network },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'overview' | 'nodes' | 'database' | 'network')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-all border-l border-white/5 hover:bg-white/5",
                                activeTab === tab.id ? "bg-blue-600/10 text-blue-400 border-b-2 border-b-blue-500" : "text-slate-400"
                            )}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 bg-slate-950/30 relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2">
                        {/* Circle Gauges */}
                        <div className="col-span-1 p-4 bg-slate-900 border border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="56" className="stroke-slate-800 fill-none" strokeWidth="8" />
                                    <circle cx="64" cy="64" r="56" className="stroke-blue-500 fill-none transition-all duration-1000 ease-out" strokeWidth="8"
                                        strokeDasharray={351}
                                        strokeDashoffset={351 - (351 * stats.cpu) / 100}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-black text-white">{Math.round(stats.cpu)}%</span>
                                    <span className="text-[10px] text-blue-400 uppercase font-bold">الحمل الكلي</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                <Cpu size={14} /> معالج الذكاء الاصطناعي
                            </div>
                        </div>

                        {/* Health Matrix */}
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            {[
                                { name: 'كاميرا الدخول', type: 'مستشعر بصري', status: 'ok', val: '24ms' },
                                { name: 'كاميرا الخروج', type: 'مستشعر بصري', status: 'ok', val: '21ms' },
                                { name: 'قاعدة البيانات', type: 'خدمة', status: 'warn', val: '142ms' },
                                { name: 'بوابة الدفع', type: 'واجهة خارجية', status: 'ok', val: '200ms' },
                                { name: 'متحكم البوابة أ', type: 'جهاز IoT', status: 'ok', val: 'متصل' },
                                { name: 'متحكم البوابة ب', type: 'جهاز IoT', status: 'ok', val: 'متصل' },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-900 border border-white/5 p-3 rounded-lg flex flex-col justify-between hover:border-white/20 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            {item.type.includes('بصري') ? <Server size={14} className="text-slate-500" /> : <Wifi size={14} className="text-slate-500" />}
                                            <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                                        </div>
                                        <StatusBadge status={item.status as 'ok' | 'warn' | 'err'} />
                                    </div>
                                    <div className="mt-4 flex justify-between items-end">
                                        <span className="text-[10px] text-slate-500 uppercase">{item.type}</span>
                                        <span className="font-mono text-xs text-white bg-slate-800 px-2 py-0.5 rounded">{item.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'database' && (
                    <div className="h-full flex flex-col gap-4 animate-in fade-in slide-in-from-right-2">
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-900 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-slate-500 text-xs uppercase font-bold">إجمالي المعاملات</div>
                                    <div className="text-2xl font-mono text-white">{dbLogs.length}</div>
                                </div>
                                <Database className="text-purple-500 opacity-50" size={32} />
                            </div>
                            <div className="flex-1 bg-slate-900 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-slate-500 text-xs uppercase font-bold">آخر مزامنة</div>
                                    <div className="text-xs font-mono text-green-400">الآن</div>
                                </div>
                                <Activity className="text-green-500 opacity-50" size={32} />
                            </div>
                            <div className="flex-1 bg-slate-900 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-slate-500 text-xs uppercase font-bold">حالة التخزين</div>
                                    <div className="text-xs font-mono text-blue-400">ممتازة</div>
                                </div>
                                <HardDrive className="text-blue-500 opacity-50" size={32} />
                            </div>
                        </div>
                        <div className="flex-1 min-h-[300px] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                            <DatabaseTerminal logs={dbLogs} />
                        </div>
                    </div>
                )}

                {/* Other tabs placeholders for this demo */}
                {(activeTab === 'nodes' || activeTab === 'network') && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-sm animate-pulse">
                        <Activity size={48} className="mb-4 text-slate-700" />
                        <div>جاري تحميل وحدة التشخيصات...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
