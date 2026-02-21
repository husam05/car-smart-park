import React, { useEffect, useState } from 'react';
import { ParkingSpot } from '@/types';
import { X, Car, Clock, BadgeCheck, PlayCircle, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { calculateParkingCost } from '@/lib/config';

interface VehicleDetailsModalProps {
    spot: ParkingSpot | null;
    onClose: () => void;
    onForceExit: (plate: string) => void;
}

export default function VehicleDetailsModal({ spot, onClose, onForceExit }: VehicleDetailsModalProps) {
    const [duration, setDuration] = useState<string>('');
    const [cost, setCost] = useState<number>(0);

    // Update duration/cost live
    useEffect(() => {
        if (!spot?.vehicle) return;

        const updateStats = () => {
            const entryTime = new Date(spot.vehicle!.entryTime);
            const now = new Date();
            const diffMs = now.getTime() - entryTime.getTime();

            // Format Duration
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            setDuration(`${hours}h ${minutes}m ${seconds}s`);

            const calculated = calculateParkingCost(entryTime, now);
            setCost(calculated);
        };

        updateStats();
        const timer = setInterval(updateStats, 1000);
        return () => clearInterval(timer);
    }, [spot]);

    if (!spot || !spot.vehicle) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-800/50 p-6 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Car className="text-blue-400" />
                                تفاصيل المركبة
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">معلومات الحالة الحالية</p>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">

                        {/* Plate & Location */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                                <div className="text-xs text-slate-500 mb-2 uppercase">رقم اللوحة</div>
                                <div className="text-2xl font-black text-white tracking-widest" dir="ltr">{spot.vehicle.plateCode}</div>
                                <div className="text-[10px] text-slate-400 mt-1">{spot.vehicle.city}</div>
                            </div>
                            <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                                <div className="text-xs text-slate-500 mb-2 uppercase">الموقع</div>
                                <div className="text-2xl font-black text-blue-400">
                                    {spot.floor === 1 ? 'L1' : 'L2'}-{spot.id.split('-')[1]}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">الطابق {spot.floor === 1 ? 'الأرضي' : 'العلوي'}</div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                                    <Clock size={12} /> مدة الوقوف
                                </div>
                                <div className="font-mono text-white text-lg font-bold">{duration}</div>
                            </div>
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                                    <Clock size={12} /> وقت الدخول
                                </div>
                                <div className="font-mono text-white text-lg font-bold">
                                    {new Date(spot.vehicle.entryTime).toLocaleTimeString('ar-IQ')}
                                </div>
                            </div>
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                                    <DollarSign size={12} /> التكلفة الحالية
                                </div>
                                <div className="font-mono text-green-400 text-lg font-bold">{formatCurrency(cost)}</div>
                            </div>
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                                    <BadgeCheck size={12} /> الحالة
                                </div>
                                <div className="font-mono text-blue-400 text-lg font-bold">نشط</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={() => {
                                onClose();
                                onForceExit(spot.vehicle!.plateCode);
                            }}
                            className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <PlayCircle size={18} />
                            إخراج المركبة يدوياً (Force Exit)
                        </button>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
