'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Cpu, Database, Cloud, Wifi, Camera, Shield, Zap, TrendingUp, Users, Play, Maximize, Smartphone, Car, CheckCircle, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- VISUAL COMPONENTS FOR SLIDES ---

const NeuralNetworkViz = () => (
    <div className="relative w-full h-64 flex items-center justify-center" dir="ltr">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
        <div className="grid grid-cols-5 gap-8 relative z-10">
            {/* Input Layer */}
            <div className="flex flex-col gap-4 justify-center">
                {[1, 2, 3].map(i => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="w-4 h-4 rounded-full bg-slate-500" />)}
            </div>
            {/* Hidden Layers */}
            <div className="flex flex-col gap-2 justify-center">
                {[1, 2, 3, 4].map(i => <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }} key={i} className="w-6 h-6 rounded-full bg-blue-600 shadow-[0_0_10px_blue]" />)}
            </div>
            <div className="flex flex-col gap-2 justify-center">
                {[1, 2, 3, 4].map(i => <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} key={i} className="w-6 h-6 rounded-full bg-purple-600 shadow-[0_0_10px_purple]" />)}
            </div>
            {/* Output Layer */}
            <div className="flex flex-col gap-8 justify-center">
                {[1, 2].map(i => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} key={i} className="w-8 h-8 rounded-full bg-green-500 shadow-[0_0_15px_green]" />)}
            </div>
        </div>
        {/* Connections (Simplified) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <path d="M100 100 L200 80" stroke="white" strokeWidth="2" />
            <path d="M100 100 L200 120" stroke="white" strokeWidth="2" />
            <path d="M200 80 L300 80" stroke="white" strokeWidth="2" />
            <path d="M200 120 L300 80" stroke="white" strokeWidth="2" />
        </svg>
    </div>
);

const FlowChartViz = () => (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full h-full p-4" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-slate-800 p-4 rounded-xl border border-white/10 flex flex-col items-center w-48 text-center">
            <Car size={32} className="text-blue-400 mb-2" />
            <span className="font-bold text-sm">1. دخول المركبة</span>
        </motion.div>

        <ChevronLeft className="text-slate-600 hidden md:block" />
        <div className="w-[2px] h-8 bg-slate-600 md:hidden"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800 p-4 rounded-xl border border-green-500/30 flex flex-col items-center w-48 shadow-[0_0_20px_rgba(34,197,94,0.1)] text-center">
            <Camera size={32} className="text-green-400 mb-2" />
            <span className="font-bold text-sm text-green-300">2. تحليل الذكاء الاصطناعي</span>
            <span className="text-[10px] text-slate-400 mt-1">قراءة اللوحة (OCR)</span>
        </motion.div>

        <ChevronLeft className="text-slate-600 hidden md:block" />
        <div className="w-[2px] h-8 bg-slate-600 md:hidden"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-800 p-4 rounded-xl border border-white/10 flex flex-col items-center w-48 text-center">
            <Database size={32} className="text-purple-400 mb-2" />
            <span className="font-bold text-sm">3. التسجيل السحابي</span>
            <span className="text-[10px] text-slate-400 mt-1">مزامنة البيانات</span>
        </motion.div>

        <ChevronLeft className="text-slate-600 hidden md:block" />
        <div className="w-[2px] h-8 bg-slate-600 md:hidden"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-slate-800 p-4 rounded-xl border border-white/10 flex flex-col items-center w-48 text-center">
            <Shield size={32} className="text-orange-400 mb-2" />
            <span className="font-bold text-sm">4. فتح البوابة</span>
            <span className="text-[10px] text-slate-400 mt-1">التحكم الآلي</span>
        </motion.div>
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
                    <Car size={120} className="text-white relative z-10" />
                </div>
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-tight">
                        نظام <span className="text-blue-500">المواقف</span> الذكي
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 font-light tracking-wide">
                        أتمتة شاملة • رؤية حاسوبية ذكية • تكامل سحابي
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
                    <span className="text-sm font-mono text-blue-400">عرض تقديمي v1.0</span>
                </div>
            </div>
        )
    },
    {
        id: 'problem',
        title: "التحديات الحالية",
        subtitle: "مشاكل الأنظمة التقليدية",
        bg: "from-slate-950 to-red-950",
        content: (
            <div className="grid md:grid-cols-3 gap-8 h-full items-center p-8" dir="rtl">
                <div className="bg-black/40 p-8 rounded-3xl border border-red-500/20 flex flex-col gap-4 h-64 justify-center text-center hover:scale-105 transition-transform">
                    <div className="flex justify-center"><Camera className="text-red-500 w-12 h-12" /></div>
                    <h3 className="text-2xl font-bold text-white">الأخطاء البشرية</h3>
                    <p className="text-slate-400">الاعتماد على التذاكر اليدوية يسبب أخطاء وبطء في التشغيل.</p>
                </div>
                <div className="bg-black/40 p-8 rounded-3xl border border-red-500/20 flex flex-col gap-4 h-64 justify-center text-center hover:scale-105 transition-transform">
                    <div className="flex justify-center"><TrendingUp className="text-red-500 w-12 h-12" /></div>
                    <h3 className="text-2xl font-bold text-white">هدر الإيرادات</h3>
                    <p className="text-slate-400">عدم وجود تتبع دقيق يؤدي إلى خسارة 15-20% من الإيرادات المحتملة.</p>
                </div>
                <div className="bg-black/40 p-8 rounded-3xl border border-red-500/20 flex flex-col gap-4 h-64 justify-center text-center hover:scale-105 transition-transform">
                    <div className="flex justify-center"><Users className="text-red-500 w-12 h-12" /></div>
                    <h3 className="text-2xl font-bold text-white">تجربة سيئة</h3>
                    <p className="text-slate-400">الانتظار الطويل عند البوابات والتذاكر المفقودة تزعج العملاء.</p>
                </div>
            </div>
        )
    },
    {
        id: 'solution',
        title: "الحل المقترح",
        subtitle: "أتمتة ذكية متكاملة",
        bg: "from-slate-900 to-indigo-950",
        content: (
            <div className="flex flex-col justify-center h-full gap-8 px-12" dir="rtl">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-center gap-6 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                        <div className="bg-green-500/20 p-4 rounded-2xl"><Zap size={40} className="text-green-400" /></div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">دخول فوري</h3>
                            <p className="text-slate-400">بدون تلامس عبر كاميرات التعرف LPR.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                        <div className="bg-blue-500/20 p-4 rounded-2xl"><Smartphone size={40} className="text-blue-400" /></div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">تطبيق السائق</h3>
                            <p className="text-slate-400">دفع إلكتروني وفواتير QR رقمية.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                        <div className="bg-purple-500/20 p-4 rounded-2xl"><Database size={40} className="text-purple-400" /></div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">قاعدة بيانات سحابية</h3>
                            <p className="text-slate-400">مزامنة فورية ونسخ احتياطي للسجلات.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                        <div className="bg-orange-500/20 p-4 rounded-2xl"><Shield size={40} className="text-orange-400" /></div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">تحكم إداري كامل</h3>
                            <p className="text-slate-400">لوحة تحكم شاملة للتقارير والتحكم اليدوي.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ai-tech',
        title: "تقنيات الذكاء الاصطناعي",
        subtitle: "نموذج YOLOv8 المتقدم",
        bg: "from-black to-slate-900",
        content: (
            <div className="flex items-center justify-between h-full gap-12 px-8" dir="rtl">
                <div className="flex-1 space-y-8">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-green-500/30">
                        <div className="flex items-center gap-4 mb-4">
                            <Cpu className="text-green-400" size={32} />
                            <h3 className="text-2xl font-bold text-white">محرك المعالجة YOLOv8</h3>
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            نستخدم أحدث خوارزميات <span className="text-green-400 font-bold">YOLO (You Only Look Once)</span> للكشف الفوري عن المركبات.
                            معالجة أكثر من 60 إطار في الثانية على أجهزة الحافة (Edge).
                        </p>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-white"><CheckCircle className="text-green-500" /> دقة 99.8% في قراءة اللوحات</li>
                        <li className="flex items-center gap-3 text-white"><CheckCircle className="text-green-500" /> يعمل بكفاءة في الإضاءة المنخفضة</li>
                        <li className="flex items-center gap-3 text-white"><CheckCircle className="text-green-500" /> دعم كامل للأحرف والأرقام العربية</li>
                    </ul>
                </div>
                <div className="flex-1 h-full max-h-[400px]">
                    <NeuralNetworkViz />
                </div>
            </div>
        )
    },
    {
        id: 'flow',
        title: "سير العمليات",
        subtitle: "المخطط المنطقي للنظام",
        bg: "from-slate-900 to-slate-800",
        content: (
            <div className="h-full flex items-center justify-center">
                <FlowChartViz />
            </div>
        )
    },
    {
        id: 'architecture',
        title: "الهيكلية التقنية",
        subtitle: "مكونات النظام (Topology)",
        bg: "from-slate-950 to-blue-950",
        content: (
            <div className="h-full flex items-center justify-center p-8" dir="ltr">
                <div className="w-full h-full bg-slate-900/50 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    {/* Diagram implementation using absolute positioning for precision */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <div className="w-48 h-24 bg-blue-600/20 border border-blue-500 rounded-xl flex items-center justify-center flex-col gap-2 shadow-[0_0_20px_blue]">
                            <Cloud size={32} className="text-blue-400" />
                            <span className="text-white font-bold">السحابة (Cloud)</span>
                        </div>
                        <div className="h-16 w-0.5 bg-blue-500/50 border-l border-dashed border-blue-400"></div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-20 flex justify-between items-center">
                        <div className="w-48 h-32 bg-green-600/20 border border-green-500 rounded-xl flex items-center justify-center flex-col gap-2 relative shadow-[0_0_20px_green]">
                            <div className="absolute -top-3 left-4 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">الذكاء المحلي</div>
                            <Cpu size={32} className="text-green-400" />
                            <span className="text-white font-bold">خادم محلي (Edge)</span>
                            <span className="text-[10px] text-green-300">YOLO Processing</span>
                        </div>

                        {/* Connection Line */}
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500/50 to-purple-500/50 mx-4"></div>

                        <div className="w-48 h-32 bg-purple-600/20 border border-purple-500 rounded-xl flex items-center justify-center flex-col gap-2 shadow-[0_0_20px_purple]">
                            <Users size={32} className="text-purple-400" />
                            <span className="text-white font-bold">تطبيقات العملاء</span>
                            <span className="text-[10px] text-purple-300">Dashboard & Driver</span>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-20 flex flex-col items-center gap-2">
                        <div className="h-16 w-0.5 bg-green-500/50 border-l border-dashed border-green-400"></div>
                        <div className="w-40 h-20 bg-slate-800 border border-white/20 rounded-xl flex items-center justify-center flex-col gap-1">
                            <Camera size={24} className="text-slate-400" />
                            <span className="text-white text-sm">الكاميرات</span>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-20 flex flex-col items-center gap-2">
                        <div className="h-16 w-0.5 bg-purple-500/50 border-l border-dashed border-purple-400"></div>
                        <div className="w-40 h-20 bg-slate-800 border border-white/20 rounded-xl flex items-center justify-center flex-col gap-1">
                            <Shield size={24} className="text-slate-400" />
                            <span className="text-white text-sm">البوابات</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'contact',
        title: "جاهز للبدء؟",
        subtitle: "تواصل معنا اليوم",
        bg: "from-blue-900 to-black",
        content: (
            <div className="flex flex-col items-center justify-center h-full gap-8" dir="rtl">
                <h2 className="text-4xl font-bold text-white">حول منشأتك إلى منشأة ذكية</h2>
                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur text-center border border-white/5">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">الباقة الأساسية</h3>
                        <div className="text-3xl font-black text-white">$4,999</div>
                        <p className="text-slate-400 text-sm mt-2">بوابتين • ذكاء محدد</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-2xl shadow-2xl text-center transform scale-110 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-2">الباقة الاحترافية</h3>
                        <div className="text-3xl font-black text-white">$9,999</div>
                        <p className="text-blue-100 text-sm mt-2">بوابات غير محدودة • تحليلات متقدمة</p>
                    </div>
                </div>
                <Link href="/" className="mt-8 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl">
                    تجربة النظام المباشر
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
            if (e.key === 'ArrowLeft' || e.key === 'Space') nextSlide(); // RTL Interaction: Left is "Next" visually for Arabic sometimes, but sticking to logical next
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
