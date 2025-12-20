'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Cpu, Database, Cloud, Wifi, Camera, Shield, Zap, TrendingUp, Users, Play, Maximize, Smartphone, Car, CheckCircle, Server, Monitor, Printer, BarChart3, Activity, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- VISUAL COMPONENTS FOR SLIDES ---

const NeuralNetworkViz = () => (
    <div className="relative w-full h-64 flex items-center justify-center" dir="ltr">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
        <div className="grid grid-cols-5 gap-8 relative z-10">
            {/* Input Layer */}
            <div className="flex flex-col gap-3 justify-center">
                {[1, 2, 3, 4, 5].map(i => <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="w-3 h-3 rounded-full bg-slate-500" />)}
                <span className="text-[10px] text-slate-500 text-center mt-2">Input</span>
            </div>
            {/* Hidden Layers */}
            <div className="flex flex-col gap-2 justify-center">
                {[1, 2, 3, 4, 5, 6].map(i => <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }} key={i} className="w-5 h-5 rounded-full bg-blue-600 shadow-[0_0_10px_blue]" />)}
            </div>
            <div className="flex flex-col gap-2 justify-center">
                {[1, 2, 3, 4, 5, 6].map(i => <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} key={i} className="w-5 h-5 rounded-full bg-purple-600 shadow-[0_0_10px_purple] animate-pulse" />)}
            </div>
            {/* Output Layer */}
            <div className="flex flex-col gap-8 justify-center">
                {[1, 2].map(i => <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} key={i} className="w-8 h-8 rounded-full bg-green-500 shadow-[0_0_15px_green]" />)}
                <span className="text-[10px] text-green-500 text-center mt-2">Result</span>
            </div>
        </div>
    </div>
);

const ReceiptViz = () => (
    <div className="bg-white text-black p-6 w-64 rounded-sm shadow-2xl font-mono text-xs relative transform rotate-[-2deg] mx-auto">
        <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
            <h3 className="font-bold text-lg">موقف النجف الذكي</h3>
            <p>Smart Parking System</p>
            <p className="mt-2 text-[10px] text-gray-500">2025-12-20 | 14:30:05</p>
        </div>
        <div className="space-y-2 mb-4">
            <div className="flex justify-between">
                <span>رقم التذكرة:</span>
                <span className="font-bold">#99283</span>
            </div>
            <div className="flex justify-between">
                <span>رقم المركبة:</span>
                <span className="font-bold bg-yellow-300 px-1">النجف | ب | 4002</span>
            </div>
            <div className="flex justify-between">
                <span>وقت الدخول:</span>
                <span>12:00 PM</span>
            </div>
            <div className="flex justify-between">
                <span>وقت الخروج:</span>
                <span>02:30 PM</span>
            </div>
        </div>
        <div className="border-t-2 border-dashed border-black pt-2 mb-4">
            <div className="flex justify-between text-lg font-black">
                <span>المبلغ الكلي:</span>
                <span>5,000 IQD</span>
            </div>
        </div>
        <div className="flex justify-center mb-2">
            <div className="w-24 h-24 bg-black p-1">
                <div className="w-full h-full bg-white grid grid-cols-4 gap-0.5 p-1">
                    {/* Simulated QR Pattern */}
                    {[...Array(16)].map((_, i) => <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>)}
                </div>
            </div>
        </div>
        <div className="text-center text-[8px] text-gray-500">
            يرجى الاحتفاظ بالتذكرة للخروج
            <br />Keep ticket for exit
        </div>
        {/* Torn edge effect */}
        <div className="absolute -bottom-2 left-0 w-full h-4 bg-white" style={{ maskImage: 'linear-gradient(45deg, transparent 75%, black 75%), linear-gradient(-45deg, transparent 75%, black 75%)', maskSize: '10px 10px' }}></div>
    </div>
);

const AnalyticsViz = () => (
    <div className="w-full h-64 bg-slate-900 rounded-xl border border-slate-700 p-4 flex flex-col gap-4 relative overflow-hidden" dir="ltr">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
                <BarChart3 className="text-blue-500" size={16} />
                <span className="text-xs font-bold text-slate-300">Financial Overview</span>
            </div>
            <span className="text-[10px] text-green-400 font-mono">+12.5% Growth</span>
        </div>
        <div className="flex items-end gap-2 h-32 px-4 pb-2">
            {[30, 45, 25, 60, 75, 50, 90, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-900/30 rounded-t-sm relative group">
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm group-hover:bg-blue-400 transition-colors"
                    />
                </div>
            ))}
        </div>
        <div className="flex gap-4">
            <div className="flex-1 bg-slate-800 p-2 rounded">
                <div className="text-[10px] text-slate-400">Total Revenue</div>
                <div className="text-lg font-bold text-white">62,500 IQD</div>
            </div>
            <div className="flex-1 bg-slate-800 p-2 rounded">
                <div className="text-[10px] text-slate-400">Tickets</div>
                <div className="text-lg font-bold text-white">142</div>
            </div>
        </div>
    </div>
);

