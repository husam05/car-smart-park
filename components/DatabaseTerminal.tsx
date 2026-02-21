'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal, Database, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DbLog {
    id: string;
    action: 'INSERT' | 'DELETE' | 'QUERY' | 'UPDATE';
    query: string;
    status: 'SUCCESS' | 'ERROR';
    timestamp: Date;
}

interface DatabaseTerminalProps {
    logs: DbLog[];
}

export default function DatabaseTerminal({ logs }: DatabaseTerminalProps) {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs flex flex-col h-64 shadow-2xl">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                    <Terminal size={14} />
                    <span className="font-bold">System Database Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] text-green-400 tracking-wider font-bold">CONNECTED</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
                {/* Scanlines Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%]"></div>

                {logs.length === 0 && (
                    <div className="text-slate-600 italic">Waiting for database transactions...</div>
                )}

                {logs.map((log) => (
                    <div key={log.id} className="animate-in slide-in-from-left-2 duration-300">
                        <div className="flex items-start gap-3 opacity-90 hover:opacity-100 transition-opacity">
                            <span className="text-slate-500 shrink-0">[{log.timestamp.toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}]</span>
                            <div className="flex-1 break-all">
                                <span className={cn(
                                    "font-bold mr-2",
                                    log.action === 'INSERT' ? "text-green-400" :
                                        log.action === 'DELETE' ? "text-red-400" :
                                            log.action === 'UPDATE' ? "text-blue-400" : "text-yellow-400"
                                )}>{log.action}</span>
                                <span className="text-slate-300">{log.query}</span>
                            </div>
                            {log.status === 'SUCCESS' ? (
                                <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                            ) : (
                                <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                            )}
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
}
