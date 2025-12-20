'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Network, Cpu, Wifi, HardDrive, Shield, AlertTriangle, CheckCircle, Terminal, Globe, Zap, Clock } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { LogEntry } from '@/types';

interface SystemMonitorProps {
    logs: LogEntry[];
    stats?: {
        occupiedCount: number;
        [key: string]: any;
    };
}

export default function SystemMonitor({ logs, stats }: SystemMonitorProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'database' | 'network'>('overview');
    const [systemStats, setSystemStats] = useState({
        cpu: 12,
        ram: 45,
        pwr: 24,
        net: 142,
        fps: 30
    });

    // Simulate fluctuating stats
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemStats(prev => ({
                cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() - 0.5) * 10)),
                ram: Math.min(100, Math.max(20, prev.ram + (Math.random() - 0.5) * 5)),
                pwr: 24.1 + (Math.random() - 0.5) * 0.2,
                net: Math.max(5, prev.net + (Math.random() - 0.5) * 20),
                fps: Math.max(25, Math.min(60, prev.fps + (Math.random() - 0.5) * 5))
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
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse",
                status === 'ok' ? "bg-green-500" : status === 'warn' ? "bg-yellow-500" : "bg-red-500"
            )}></div>
            {status === 'ok' ? 'متصل' : status === 'warn' ? 'متأخر' : 'منقطع'}
        </div>
    );

    return (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col min-h-[500px] shadow-2xl">
            {/* Professional Header / Tabs */}
            <div className="flex border-b border-white/5 bg-slate-950/50">
                <div className="p-4 border-l border-white/5 flex items-center gap-3 w-64 shrink-0 bg-slate-900/50">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Activity className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">مراقب النظام</h2>
                        <div className="text-[10px] text-slate-500 font-mono">V2.5.0 • CORE-ACTIVE</div>
                    </div>
                </div>
                <div className="flex-1 flex overflow-x-auto">
                    {[
                        { id: 'overview', label: 'نظرة عامة', icon: Activity },
                        { id: 'nodes', label: 'الأجهزة', icon: Server },
                        { id: 'database', label: 'قاعدة البيانات', icon: Database },
                        { id: 'network', label: 'الشبكة', icon: Network },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-all border-l border-white/5 hover:bg-white/5 min-w-[120px]",
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
            <div className="flex-1 p-6 bg-slate-950/30 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2">
                        {/* Circle Gauges */}
                        <div className="col-span-1 p-6 bg-slate-900 border border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/30 transition-all">
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>

                            {/* CPU Gauge */}
                            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="56" className="stroke-slate-800 fill-none" strokeWidth="8" />
                                    <circle cx="64" cy="64" r="56" className="stroke-blue-500 fill-none transition-all duration-500 ease-out" strokeWidth="8"
                                        strokeDasharray={351}
                                        strokeDashoffset={351 - (351 * systemStats.cpu) / 100}
                                        strokeLinecap="round"
                                    />
                                    {/* Inner Ring */}
                                    <circle cx="64" cy="64" r="40" className="stroke-slate-800 fill-none" strokeWidth="4" />
                                    <circle cx="64" cy="64" r="40" className="stroke-purple-500 fill-none transition-all duration-500 ease-out opacity-50" strokeWidth="4"
                                        strokeDasharray={251}
                                        strokeDashoffset={251 - (251 * systemStats.ram) / 100}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-black text-white">{Math.round(systemStats.cpu)}%</span>
                                    <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">CPU LOAD</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full text-[10px] uppercase font-bold text-slate-500 text-center">
                                <div>
                                    <span className="block text-purple-400 text-lg">{Math.round(systemStats.ram)}%</span>
                                    MEMORY
                                </div>
                                <div>
                                    <span className="block text-green-400 text-lg">{Math.round(systemStats.fps)}</span>
                                    FPS AI
                                </div>
                            </div>
                        </div>

                        {/* Health Matrix */}
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            {[
                                { name: 'بوابة الدخول (Entry)', type: 'LPR Camera', status: 'ok', val: `${Math.round(systemStats.net)}ms` },
                                { name: 'بوابة الخروج (Exit)', type: 'LPR Camera', status: 'ok', val: `${Math.round(systemStats.net * 0.9)}ms` },
                                { name: 'Core Database', type: 'PostgreSQL', status: (logs.length > 50 ? 'warn' : 'ok'), val: 'SYNCED' },
                                { name: 'Payment Gateway', type: 'External API', status: 'ok', val: 'READY' },
                                { name: 'Gate Controller A', type: 'IoT Device', status: 'ok', val: 'ONLINE' },
                                { name: 'Environment Sensors', type: 'IoT Cluster', status: 'ok', val: 'ACTIVE' },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-900 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/20 hover:bg-white/5 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            {item.type.includes('Camera') ?
                                                <Server size={14} className="text-blue-500" /> :
                                                item.type.includes('SQL') ?
                                                    <Database size={14} className="text-purple-500" /> :
                                                    <Wifi size={14} className="text-green-500" />
                                            }
                                            <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                                        </div>
                                        <StatusBadge status={item.status as any} />
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                                        <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                                            <Shield size={10} /> {item.type}
                                        </span>
                                        <span className="font-mono text-[10px] text-white bg-slate-800 px-2 py-0.5 rounded border border-white/5">{item.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'database' && (
                    <div className="h-full flex flex-col gap-4 animate-in fade-in slide-in-from-right-2">
                        {/* Stats Row */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-900 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-slate-500 text-xs uppercase font-bold">إجمالي السجلات (Records)</div>
                                    <div className="text-2xl font-mono text-white tracking-tight">{logs.length}</div>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <Database className="text-purple-500" size={24} />
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-900 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-slate-500 text-xs uppercase font-bold">وقت الاستجابة (Latency)</div>
                                    <div className="text-2xl font-mono text-green-400 tracking-tight">{Math.round(5 + Math.random() * 10)}ms</div>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <Zap className="text-green-500" size={24} />
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-900 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-slate-500 text-xs uppercase font-bold">آخر عملية (Last Op)</div>
                                    <div className="text-2xl font-mono text-blue-400 tracking-tight">
                                        {logs.length > 0 ? logs[0].timestamp.toLocaleTimeString('en-US', { hour12: false }) : '--:--'}
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <Clock className="text-blue-500" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Terminal Simulation */}
                        <div className="flex-1 bg-black rounded-xl border border-slate-800 overflow-hidden flex flex-col font-mono text-xs shadow-inner relative">
                            <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center gap-2 text-slate-400">
                                <Terminal size={12} />
                                <span>postgres@cluster-main:~</span>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto space-y-1 text-slate-300">
                                <div className="text-slate-500"># Listening for incoming transaction stream...</div>
                                {logs.map((log) => (
                                    <div key={log.id} className="flex gap-2 border-l-2 border-transparent hover:border-blue-500 pl-2 transition-colors">
                                        <span className="text-slate-500">[{log.timestamp.toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })}]</span>
                                        <span className={log.type === 'entry' ? 'text-green-400' : 'text-blue-400'}>
                                            {log.type === 'entry' ? 'INSERT INTO entries' : 'UPDATE exits'}
                                        </span>
                                        <span className="text-yellow-200/70">
                                            plat="{log.plate}"
                                        </span>
                                        <span className="text-slate-500">
                                            id={log.id}
                                        </span>
                                        {log.amount && <span className="text-green-500">amount={log.amount}</span>}
                                    </div>
                                ))}
                                <div className="animate-pulse text-blue-500">_</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'network' && (
                    <div className="h-full flex items-center justify-center relative">
                        {/* Fake Network Graph Visualization */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <div className="w-64 h-64 border border-blue-500/30 rounded-full animate-ping [animation-duration:3s]"></div>
                            <div className="w-48 h-48 border border-green-500/30 rounded-full animate-ping [animation-duration:2s] absolute"></div>
                        </div>
                        <div className="z-10 bg-slate-900/80 p-6 rounded-xl border border-white/10 backdrop-blur text-center">
                            <Globe className="mx-auto text-blue-400 mb-4 animate-spin [animation-duration:10s]" size={48} />
                            <h3 className="text-xl font-bold text-white mb-2">Network Topology Active</h3>
                            <p className="text-slate-400 text-xs font-mono">
                                Inbound Traffic: {formatCurrency(systemStats.net * 1024)}/s <br />
                                Latency: {Math.round(systemStats.net)}ms
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'nodes' && (
                    <div className="h-full flex flex-col gap-4 overflow-y-auto">
                        {['Node-01 (Entry Cam)', 'Node-02 (Exit Cam)', 'Node-03 (Display)', 'Node-04 (Admin UI)'].map((node, i) => (
                            <div key={i} className="bg-slate-900 p-4 rounded-lg flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-white font-bold">{node}</span>
                                </div>
                                <div className="text-xs font-mono text-slate-400">
                                    Uptime: {Math.floor(Math.random() * 100)}h • CPU: {Math.floor(Math.random() * 30)}%
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
