'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ShieldAlert, Unlock, Lock, Power, Settings, DoorOpen, DoorClosed, Zap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GateControlRef {
    openEntryGate: () => void;
    openExitGate: () => void;
    closeAllGates: () => void;
    getGateStatus: () => { entry: boolean, exit: boolean };
}

interface ControlPanelProps {
    onGateChange?: (gate: 'entry' | 'exit', isOpen: boolean) => void;
}

const ControlPanel = forwardRef<GateControlRef, ControlPanelProps>(({ onGateChange }, ref) => {
    const [entryGateOpen, setEntryGateOpen] = useState(false);
    const [exitGateOpen, setExitGateOpen] = useState(false);
    const [emergencyMode, setEmergencyMode] = useState(false);
    const [entryAutoCloseTime, setEntryAutoCloseTime] = useState<number | null>(null);
    const [exitAutoCloseTime, setExitAutoCloseTime] = useState<number | null>(null);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        openEntryGate: () => {
            if (!emergencyMode) {
                setEntryGateOpen(true);
                setEntryAutoCloseTime(5);
                onGateChange?.('entry', true);
            }
        },
        openExitGate: () => {
            if (!emergencyMode) {
                setExitGateOpen(true);
                setExitAutoCloseTime(5);
                onGateChange?.('exit', true);
            }
        },
        closeAllGates: () => {
            setEntryGateOpen(false);
            setExitGateOpen(false);
            onGateChange?.('entry', false);
            onGateChange?.('exit', false);
        },
        getGateStatus: () => ({ entry: entryGateOpen, exit: exitGateOpen })
    }));

    // Auto-close entry gate countdown
    useEffect(() => {
        if (entryGateOpen && entryAutoCloseTime !== null && entryAutoCloseTime > 0) {
            const timer = setTimeout(() => {
                setEntryAutoCloseTime(prev => prev !== null ? prev - 1 : null);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (entryAutoCloseTime === 0) {
            setEntryGateOpen(false);
            setEntryAutoCloseTime(null);
            onGateChange?.('entry', false);
        }
    }, [entryGateOpen, entryAutoCloseTime, onGateChange]);

    // Auto-close exit gate countdown
    useEffect(() => {
        if (exitGateOpen && exitAutoCloseTime !== null && exitAutoCloseTime > 0) {
            const timer = setTimeout(() => {
                setExitAutoCloseTime(prev => prev !== null ? prev - 1 : null);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (exitAutoCloseTime === 0) {
            setExitGateOpen(false);
            setExitAutoCloseTime(null);
            onGateChange?.('exit', false);
        }
    }, [exitGateOpen, exitAutoCloseTime, onGateChange]);

    const toggleEntryGate = () => {
        if (emergencyMode) return;
        const newState = !entryGateOpen;
        setEntryGateOpen(newState);
        if (newState) {
            setEntryAutoCloseTime(5);
        } else {
            setEntryAutoCloseTime(null);
        }
        onGateChange?.('entry', newState);
    };

    const toggleExitGate = () => {
        if (emergencyMode) return;
        const newState = !exitGateOpen;
        setExitGateOpen(newState);
        if (newState) {
            setExitAutoCloseTime(5);
        } else {
            setExitAutoCloseTime(null);
        }
        onGateChange?.('exit', newState);
    };

    const toggleEmergency = () => {
        const newMode = !emergencyMode;
        setEmergencyMode(newMode);
        if (newMode) {
            setEntryGateOpen(false);
            setExitGateOpen(false);
            setEntryAutoCloseTime(null);
            setExitAutoCloseTime(null);
            onGateChange?.('entry', false);
            onGateChange?.('exit', false);
        }
    };

    const GateStatusIndicator = ({ isOpen, countdown }: { isOpen: boolean, countdown: number | null }) => (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-500",
            isOpen
                ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                : "bg-slate-800 text-slate-400 border border-slate-700"
        )}>
            <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                isOpen ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" : "bg-slate-600"
            )}></div>
            {isOpen ? (
                <span className="flex items-center gap-1">
                    مفتوحة
                    {countdown !== null && <span className="text-yellow-400 ml-1">({countdown}s)</span>}
                </span>
            ) : 'مغلقة'}
        </div>
    );

    return (
        <div className="glass-card p-6 rounded-xl relative overflow-hidden">
            {/* Emergency Overlay */}
            {emergencyMode && (
                <div className="absolute inset-0 bg-red-900/20 border-2 border-red-500/50 rounded-xl pointer-events-none z-10 animate-pulse"></div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <Settings size={20} className="text-slate-400" />
                    تحكم البوابات
                </h3>
                {emergencyMode && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">
                        وضع الطوارئ
                    </span>
                )}
            </div>

            {/* Gate Status Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Entry Gate */}
                <div className={cn(
                    "p-4 rounded-xl border transition-all duration-500",
                    entryGateOpen
                        ? "bg-green-500/5 border-green-500/30"
                        : "bg-slate-900/50 border-white/5"
                )}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            {entryGateOpen ? (
                                <DoorOpen size={20} className="text-green-400" />
                            ) : (
                                <DoorClosed size={20} className="text-slate-400" />
                            )}
                            <span className="text-white font-bold text-sm">بوابة المدخل</span>
                        </div>
                        <GateStatusIndicator isOpen={entryGateOpen} countdown={entryAutoCloseTime} />
                    </div>

                    {/* Visual Gate Animation */}
                    <div className="h-8 bg-slate-950 rounded-lg mb-3 relative overflow-hidden border border-white/5">
                        <div className={cn(
                            "absolute top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700 ease-in-out",
                            entryGateOpen ? "left-0 w-1/2" : "left-1/2 w-1/2"
                        )}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-4 bg-white/30 rounded"></div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                            {entryGateOpen ? '◄ مفتوحة ►' : '► مغلقة ◄'}
                        </div>
                    </div>

                    <button
                        onClick={toggleEntryGate}
                        disabled={emergencyMode}
                        className={cn(
                            "w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm",
                            emergencyMode
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : entryGateOpen
                                    ? "bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400"
                                    : "bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-400"
                        )}
                    >
                        {entryGateOpen ? <Lock size={18} /> : <Unlock size={18} />}
                        {entryGateOpen ? 'إغلاق البوابة' : 'فتح البوابة'}
                    </button>
                </div>

                {/* Exit Gate */}
                <div className={cn(
                    "p-4 rounded-xl border transition-all duration-500",
                    exitGateOpen
                        ? "bg-blue-500/5 border-blue-500/30"
                        : "bg-slate-900/50 border-white/5"
                )}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            {exitGateOpen ? (
                                <DoorOpen size={20} className="text-blue-400" />
                            ) : (
                                <DoorClosed size={20} className="text-slate-400" />
                            )}
                            <span className="text-white font-bold text-sm">بوابة المخرج</span>
                        </div>
                        <GateStatusIndicator isOpen={exitGateOpen} countdown={exitAutoCloseTime} />
                    </div>

                    {/* Visual Gate Animation */}
                    <div className="h-8 bg-slate-950 rounded-lg mb-3 relative overflow-hidden border border-white/5">
                        <div className={cn(
                            "absolute top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-in-out",
                            exitGateOpen ? "left-0 w-1/2" : "left-1/2 w-1/2"
                        )}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-4 bg-white/30 rounded"></div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                            {exitGateOpen ? '◄ مفتوحة ►' : '► مغلقة ◄'}
                        </div>
                    </div>

                    <button
                        onClick={toggleExitGate}
                        disabled={emergencyMode}
                        className={cn(
                            "w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm",
                            emergencyMode
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : exitGateOpen
                                    ? "bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400"
                                    : "bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400"
                        )}
                    >
                        {exitGateOpen ? <Lock size={18} /> : <Unlock size={18} />}
                        {exitGateOpen ? 'إغلاق البوابة' : 'فتح البوابة'}
                    </button>
                </div>
            </div>

            {/* Emergency Button */}
            <button
                onClick={toggleEmergency}
                className={cn(
                    "w-full p-4 rounded-xl flex items-center justify-center gap-3 transition-all font-bold",
                    emergencyMode
                        ? "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        : "bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-500"
                )}
            >
                {emergencyMode ? (
                    <>
                        <Power size={20} />
                        إلغاء وضع الطوارئ
                    </>
                ) : (
                    <>
                        <ShieldAlert size={20} />
                        تفعيل إغلاق الطوارئ
                    </>
                )}
            </button>

            {/* Status Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>متحكم البوابات v2.1</span>
                <span className="flex items-center gap-1">
                    <Zap size={10} className="text-green-500" />
                    النظام جاهز
                </span>
            </div>
        </div>
    );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
