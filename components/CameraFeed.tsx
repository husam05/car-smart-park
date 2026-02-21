'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Zap, Key, Video, MonitorPlay, Wifi, WifiOff, Loader2, Settings, Usb, Globe } from 'lucide-react';
import { generateLicensePlate, cn } from '@/lib/utils';
import { PARKING_CONFIG } from '@/lib/config';
import {
    detectPlate,
    detectFromIPCamera,
    checkDetectionHealth,
    captureFrame,
    parseIraqiPlate,
    shouldAutoAccept,
    shouldDiscard,
    listCameraDevices,
    DEFAULT_CAMERA_SETTINGS,
    type DetectionMode,
    type DetectionResponse,
    type CameraSettings,
    type CameraDevice,
} from '@/lib/plate-detection';

interface CameraFeedProps {
    onVehicleDetected: (plate: string, city: string) => void;
    type: 'entry' | 'exit';
    activeVehicle?: { plate: string, city: string } | null;
    shouldReset?: boolean;
}

export default function CameraFeed({ onVehicleDetected, type, activeVehicle, shouldReset }: CameraFeedProps) {
    // --- Simulation state (preserved) ---
    const [isScanning, setIsScanning] = useState(false);
    const [lastPlate, setLastPlate] = useState<string | null>(null);
    const [aiStats, setAiStats] = useState<{ confidence: number; time: number } | null>(null);
    const prevVehicleRef = useRef<{ plate: string, city: string } | null>(null);

    const [manualMode, setManualMode] = useState(false);
    const [manualPart1, setManualPart1] = useState('');
    const [manualLetter, setManualLetter] = useState('A');
    const [manualPart2, setManualPart2] = useState('');
    const [manualCity, setManualCity] = useState('Baghdad');

    // --- Camera mode state ---
    const [detectionMode, setDetectionMode] = useState<DetectionMode>('simulation');
    const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const detectingRef = useRef(false);
    const [pendingReview, setPendingReview] = useState<{
        text: string; city: string; confidence: number; time: number;
    } | null>(null);

    // --- Camera settings state ---
    const [showSettings, setShowSettings] = useState(false);
    const [cameraSettings, setCameraSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS);
    const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // --- Simulation: triggerScan (preserved) ---
    const triggerScan = (plate: string, city: string) => {
        setIsScanning(true);
        setLastPlate(null);
        setAiStats(null);
        setManualMode(false);

        setTimeout(() => {
            setLastPlate(plate);
            setAiStats({
                confidence: 0.94 + Math.random() * 0.05,
                time: 12 + Math.floor(Math.random() * 20)
            });
            setIsScanning(false);
            onVehicleDetected(plate, city);
        }, 1500);
    };

    // --- Simulation: Watch for external trigger ---
    useEffect(() => {
        if (activeVehicle && activeVehicle !== prevVehicleRef.current) {
            triggerScan(activeVehicle.plate, activeVehicle.city);
        } else if (!activeVehicle && prevVehicleRef.current) {
            setLastPlate(null);
            setAiStats(null);
        }
        prevVehicleRef.current = activeVehicle || null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeVehicle]);

    // --- Simulation: Reset when shouldReset ---
    useEffect(() => {
        if (shouldReset && lastPlate) {
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
        const fullPlate = `${manualPart1}${manualLetter}-${manualPart2}`;
        triggerScan(fullPlate.toUpperCase(), manualCity);
    };

    // --- Camera: Check backend health on mode switch ---
    useEffect(() => {
        if (detectionMode === 'camera') {
            setBackendOnline(null);
            checkDetectionHealth().then(setBackendOnline);
        }
    }, [detectionMode]);

    // --- Camera: Enumerate USB devices when settings open ---
    const refreshDevices = useCallback(async () => {
        setLoadingDevices(true);
        const devices = await listCameraDevices();
        setAvailableDevices(devices);
        setLoadingDevices(false);
    }, []);

    useEffect(() => {
        if (showSettings && cameraSettings.source === 'usb') {
            refreshDevices();
        }
    }, [showSettings, cameraSettings.source, refreshDevices]);

    // --- Camera: Start/stop webcam ---
    const startCamera = useCallback(async () => {
        // IP camera mode doesn't use getUserMedia
        if (cameraSettings.source === 'ip') {
            if (!cameraSettings.ipUrl) {
                setCameraError('أدخل رابط الكاميرا في الإعدادات');
                return;
            }
            setCameraActive(true);
            setCameraError(null);
            return;
        }

        // USB camera mode
        try {
            setCameraError(null);
            const constraints: MediaStreamConstraints = {
                video: cameraSettings.usbDeviceId
                    ? { deviceId: { exact: cameraSettings.usbDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
                    : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            setCameraActive(true);
            // srcObject is set via useEffect after video element renders
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Camera access denied';
            setCameraError(message);
            setCameraActive(false);
        }
    }, [cameraSettings]);

    // --- Camera: Attach stream to video element after it renders ---
    useEffect(() => {
        if (cameraActive && cameraSettings.source === 'usb' && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [cameraActive, cameraSettings.source]);

    const stopCamera = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
        detectingRef.current = false;
    }, []);

    // Cleanup on unmount or mode switch
    useEffect(() => {
        if (detectionMode !== 'camera') {
            stopCamera();
        }
        return () => stopCamera();
    }, [detectionMode, stopCamera]);

    // --- Camera: Detection loop ---
    const startDetectionLoop = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            if (detectingRef.current) return;

            detectingRef.current = true;
            try {
                let response: DetectionResponse;

                if (cameraSettings.source === 'ip') {
                    // IP camera: server-side frame capture
                    response = await detectFromIPCamera(cameraSettings.ipUrl);
                } else {
                    // USB: client-side frame capture
                    if (!videoRef.current || !canvasRef.current) return;
                    const base64 = captureFrame(videoRef.current, canvasRef.current);
                    if (!base64) return;
                    response = await detectPlate(base64);
                }

                if (response.plates.length > 0) {
                    const best = response.plates.reduce((a, b) =>
                        a.confidence > b.confidence ? a : b
                    );

                    if (shouldDiscard(best.confidence)) {
                        return; // Too low, keep scanning
                    }

                    const { code, city } = parseIraqiPlate(best.text);

                    if (shouldAutoAccept(best.confidence)) {
                        // High confidence: auto-accept
                        setLastPlate(code);
                        setAiStats({ confidence: best.confidence, time: response.inference_time_ms });
                        onVehicleDetected(code, city);
                        // Stop loop after successful detection
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                    } else {
                        // Medium confidence: manual review
                        setPendingReview({
                            text: code, city,
                            confidence: best.confidence,
                            time: response.inference_time_ms,
                        });
                        // Pause loop during review
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                    }
                }
            } catch {
                // Skip this frame on error, loop continues
            } finally {
                detectingRef.current = false;
            }
        }, PARKING_CONFIG.AI_DETECTION_INTERVAL_MS);
    }, [onVehicleDetected, cameraSettings]);

    const acceptPendingReview = () => {
        if (!pendingReview) return;
        setLastPlate(pendingReview.text);
        setAiStats({ confidence: pendingReview.confidence, time: pendingReview.time });
        onVehicleDetected(pendingReview.text, pendingReview.city);
        setPendingReview(null);
    };

    const rejectPendingReview = () => {
        setPendingReview(null);
        startDetectionLoop();
    };

    const isEntry = type === 'entry';

    return (
        <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full relative group">
            {/* Model Info Overlay (Hover) */}
            <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-2 rounded text-[10px] font-mono text-green-400 border border-green-500/30" dir="ltr">
                <div>MODEL: YOLOv8 + CRNN</div>
                <div>INPUT: 640x640</div>
                <div>MODE: {detectionMode === 'camera' ? 'LIVE' : 'SIM'}</div>
            </div>

            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                    <Camera className={isEntry ? "text-green-400" : "text-blue-400"} size={20} />
                    <h3 className="font-semibold text-white">
                        {isEntry ? 'كاميرا المدخل' : 'كاميرا المخرج'}
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

            {/* Mode Toggle Bar */}
            <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between bg-black/30">
                <div className="flex gap-1">
                    <button
                        onClick={() => setDetectionMode('simulation')}
                        className={cn(
                            "px-2.5 py-1 rounded text-[10px] font-mono transition-all flex items-center gap-1",
                            detectionMode === 'simulation'
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                        )}
                    >
                        <MonitorPlay size={10} />
                        محاكاة
                    </button>
                    <button
                        onClick={() => setDetectionMode('camera')}
                        className={cn(
                            "px-2.5 py-1 rounded text-[10px] font-mono transition-all flex items-center gap-1",
                            detectionMode === 'camera'
                                ? "bg-green-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                        )}
                    >
                        <Video size={10} />
                        كاميرا حية
                    </button>
                </div>
                {detectionMode === 'camera' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setShowSettings(!showSettings); if (!showSettings) stopCamera(); }}
                            className={cn(
                                "p-1 rounded transition-colors",
                                showSettings ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                            )}
                        >
                            <Settings size={12} />
                        </button>
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                            {backendOnline === null ? (
                                <Loader2 size={10} className="animate-spin text-yellow-400" />
                            ) : backendOnline ? (
                                <Wifi size={10} className="text-green-400" />
                            ) : (
                                <WifiOff size={10} className="text-red-400" />
                            )}
                            <span className={cn(
                                backendOnline === null ? "text-yellow-400" : backendOnline ? "text-green-400" : "text-red-400"
                            )}>
                                {backendOnline === null ? 'فحص...' : backendOnline ? 'AI متصل' : 'AI غير متصل'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main View Area */}
            <div className="relative flex-1 bg-black min-h-[200px] flex items-center justify-center overflow-hidden">
                {/* Viewfinder UI (always visible) */}
                <div className="absolute inset-4 border border-white/10 rounded-lg z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
                </div>

                {/* Scan Line Animation */}
                {(isScanning || detectingRef.current) && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 blur-sm scan-line z-20"></div>
                )}

                {/* ===== SIMULATION MODE ===== */}
                {detectionMode === 'simulation' && (
                    <>
                        {/* Manual Entry Form */}
                        {manualMode && !isScanning && (
                            <div className="absolute inset-0 z-40 bg-slate-900/95 flex flex-col items-center justify-center p-6 animate-in fade-in">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                                    <Key size={16} className="text-yellow-400" />
                                    إدخال اللوحة يدوياً
                                </h4>
                                <form onSubmit={handleManualSubmit} className="w-full space-y-4">
                                    <div className="flex items-center gap-2 justify-center bg-black/40 p-3 rounded-xl border border-white/10" dir="ltr">
                                        <input type="text" maxLength={2} value={manualPart1}
                                            onChange={(e) => setManualPart1(e.target.value.replace(/\D/g, ''))}
                                            placeholder="88"
                                            className="w-12 h-12 bg-slate-800 border border-white/20 rounded-lg text-white font-mono text-xl text-center focus:border-blue-500 focus:outline-none placeholder:text-white/20"
                                            autoFocus />
                                        <div className="relative">
                                            <select value={manualLetter} onChange={(e) => setManualLetter(e.target.value)}
                                                className="w-16 h-12 bg-slate-800 border border-white/20 rounded-lg text-white font-mono text-xl text-center focus:border-blue-500 focus:outline-none appearance-none cursor-pointer">
                                                {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(char => (
                                                    <option key={char} value={char}>{char}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-0 pointer-events-none flex items-center justify-end px-2 text-slate-400">
                                                <span className="text-[10px]">▼</span>
                                            </div>
                                        </div>
                                        <span className="text-white/20 font-bold">-</span>
                                        <input type="text" maxLength={4} value={manualPart2}
                                            onChange={(e) => setManualPart2(e.target.value.replace(/\D/g, ''))}
                                            placeholder="1234"
                                            className="w-24 h-12 bg-slate-800 border border-white/20 rounded-lg text-white font-mono text-xl text-center focus:border-blue-500 focus:outline-none placeholder:text-white/20 tracking-widest" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setManualMode(false)} className="flex-1 px-3 py-2 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 text-xs">إلغاء</button>
                                        <button type="submit" className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 font-bold text-xs" disabled={manualPart1.length < 2 || manualPart2.length < 4}>تأكيد الإدخال</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Simulated Detection Result */}
                        {!isScanning && !manualMode && lastPlate ? (
                            <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                                <div className="absolute border-2 border-green-500 bg-green-500/10 px-4 py-2 rounded">
                                    <span className="absolute -top-6 left-0 bg-green-500 text-black text-[10px] font-bold px-1 rounded-t">
                                        مركبة: {aiStats ? `${(aiStats.confidence * 100).toFixed(1)}%` : '99%'}
                                    </span>
                                    <div className="text-3xl font-bold font-mono text-white tracking-widest" dir="ltr">
                                        {lastPlate}
                                    </div>
                                </div>
                                {aiStats && (
                                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-green-400 bg-black/50 p-1 rounded" dir="ltr">
                                        CONF: {(aiStats.confidence * 100).toFixed(1)}% <br />
                                        TIME: {aiStats.time.toFixed(0)}ms <br />
                                        MODEL: SIMULATION
                                    </div>
                                )}
                            </div>
                        ) : !isScanning && !manualMode && (
                            <div className="text-slate-600 font-mono text-xs z-10 flex flex-col items-center gap-2">
                                <div className="w-16 h-1 bg-slate-800 rounded animate-pulse"></div>
                                <span>بانتظار المركبة...</span>
                            </div>
                        )}
                    </>
                )}

                {/* ===== CAMERA MODE ===== */}
                {detectionMode === 'camera' && (
                    <>
                        {/* Settings Panel */}
                        {showSettings && (
                            <div className="absolute inset-0 z-50 bg-slate-900/98 flex flex-col p-4 animate-in fade-in overflow-auto" dir="rtl">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                                    <Settings size={16} className="text-blue-400" />
                                    إعدادات الكاميرا
                                </h4>

                                {/* Source Type */}
                                <div className="mb-4">
                                    <label className="text-xs text-slate-400 mb-2 block">مصدر الكاميرا</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCameraSettings(s => ({ ...s, source: 'usb' }))}
                                            className={cn(
                                                "flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border",
                                                cameraSettings.source === 'usb'
                                                    ? "bg-blue-600 text-white border-blue-500"
                                                    : "bg-slate-800 text-slate-400 border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <Usb size={14} />
                                            USB / ويب كام
                                        </button>
                                        <button
                                            onClick={() => setCameraSettings(s => ({ ...s, source: 'ip' }))}
                                            className={cn(
                                                "flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border",
                                                cameraSettings.source === 'ip'
                                                    ? "bg-purple-600 text-white border-purple-500"
                                                    : "bg-slate-800 text-slate-400 border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <Globe size={14} />
                                            كاميرا IP
                                        </button>
                                    </div>
                                </div>

                                {/* USB Device Selector */}
                                {cameraSettings.source === 'usb' && (
                                    <div className="mb-4">
                                        <label className="text-xs text-slate-400 mb-2 block">اختيار الكاميرا</label>
                                        {loadingDevices ? (
                                            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                                                <Loader2 size={12} className="animate-spin" />
                                                جاري البحث عن الكاميرات...
                                            </div>
                                        ) : (
                                            <>
                                                <select
                                                    value={cameraSettings.usbDeviceId}
                                                    onChange={(e) => setCameraSettings(s => ({ ...s, usbDeviceId: e.target.value }))}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="">الكاميرا الافتراضية</option>
                                                    {availableDevices.map(d => (
                                                        <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                                                    ))}
                                                </select>
                                                <button onClick={refreshDevices}
                                                    className="mt-2 text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
                                                    تحديث قائمة الكاميرات
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* IP Camera URL */}
                                {cameraSettings.source === 'ip' && (
                                    <div className="mb-4">
                                        <label className="text-xs text-slate-400 mb-2 block">رابط الكاميرا</label>
                                        <input
                                            type="text"
                                            value={cameraSettings.ipUrl}
                                            onChange={(e) => setCameraSettings(s => ({ ...s, ipUrl: e.target.value }))}
                                            placeholder="rtsp://192.168.1.100:554/stream"
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
                                            dir="ltr"
                                        />
                                        <div className="mt-2 space-y-1">
                                            <p className="text-[10px] text-slate-500">أمثلة للروابط المدعومة:</p>
                                            <p className="text-[10px] text-slate-600 font-mono" dir="ltr">rtsp://user:pass@192.168.1.100:554/stream</p>
                                            <p className="text-[10px] text-slate-600 font-mono" dir="ltr">http://192.168.1.100:8080/video</p>
                                        </div>
                                    </div>
                                )}

                                {/* Close Settings */}
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors mt-auto"
                                >
                                    حفظ وإغلاق
                                </button>
                            </div>
                        )}

                        {/* Live Video Feed - always mounted for ref stability */}
                        <video ref={videoRef} autoPlay playsInline muted
                            className={cn(
                                "w-full h-full object-cover",
                                (cameraActive && cameraSettings.source === 'usb') ? "block" : "hidden"
                            )} />
                        {cameraActive && cameraSettings.source === 'ip' && (
                            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-2">
                                <Globe size={32} className="text-purple-400" />
                                <span className="text-xs text-purple-300 font-mono">IP Camera</span>
                                <span className="text-[10px] text-slate-500 font-mono" dir="ltr">{cameraSettings.ipUrl}</span>
                            </div>
                        )}
                        {!cameraActive && !showSettings && (
                            <div className="text-slate-600 font-mono text-xs z-10 flex flex-col items-center gap-3">
                                <Camera size={32} className="text-slate-700" />
                                <span>{cameraError || 'اضغط لتشغيل الكاميرا'}</span>
                                {cameraError && (
                                    <span className="text-red-400 text-[10px]">{cameraError}</span>
                                )}
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Detecting Indicator */}
                        {cameraActive && !lastPlate && !pendingReview && (
                            <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-green-400 font-mono flex items-center gap-1 z-20">
                                <Loader2 size={10} className="animate-spin" />
                                جاري الكشف...
                            </div>
                        )}

                        {/* Detected Plate Result */}
                        {lastPlate && aiStats && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                <div className="border-2 border-green-500 bg-green-500/10 px-4 py-2 rounded">
                                    <span className="absolute -top-6 left-0 bg-green-500 text-black text-[10px] font-bold px-1 rounded-t">
                                        لوحة: {(aiStats.confidence * 100).toFixed(1)}%
                                    </span>
                                    <div className="text-3xl font-bold font-mono text-white tracking-widest" dir="ltr">
                                        {lastPlate}
                                    </div>
                                </div>
                                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-green-400 bg-black/50 p-1 rounded" dir="ltr">
                                    CONF: {(aiStats.confidence * 100).toFixed(1)}% <br />
                                    TIME: {aiStats.time.toFixed(0)}ms <br />
                                    MODEL: YOLOv8+CRNN
                                </div>
                            </div>
                        )}

                        {/* Pending Review Overlay */}
                        {pendingReview && (
                            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 z-40 animate-in fade-in">
                                <div className="text-yellow-400 text-xs mb-2 font-bold">ثقة منخفضة - مراجعة يدوية</div>
                                <div className="text-3xl font-bold font-mono text-white mb-1" dir="ltr">
                                    {pendingReview.text}
                                </div>
                                <div className="text-xs text-slate-400 mb-1">{pendingReview.city}</div>
                                <div className="text-xs text-slate-500 mb-4 font-mono">
                                    {(pendingReview.confidence * 100).toFixed(1)}% | {pendingReview.time.toFixed(0)}ms
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={acceptPendingReview}
                                        className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition-colors">
                                        قبول
                                    </button>
                                    <button onClick={rejectPendingReview}
                                        className="px-5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors">
                                        رفض
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-900/50 space-y-3">
                {detectionMode === 'simulation' ? (
                    <>
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
                    </>
                ) : (
                    <>
                        {!cameraActive ? (
                            <button
                                onClick={async () => { await startCamera(); startDetectionLoop(); }}
                                disabled={backendOnline === false || (cameraSettings.source === 'ip' && !cameraSettings.ipUrl)}
                                className={cn(
                                    "w-full py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                    cameraSettings.source === 'ip' ? "bg-purple-600 hover:bg-purple-500" : "bg-green-600 hover:bg-green-500"
                                )}
                            >
                                {cameraSettings.source === 'ip' ? <Globe size={16} /> : <Camera size={16} />}
                                {backendOnline === false
                                    ? 'خادم AI غير متصل'
                                    : cameraSettings.source === 'ip'
                                        ? (cameraSettings.ipUrl ? 'تشغيل كاميرا IP' : 'أدخل رابط الكاميرا في الإعدادات')
                                        : 'تشغيل الكاميرا'}
                            </button>
                        ) : (
                            <button
                                onClick={stopCamera}
                                className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <Camera size={16} />
                                إيقاف الكاميرا
                            </button>
                        )}
                        <button
                            onClick={() => setManualMode(!manualMode)}
                            disabled={isScanning}
                            className="w-full text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1 transition-colors"
                        >
                            <Key size={12} />
                            إدخال يدوي
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