const MonitorViz = () => (
    <div className="w-full bg-black rounded-lg border border-green-900/50 p-4 font-mono text-xs overflow-hidden" dir="ltr">
        <div className="text-green-500 mb-2 border-b border-green-900 pb-1 flex justify-between">
            <span>SYSTEM_DIAGNOSTICS_TOOL_V2.0</span>
            <span className="animate-pulse">ONLINE</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <div className="text-slate-500">CPU_LOAD: <span className="text-green-400">12%</span> [====......]</div>
                <div className="text-slate-500">MEM_USD: <span className="text-yellow-400">4.2GB</span> [======....]</div>
                <div className="text-slate-500">NET_I/O: <span className="text-blue-400">1.2MB/s</span> [==........]</div>
            </div>
            <div className="h-20 bg-black border border-green-900/30 p-2 text-[10px] text-green-700 overflow-hidden">
                <div className="opacity-50">Log stream...</div>
                <div>{`>`} INIT_YOLO_MODEL: SUCCESS (12ms)</div>
                <div>{`>`} CAMERA_LPR_01: CONNECTED_</div>
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block w-2 h-4 bg-green-500 align-middle ml-1"
                />
            </div>
        </div>
    </div>
);

// --- SLIDE DATA ---

const SLIDES = [
    {
        id: 'intro',
        title: "نظام المواقف الذكي",
        subtitle: "Smart Parking AI System",
        bg: "from-slate-900 to-blue-950",
        content: (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8" dir="rtl">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 animate-pulse"></div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                        <Car size={120} className="text-white relative z-10" />
                    </motion.div>
                </div>
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-tight">
                        نظام <span className="text-blue-500">المواقف</span> الذكي
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 font-light tracking-wide">
                        أتمتة شاملة • رؤية حاسوبية • فواتير ذكية
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'problem',
        title: "التحديات الحالية",
        subtitle: "لماذا نحتاج التغيير؟",
        bg: "from-slate-950 to-red-950",
        content: (
            <div className="grid md:grid-cols-3 gap-8 h-full items-center p-8" dir="rtl">
                <div className="bg-black/40 p-8 rounded-3xl border border-red-500/20 flex flex-col gap-4 h-64 justify-center text-center hover:scale-105 transition-transform group">
                    <div className="flex justify-center"><Camera className="text-red-500 w-12 h-12" /></div>
                    <h3 className="text-2xl font-bold text-white">الأخطاء البشرية</h3>
                </div>
                <div className="bg-black/40 p-8 rounded-3xl border border-red-500/20 flex flex-col gap-4 h-64 justify-center text-center hover:scale-105 transition-transform group">
                    <div className="flex justify-center"><TrendingUp className="text-red-500 w-12 h-12" /></div>
                    <h3 className="text-2xl font-bold text-white">هدر الإيرادات</h3>
                </div>
                <div className="bg-black/40 p-8 rounded-3xl border border-red-500/20 flex flex-col gap-4 h-64 justify-center text-center hover:scale-105 transition-transform group">
                    <div className="flex justify-center"><Users className="text-red-500 w-12 h-12" /></div>
                    <h3 className="text-2xl font-bold text-white">الازدحام</h3>
                </div>
            </div>
        )
    },
    {
        id: 'billing',
        title: "الفواتير الذكية",
        subtitle: "تذاكر إلكترونية وورقية",
        bg: "from-blue-950 to-slate-900",
        content: (
            <div className="flex items-center justify-center h-full gap-12 px-8" dir="rtl">
                <div className="w-1/2 space-y-6 text-right">
                    <div className="flex items-center gap-4 text-blue-400 mb-2">
                        <Printer size={32} />
                        <h3 className="text-3xl font-bold text-white">إصدار التذاكر الفوري</h3>
                    </div>
                    <p className="text-slate-300 text-lg">
                        يتم إصدار تذكرة ذكية تحتوي على كافة التفاصيل فور وصول المركبة للبوابة، مع دعم كامل للفواتير الضريبية.
                    </p>
                    <ul className="space-y-4 mt-4">
                        <li className="flex items-center gap-3 text-white"><CheckCircle className="text-blue-500" /> رمز QR Code فريد لكل مركبة</li>
                        <li className="flex items-center gap-3 text-white"><CheckCircle className="text-blue-500" /> احتساب دقيق للوقت والتكلفة</li>
                        <li className="flex items-center gap-3 text-white"><CheckCircle className="text-blue-500" /> إمكانية الدفع الإلكتروني</li>
                    </ul>
                </div>
                <div className="w-1/2 flex justify-center items-center perspective-1000">
                    <motion.div initial={{ rotateY: 90 }} whileInView={{ rotateY: 0 }} transition={{ duration: 0.8 }}>
                        <ReceiptViz />
                    </motion.div>
                </div>
            </div>
        )
    },
    {
        id: 'analytics',
        title: "التحليلات المالية",
        subtitle: "تقارير ودراسات",
        bg: "from-slate-900 to-green-950",
        content: (
            <div className="flex flex-col items-center justify-center h-full gap-8 px-12" dir="rtl">
                <div className="w-full max-w-4xl flex gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-green-500" /> لوحة قيادة المدراء</h3>
                        <p className="text-slate-400">
                            احصل على نظرة شاملة لأداء المواقف في الوقت الفعلي. تتبع الإيرادات، أوقات الذروة، ومعدلات الإشغال لاتخاذ قرارات مدروسة.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-slate-800 p-4 rounded-lg border-r-4 border-green-500">
                                <div className="text-slate-400 text-xs">الإيراد اليومي</div>
                                <div className="text-xl font-bold text-white">62,500 د.ع</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border-r-4 border-blue-500">
                                <div className="text-slate-400 text-xs">نسبة الإشغال</div>
                                <div className="text-xl font-bold text-white">85%</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <AnalyticsViz />
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'status',
        title: "التشخيص المباشر",
        subtitle: "مراقبة النظام System Status",
        bg: "from-black to-slate-900",
        content: (
            <div className="flex flex-col items-center justify-center h-full gap-8 px-8" dir="rtl">
                <div className="w-full max-w-3xl">
                    <MonitorViz />
                </div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mt-4">
                    <div className="bg-slate-800 p-4 rounded flex items-center gap-3">
                        <Activity className="text-green-500" />
                        <div>
                            <div className="text-white font-bold text-sm">حالة الخوادم</div>
                            <div className="text-green-400 text-xs">تعمل بكفاءة 99.9%</div>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded flex items-center gap-3">
                        <Camera className="text-blue-500" />
                        <div>
                            <div className="text-white font-bold text-sm">الكاميرات</div>
                            <div className="text-blue-400 text-xs">متصلة (12ms)</div>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded flex items-center gap-3">
                        <Cloud className="text-purple-500" />
                        <div>
                            <div className="text-white font-bold text-sm">المزامنة</div>
                            <div className="text-purple-400 text-xs">لحظية (Real-time)</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'contact',
        title: "جاهز للبدء؟",
        subtitle: "حول منشأتك إلى ذكية اليوم",
        bg: "from-blue-900 to-black",
        content: (
            <div className="flex flex-col items-center justify-center h-full gap-8" dir="rtl">
                <h2 className="text-4xl font-bold text-white">خطط أسعار مرنة للمؤسسات</h2>
                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur text-center border border-white/5 hover:bg-white/20 transition-colors">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">الأساسية</h3>
                        <div className="text-3xl font-black text-white">$4,999</div>
                        <p className="text-slate-400 text-sm mt-2">بوابتين • تقارير أساسية</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-2xl shadow-2xl text-center transform scale-110 border border-white/20 hover:scale-115 transition-transform">
                        <h3 className="text-xl font-bold text-white mb-2">المتكاملة (Pro)</h3>
                        <div className="text-3xl font-black text-white">$9,999</div>
                        <p className="text-blue-100 text-sm mt-2">بوابات غير محدودة • تحليلات AI</p>
                    </div>
                </div>
                <Link href="/" className="mt-8 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_20px_white] animate-pulse">
                    طلب عرض سعر
                </Link>
            </div>
        )
    }
];

// --- MAIN PAGE COMPONENT ---

export default function PresentationPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'Space') nextSlide();
            if (e.key === 'ArrowRight') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    // Auto Play Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(nextSlide, 5000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentSlide]);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    };

    const slide = SLIDES[currentSlide];

    return (
        <main className={cn("min-h-screen w-full relative overflow-hidden font-sans flex flex-col bg-gradient-to-br transition-colors duration-1000", slide.bg)} dir="rtl">

            {/* BACKGROUND ANIMATION */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            {/* HEADER */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <Car className="text-white" />
                    <span className="text-white font-bold tracking-widest">SMARTPARK.AI</span>
                </div>
                <div className="text-slate-400 text-xs font-mono">
                    شريحة {currentSlide + 1} / {SLIDES.length}
                </div>
            </header>

            {/* SLIDE CONTENT AREA */}
            <div className="flex-1 relative flex items-center justify-center p-8 md:p-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: -100 }} // RTL Direction
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="w-full max-w-6xl h-full flex flex-col"
                    >
                        {/* Slide Title */}
                        <div className="mb-8 text-right">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-6xl font-black text-white mb-2"
                            >
                                {slide.title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-slate-400 font-light uppercase tracking-wider"
                            >
                                {slide.subtitle}
                            </motion.p>
                        </div>
                        {/* Slide Body */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm overflow-hidden shadow-2xl relative"
                        >
                            {slide.content}

                            {/* Decorative corner accents */}
                            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/20 rounded-bl-3xl"></div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* CONTROLS */}
            <footer className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <div className="w-32 text-left">
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10" dir="ltr">
                    <button onClick={prevSlide} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <ChevronLeft />
                    </button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        {isPlaying ? <span className="font-mono text-xs font-bold text-red-400">STOP</span> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button onClick={nextSlide} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <ChevronRight />
                    </button>
                </div>

                <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <Maximize size={16} /> خروج
                </Link>
            </footer>
        </main>
    );
}
