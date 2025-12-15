'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Zap, Shield, Key } from 'lucide-react';
import { generateLicensePlate, cn } from '@/lib/utils';

interface CameraFeedProps {
    onVehicleDetected: (plate: string, city: string) => void;
    type: 'entry' | 'exit';
    activeVehicle?: { plate: string, city: string } | null;
    shouldReset?: boolean; // Reset camera display after vehicle enters
}

export default function CameraFeed({ onVehicleDetected, type, activeVehicle, shouldReset }: CameraFeedProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [lastPlate, setLastPlate] = useState<string | null>(null);
    const [aiStats, setAiStats] = useState<{ confidence: number; time: number } | null>(null);
    const prevVehicleRef = useRef<{ plate: string, city: string } | null>(null);

    const [manualMode, setManualMode] = useState(false);
    // Split plate state: XX - L - XXXX
    const [manualPart1, setManualPart1] = useState('');
    const [manualLetter, setManualLetter] = useState('A');
    const [manualPart2, setManualPart2] = useState('');
    const [manualCity, setManualCity] = useState('Baghdad');

    const triggerScan = (plate: string, city: string) => {
        setIsScanning(true);
        setLastPlate(null);
        setAiStats(null);
        setManualMode(false); // Close manual mode if open

        // Simulate Processing Time
        setTimeout(() => {
            setLastPlate(plate);
            setAiStats({
                confidence: 0.94 + Math.random() * 0.05,
                time: 12 + Math.floor(Math.random() * 20)
            });
            setIsScanning(false);

            // Notify Parent
            onVehicleDetected(plate, city);
        }, 1500);
    };

    // Watch for external trigger (Auto Simulation)
    useEffect(() => {
        if (activeVehicle && activeVehicle !== prevVehicleRef.current) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            triggerScan(activeVehicle.plate, activeVehicle.city);
        } else if (!activeVehicle && prevVehicleRef.current) {
            // Vehicle went from something to null - clear display
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLastPlate(null);
            setAiStats(null);
        }
        prevVehicleRef.current = activeVehicle || null;
    }, [activeVehicle]);

    // Also reset when shouldReset becomes true
    useEffect(() => {
        if (shouldReset && lastPlate) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLastPlate(null);
            setAiStats(null);
        }
    }, [shouldReset, lastPlate]);

    const handleManualSimulate = () => {
        const { code, city } = generateLicensePlate();
        triggerScan(code, city);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualPart1.length < 2 || manualPart2.length < 4) return;

        // Format: XXL-XXXX (e.g. 11A-1234)
        const fullPlate = `${manualPart1}${manualLetter}-${manualPart2}`;
        triggerScan(fullPlate.toUpperCase(), manualCity);
    };

    return (
        <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full relative group">
            {/* Model Info Overlay (Hover) */}
            <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-2 rounded text-[10px] font-mono text-green-400 border border-green-500/30" dir="ltr">
                <div>MODEL: YOLOv8-Nano</div>
                <div>INPUT: 640x640</div>
                <div>FP16: ON</div>
            </div>

            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                    <Camera className={type === 'entry' ? "text-green-400" : "text-blue-400"} size={20} />
                    <h3 className="font-semibold text-white">
                        {type === 'entry' ? 'كاميرا المدخل' : 'كاميرا المخرج'}
                    </h3>
                </div>
                <div className="flex gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] uppercase font-mono text-red-400">مباشر</span>
                </div>
            </div>

            <div className="relative flex-1 bg-black min-h-[200px] flex items-center justify-center overflow-hidden">
                {/* Viewfinder UI */}
                <div className="absolute inset-4 border border-white/10 rounded-lg z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
                </div>

                {/* Scan Line Animation */}
                {isScanning && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 blur-sm scan-line z-20"></div>
                )}

                {/* Manual Entry Form Layer */}
                {manualMode && !isScanning && (
                    <div className="absolute inset-0 z-40 bg-slate-900/95 flex flex-col items-center justify-center p-6 animate-in fade-in">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                            <Key size={16} className="text-yellow-400" />
                            إدخال اللوحة يدوياً
                        </h4>
                        <form onSubmit={handleManualSubmit} className="w-full space-y-4">
                            <div className="flex items-center gap-2 justify-center bg-black/40 p-3 rounded-xl border border-white/10" dir="ltr">
                                {/* Part 1: 2 Digits */}
                                <input
                                    type="text"
                                    maxLength={2}
                                    value={manualPart1}
                                    onChange={(e) => setManualPart1(e.target.value.replace(/\D/g, ''))}
                                    placeholder="88"
                                    className="w-12 h-12 bg-slate-800 border border-white/20 rounded-lg text-white font-mono text-xl text-center focus:border-blue-500 focus:outline-none placeholder:text-white/20"
                                    autoFocus
                                />

                                {/* Part 2: Letter Select */}
                                <div className="relative">
                                    <select
                                        value={manualLetter}
                                        onChange={(e) => setManualLetter(e.target.value)}
                                        className="w-16 h-12 bg-slate-800 border border-white/20 rounded-lg text-white font-mono text-xl text-center focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                                    >
                                        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(char => (
                                            <option key={char} value={char}>{char}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-end px-2 text-slate-400">
                                        <span className="text-[10px]">▼</span>
                                    </div>
                                </div>

                                <span className="text-white/20 font-bold">-</span>

                                {/* Part 3: 4 Digits */}
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={manualPart2}
                                    onChange={(e) => setManualPart2(e.target.value.replace(/\D/g, ''))}
                                    placeholder="1234"
                                    className="w-24 h-12 bg-slate-800 border border-white/20 rounded-lg text-white font-mono text-xl text-center focus:border-blue-500 focus:outline-none placeholder:text-white/20 tracking-widest"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button type="button" onClick={() => setManualMode(false)} className="flex-1 px-3 py-2 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 text-xs">إلغاء</button>
                                <button type="submit" className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 font-bold text-xs" disabled={manualPart1.length < 2 || manualPart2.length < 4}>تأكيد الإدخال</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Simulated Image Content */}
                {!isScanning && !manualMode && lastPlate ? (
                    <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                        <div className="absolute border-2 border-green-500 bg-green-500/10 px-4 py-2 rounded">
                            <span className="absolute -top-6 left-0 bg-green-500 text-black text-[10px] font-bold px-1 rounded-t">
                                مركبة: 99%
                            </span>
                            <div className="text-3xl font-bold font-mono text-white tracking-widest" dir="ltr">
                                {lastPlate}
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-green-400 bg-black/50 p-1 rounded" dir="ltr">
                            CONF: {(aiStats!.confidence * 100).toFixed(1)}% <br />
                            TIME: {aiStats!.time}ms <br />
                            OCR: PADDLE-OCR
                        </div>
                    </div>
                ) : !isScanning && !manualMode && (
                    <div className="text-slate-600 font-mono text-xs z-10 flex flex-col items-center gap-2">
                        <div className="w-16 h-1 bg-slate-800 rounded animate-pulse"></div>
                        <span>بانتظار المركبة...</span>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-900/50 space-y-3">
                <button
                    onClick={handleManualSimulate}
                    disabled={isScanning || manualMode}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                    {isScanning ? (
                        <span className="animate-pulse">جاري المعالجة...</span>
                    ) : (
                        <>
                            <Zap size={16} className="group-hover:text-yellow-300 transition-colors" />
                            محاكاة سريعة
                        </>
                    )}
                </button>
                <button
                    onClick={() => setManualMode(!manualMode)}
                    disabled={isScanning}
                    className="w-full text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1 transition-colors"
                >
                    <Key size={12} />
                    {manualMode ? 'إلغاء الإدخال اليدوي' : 'فشل الكاميرا؟ إدخال يدوي'}
                </button>
            </div>
        </div>
    );
}
