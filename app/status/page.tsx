'use client';

import Link from 'next/link';
import { ArrowLeft, Activity, Server } from 'lucide-react';
import SystemMonitor from '@/components/SystemMonitor';
import ArchitectureView from '@/components/ArchitectureView';
import { useParkingSystem } from '@/hooks/useParkingSystem';

export default function SystemStatusPage() {
    const { logs, stats } = useParkingSystem();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col gap-6" dir="rtl">
            <header className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md sticky top-4 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/" className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-colors">
                        <ArrowLeft className="text-white w-6 h-6 rotate-180" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                            حالة <span className="text-purple-500">النظام</span>
                        </h1>
                        <p className="text-xs text-slate-400 font-mono tracking-widest">التشخيصات الكاملة والهيكلية</p>
                    </div>
                </div>
            </header>

            {/* System Monitor Section */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <SystemMonitor logs={logs} stats={stats} />
            </div>

            {/* Architecture Section */}
            <ArchitectureView />
        </main>
    );
}
