import React from 'react';
import { Car, QrCode, Printer, CheckCircle } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

interface ReceiptProps {
    type?: 'ENTRY' | 'EXIT';
    data: {
        id: string;
        plate: string;
        city: string;
        entryTime: Date;
        exitTime?: Date;
        duration?: string;
        amount?: number;
        paymentMethod?: 'CASH';
    };
    onClose?: () => void;
    onPrint?: () => void;
}

export default function PaymentReceipt({ data, type = 'EXIT', onClose, onPrint }: ReceiptProps) {
    return (
        <div className="bg-white text-black p-6 w-80 rounded-sm shadow-2xl font-mono text-sm relative animate-in zoom-in-95 duration-300" dir="rtl">
            {/* Paper Rip Effect Top */}
            <div className="absolute -top-1 left-0 w-full h-2 bg-white [mask-image:linear-gradient(to_bottom,transparent,black)] clip-path-jagged"></div>

            <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                    <div className="border-2 border-black p-1 rounded">
                        <Car size={24} className="text-black" />
                    </div>
                </div>
                <h2 className="font-bold text-xl uppercase tracking-wider">نظام المواقف الذكي</h2>
                <p className="text-xs text-gray-500">بغداد المركز، البوابة ١</p>
                <div className="my-2 border-b border-dashed border-gray-300"></div>
                <h3 className="font-bold text-lg">{type === 'ENTRY' ? 'تذكرة دخول' : 'إيصال دفع'}</h3>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-500">رقم التذكرة:</span>
                    <span className="font-bold" dir="ltr">#{data.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">رقم اللوحة:</span>
                    <span className="font-bold px-1 bg-gray-200" dir="ltr">{data.plate} ({data.city})</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">وقت الدخول:</span>
                    <span dir="ltr">{data.entryTime.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {type === 'EXIT' ? (
                    <>
                        <div className="flex justify-between">
                            <span className="text-gray-500">وقت الخروج:</span>
                            <span dir="ltr">{data.exitTime?.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">المدة:</span>
                            <span dir="ltr">{data.duration}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-xs text-gray-500 italic mt-2">
                        احتفظ بهذه التذكرة لعرضها عند الخروج
                    </div>
                )}
            </div>

            {type === 'EXIT' && (
                <div className="border-y-2 border-dashed border-gray-300 py-4 mb-6">
                    <div className="flex justify-between items-end">
                        <span>المبلغ الإجمالي</span>
                        <span className="text-2xl font-bold" dir="ltr">{formatCurrency(data.amount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>طريقة الدفع:</span>
                        <span>{data.paymentMethod === 'CASH' ? 'نقداً' : data.paymentMethod}</span>
                    </div>
                </div>
            )}

            {type === 'ENTRY' && (
                <div className="bg-gray-100 p-2 text-center text-xs mb-6 rounded border border-gray-200">
                    <p>التعرفة: {formatCurrency(2000)} / ساعة</p>
                    <p className="text-gray-500">رسوم التذكرة المفقودة: {formatCurrency(50000)}</p>
                </div>
            )}

            <div className="flex flex-col items-center gap-2 mb-6">
                <QrCode size={64} className="text-black opacity-80" />
                <span className="text-[10px] text-gray-400">
                    {type === 'ENTRY' ? 'تذكرة دخول صالحة' : 'امسح للفاتورة الإلكترونية'}
                </span>
            </div>

            <div className="text-center text-[10px] text-gray-400 mb-4">
                شكراً لاستخدامكم مواقفنا<br />
                يرجى الاحتفاظ بالتذكرة للخروج
            </div>

            {/* Buttons (Screen Only) */}
            <div className="flex gap-2 mt-4 print:hidden">
                <button
                    onClick={() => {
                        if (onPrint) onPrint();
                    }}
                    className="flex-1 bg-black text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg hover:scale-105"
                >
                    <Printer size={14} /> {type === 'ENTRY' ? 'طباعة وفتح البوابة' : 'تأكيد الدفع وفتح البوابة'}
                </button>

                {onClose && (
                    <button onClick={onClose} className="flex-1 bg-gray-100 text-black py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                        إغلاق
                    </button>
                )}
            </div>
        </div>
    );
}
