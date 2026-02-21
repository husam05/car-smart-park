'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, Receipt, Car, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PARKING_CONFIG } from '@/lib/config';


interface PaymentReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPrint: () => void;
    vehicleDetails: {
        plate: string;
        entryTime: Date;
        amount: number;
        spotId?: string;
        ticketId: string;
    } | null;
}

export default function PaymentReceiptModal({ isOpen, onClose, onPrint, vehicleDetails }: PaymentReceiptModalProps) {
    const [origin, setOrigin] = React.useState('');

    React.useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    if (!isOpen || !vehicleDetails) return null;

    const driverUrl = `${origin}/driver?ticket=${encodeURIComponent(vehicleDetails.ticketId)}&plate=${encodeURIComponent(vehicleDetails.plate)}`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-slate-900 rounded-2xl w-full max-w-sm overflow-hidden border border-white/10 shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-slate-950 p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Receipt className="text-blue-400" size={20} />
                            إصدار وصل دخول
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Receipt Preview */}
                    <div className="p-6 bg-slate-900" id="receipt-preview">
                        <div className="bg-white text-slate-900 p-6 rounded-lg shadow-lg relative overflow-hidden">
                            {/* Zigzag bottom border effect */}
                            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[linear-gradient(45deg,transparent_75%,#0f172a_75%),linear-gradient(-45deg,transparent_75%,#0f172a_75%)] bg-[size:20px_20px] opacity-10"></div>

                            <div className="text-center border-b-2 border-slate-900/10 pb-4 mb-4 border-dashed">
                                <h2 className="text-lg font-black mb-0.5">نظام إدارة المواقف الذكي</h2>
                                <p className="text-xs font-bold tracking-[4px] text-slate-600 uppercase">SMART PARK</p>
                                <p className="text-[10px] text-slate-400 mt-1">بغداد - البوابة الرئيسية</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 flex items-center gap-1"><Car size={12} /> المركبة</span>
                                    <span className="font-bold font-mono text-lg">{vehicleDetails.plate}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 flex items-center gap-1"><Calendar size={12} /> التاريخ</span>
                                    <span className="font-bold font-mono text-xs">
                                        {vehicleDetails.entryTime.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 flex items-center gap-1"><Clock size={12} /> وقت الدخول</span>
                                    <span className="font-bold font-mono">
                                        {vehicleDetails.entryTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {vehicleDetails.spotId && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">الموقف المقترح</span>
                                        <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                            {vehicleDetails.spotId}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">المبلغ المدفوع</span>
                                    <span className="text-xl font-black text-green-600">{vehicleDetails.amount.toLocaleString()} د.ع</span>
                                </div>
                                <div className="text-center text-[10px] text-slate-400 border-t border-dashed border-slate-200 pt-2 mt-2">
                                    <span>التعرفة: {PARKING_CONFIG.HOURLY_RATE.toLocaleString()} د.ع / ساعة</span>
                                    <span className="mx-2">|</span>
                                    <span>رسوم فقدان التذكرة: {PARKING_CONFIG.LOST_TICKET_FEE.toLocaleString()} د.ع</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 mb-2">
                                <div className="p-2 bg-white border-2 border-slate-900 rounded-lg">
                                    <QRCode
                                        value={driverUrl}
                                        size={120}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 text-center px-4">
                                    امسح الرمز لمعرفة مكان سيارتك وحالة الاشتراك
                                </p>
                            </div>

                            <div className="text-center text-[10px] font-mono text-slate-300 mt-4">
                                {vehicleDetails.ticketId}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-slate-950 border-t border-white/10 flex gap-3">
                        <button
                            onClick={onPrint}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
                        >
                            <Printer size={18} />
                            طباعة وفتح البوابة
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
