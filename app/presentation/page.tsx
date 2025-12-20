'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Cpu, Database, Cloud, Wifi, Camera, Shield, Zap, TrendingUp, Users, Play, Maximize, Smartphone, Car, CheckCircle, Server, Monitor, Printer, BarChart3, Activity, Terminal, Layers, Clock, DollarSign, MapPin, Lock, Globe, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- VISUAL COMPONENTS (Reused & Expanded) ---

const NeuralNetworkViz = () => (
    <div className="relative w-full h-48 flex items-center justify-center" dir="ltr">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
        <div className="grid grid-cols-5 gap-4 relative z-10 scale-75 md:scale-100">
            <div className="flex flex-col gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(i => <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="w-3 h-3 rounded-full bg-slate-500" />)}
            </div>
            <div className="flex flex-col gap-1 justify-center">
                {[1, 2, 3, 4, 5, 6].map(i => <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }} key={i} className="w-4 h-4 rounded-full bg-blue-600 shadow-[0_0_10px_blue]" />)}
            </div>
            <div className="flex flex-col gap-1 justify-center">
                {[1, 2, 3, 4, 5, 6].map(i => <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} key={i} className="w-4 h-4 rounded-full bg-purple-600 shadow-[0_0_10px_purple] animate-pulse" />)}
            </div>
            <div className="flex flex-col gap-4 justify-center">
                {[1, 2].map(i => <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} key={i} className="w-6 h-6 rounded-full bg-green-500 shadow-[0_0_15px_green]" />)}
            </div>
        </div>
    </div>
);

const ReceiptViz = () => (
    <div className="bg-white text-black p-4 w-56 rounded-sm shadow-2xl font-mono text-[10px] relative transform rotate-[-2deg] mx-auto scale-90 md:scale-100">
        <div className="text-center border-b border-dashed border-black pb-2 mb-2">
            <h3 className="font-bold text-sm">موقف النجف الذكي</h3>
            <p>Smart Parking</p>
        </div>
        <div className="space-y-1 mb-2">
            <div className="flex justify-between"><span>TICKET:</span><span className="font-bold">#99283</span></div>
            <div className="flex justify-between"><span>PLATE:</span><span className="font-bold bg-yellow-300 px-1">النجف | ب | 4002</span></div>
            <div className="flex justify-between"><span>ENTRY:</span><span>12:00 PM</span></div>
        </div>
        <div className="border-t border-dashed border-black pt-1 mb-2">
            <div className="flex justify-between text-sm font-black">
                <span>TOTAL:</span><span>5,000 IQD</span>
            </div>
        </div>
        <div className="flex justify-center"><div className="w-16 h-16 bg-black"></div></div>
    </div>
);

const AnalyticsViz = () => (
    <div className="w-full h-48 bg-slate-900 rounded-xl border border-slate-700 p-4 flex flex-col gap-2 relative overflow-hidden" dir="ltr">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300">Revenue Stream</span>
            <span className="text-[10px] text-green-400 font-mono">+12.5%</span>
        </div>
        <div className="flex items-end gap-1 h-24 px-2 pb-1">
            {[30, 45, 25, 60, 75, 50, 90, 80, 95, 85, 70, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-900/30 rounded-t-sm relative group">
                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm" />
                </div>
            ))}
        </div>
    </div>
);

// --- SLIDE DATA (25 Slides) ---

const SLIDES = [
    // SECTION 1: INTRODUCTION
    {
        id: '1-intro',
        section: "1. المقدمة",
        title: "نظام المواقف الذكي",
        subtitle: "Smart Parking AI System",
        bg: "from-slate-900 to-blue-950",
        content: (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
                <Car size={100} className="text-white animate-bounce" />
                <h1 className="text-6xl font-black text-white">Smart<span className="text-blue-500">Park</span></h1>
                <p className="text-2xl text-slate-300">نظام إدارة المواقف الأذكى في الشرق الأوسط</p>
                <div className="flex gap-4">
                    <span className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm">AI Powered</span>
                    <span className="bg-green-500/20 text-green-300 px-4 py-1 rounded-full text-sm">Cloud Native</span>
                </div>
            </div>
        )
    },
    {
        id: '2-agenda',
        section: "1. المقدمة",
        title: "جدول العرض",
        subtitle: "محاور العرض التقديمي",
        bg: "from-slate-900 to-slate-800",
        content: (
            <div className="grid grid-cols-2 gap-4 text-right">
                {['نظرة عامة والمشكلة', 'الحل التقني الشامل', 'تقنيات الذكاء الاصطناعي', 'رحلة المستخدم', 'الأنظمة المالية والإدارية', 'خطط التنفيذ والتطوير'].map((item, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">{i + 1}</div>
                        <span className="text-lg text-white font-bold">{item}</span>
                    </div>
                ))}
            </div>
        )
    },
    // SECTION 2: THE PROBLEM
    {
        id: '3-landscape',
        section: "2. المشكلة",
        title: "واقع المواقف الحالي",
        subtitle: "التحديات التشغيلية",
        bg: "from-red-950 to-black",
        content: (
            <div className="grid grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-red-900/20 rounded-xl border border-red-500/30">
                    <Clock size={40} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">ضياع الوقت</h3>
                    <p className="text-slate-400 text-sm">ساعات ضائعة في البحث عن مكان وتذاكر يدوية</p>
                </div>
                <div className="p-6 bg-red-900/20 rounded-xl border border-red-500/30">
                    <DollarSign size={40} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">خسارة الإيرادات</h3>
                    <p className="text-slate-400 text-sm">التلاعب المالي وعدم دقة الحسابات</p>
                </div>
                <div className="p-6 bg-red-900/20 rounded-xl border border-red-500/30">
                    <Shield size={40} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">ضعف الأمن</h3>
                    <p className="text-slate-400 text-sm">صعوبة تعقب المركبات وعدم وجود سجلات</p>
                </div>
            </div>
        )
    },
    {
        id: '4-cost',
        section: "2. المشكلة",
        title: "التكلفة التشغيلية",
        subtitle: "حقائق وأرقام",
        bg: "from-red-950 to-slate-900",
        content: (
            <div className="flex items-center justify-center gap-12">
                <div className="text-center">
                    <div className="text-6xl font-black text-red-500 mb-2">20%</div>
                    <p className="text-white text-xl">متوسط فقدان الإيرادات السنوي</p>
                </div>
                <div className="w-px h-32 bg-slate-700"></div>
                <div className="text-center">
                    <div className="text-6xl font-black text-orange-500 mb-2">15m</div>
                    <p className="text-white text-xl">دقيقة انتظار يومياً</p>
                </div>
            </div>
        )
    },
    // SECTION 3: THE SOLUTION
    {
        id: '5-solution-overview',
        section: "3. الحل المقترح",
        title: "منظومة SmartPark",
        subtitle: "الحل المتكامل",
        bg: "from-blue-950 to-indigo-950",
        content: (
            <div className="grid grid-cols-2 gap-8 text-right">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 bg-blue-900/30 p-4 rounded-xl"><Zap /><span className="text-white font-bold">أتمتة كاملة 100%</span></div>
                    <div className="flex items-center gap-4 bg-blue-900/30 p-4 rounded-xl"><EyeIcon /><span className="text-white font-bold">رؤية حاسوبية ذكية</span></div>
                    <div className="flex items-center gap-4 bg-blue-900/30 p-4 rounded-xl"><Cloud /><span className="text-white font-bold">ربط سحابي فوري</span></div>
                </div>
                <div className="border border-blue-500/30 rounded-xl p-4 flex items-center justify-center">
                    <img src="/api/placeholder/400/300" alt="Dashboard Preview" className="rounded opacity-50" />
                    <span className="absolute text-blue-300 font-bold">Dashboard UI</span>
                </div>
            </div>
        )
    },
    {
        id: '6-tech-stack',
        section: "3. الحل المقترح",
        title: "التقنيات المستخدمة",
        subtitle: "Tech Stack",
        bg: "from-slate-900 to-black",
        content: (
            <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center gap-2"><div className="w-12 h-12 bg-white rounded-full text-black flex items-center justify-center font-bold">Nx</div><span className="text-white font-bold">Next.js 14</span></div>
                <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center gap-2"><div className="w-12 h-12 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold">Ts</div><span className="text-white font-bold">TypeScript</span></div>
                <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-500 rounded-full text-white flex items-center justify-center font-bold">Nd</div><span className="text-white font-bold">Node.js</span></div>
                <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center gap-2"><div className="w-12 h-12 bg-blue-400 rounded-full text-white flex items-center justify-center font-bold">Pg</div><span className="text-white font-bold">PostgreSQL</span></div>
            </div>
        )
    },
    // SECTION 4: AI & ARCHITECTURE
    {
        id: '7-ai-yolo',
        section: "4. تقنيات الذكاء الاصطناعي",
        title: "YOLOv8 & Computer Vision",
        subtitle: "الدقة والسرعة",
        bg: "from-black to-green-950",
        content: (
            <div className="flex items-center justify-between gap-8">
                <div className="w-1/2 space-y-4 text-right">
                    <h3 className="text-2xl font-bold text-green-400">Object Detection</h3>
                    <p className="text-slate-300">خوارزميات متقدمة لكشف المركبات وقراءة اللوحات (LPR) بدقة تصل إلى 99.8% في مختلف الظروف الجوية.</p>
                </div>
                <div className="w-1/2"><NeuralNetworkViz /></div>
            </div>
        )
    },
    {
        id: '8-edge-computing',
        section: "4. تقنيات الذكاء الاصطناعي",
        title: "المعالجة الطرفية (Edge)",
        subtitle: "Local Processing",
        bg: "from-slate-900 to-slate-800",
        content: (
            <div className="flex flex-col items-center gap-8">
                <div className="flex gap-12 items-center">
                    <div className="text-center"><Camera size={48} className="text-slate-400 mb-2" /><span className="text-white">Camera Feed</span></div>
                    <ChevronLeft size={32} className="text-green-500 animate-pulse" />
                    <div className="p-6 bg-green-900/30 border border-green-500 rounded-2xl text-center">
                        <Cpu size={48} className="text-green-400 mx-auto mb-2" />
                        <h3 className="text-white font-bold">Jetson Orin / RPi 5</h3>
                        <span className="text-green-300 text-sm">AI Inference (< 50ms)</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: '9-cloud-sync',
        section: "4. تقنيات الذكاء الاصطناعي",
        title: "التزامن السحابي",
        subtitle: "Cloud Architecture",
        bg: "from-slate-900 to-blue-900",
        content: (
            <div className="flex items-center justify-center gap-8">
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-600"><Database className="text-white" /> <span className="text-white">Local DB</span></div>
                <div className="h-1 flex-1 bg-gradient-to-r from-slate-600 to-blue-500 relative"><div className="absolute top-[-10px] left-1/2 text-xs text-white">Encrypted Sync</div></div>
                <div className="p-4 bg-blue-900 rounded-lg border border-blue-500"><Cloud className="text-white" /> <span className="text-white">AWS / Vercel</span></div>
            </div>
        )
    },
    {
        id: '10-hardware',
        section: "4. تقنيات الذكاء الاصطناعي",
        title: "التكامل مع الأجهزة",
        subtitle: "Hardware Integration",
        bg: "from-black to-slate-800",
        content: (
            <div className="grid grid-cols-3 gap-8 text-center text-white">
                <div className="bg-slate-800 p-4 rounded-xl"><Camera className="mx-auto mb-2 text-blue-400" /> IP Cameras</div>
                <div className="bg-slate-800 p-4 rounded-xl"><Shield className="mx-auto mb-2 text-green-400" /> Barriers / Gates</div>
                <div className="bg-slate-800 p-4 rounded-xl"><Wifi className="mx-auto mb-2 text-purple-400" /> IoT Sensors</div>
            </div>
        )
    },
    // SECTION 5: USER JOURNEY
    {
        id: '11-entry',
        section: "5. رحلة المستخدم",
        title: "دخول المركبة",
        subtitle: "تجربة سلسة",
        bg: "from-blue-950 to-black",
        content: (
            <div className="flex items-center justify-center gap-4 text-center">
                <div className="w-32 bg-slate-800 p-4 rounded-lg"><Car className="mx-auto text-white" /><span className="text-sm text-slate-300 mt-2 block">وصول</span></div>
                <ChevronLeft className="text-blue-500" />
                <div className="w-32 bg-slate-800 p-4 rounded-lg"><Camera className="mx-auto text-blue-400" /><span className="text-sm text-slate-300 mt-2 block">قراءة اللوحة</span></div>
                <ChevronLeft className="text-blue-500" />
                <div className="w-32 bg-slate-800 p-4 rounded-lg"><Zap className="mx-auto text-yellow-400" /><span className="text-sm text-slate-300 mt-2 block">فتح البوابة</span></div>
            </div>
        )
    },
    {
        id: '12-parking',
        section: "5. رحلة المستخدم",
        title: "التوجيه والوقوف",
        subtitle: "Smart Guidance",
        bg: "from-slate-900 to-slate-800",
        content: (
            <div className="flex flex-col items-center gap-4">
                <MapPin size={64} className="text-red-500 animate-bounce" />
                <p className="text-white text-xl text-center max-w-lg">شاشات توجيه ذكية تدل السائق على أقرب موقف شاغر لتقليل وقت البحث.</p>
            </div>
        )
    },
    {
        id: '13-exit',
        section: "5. رحلة المستخدم",
        title: "الخروج والدفع",
        subtitle: "Exit Process",
        bg: "from-slate-900 to-green-950",
        content: (
            <div className="flex flex-col gap-4 max-w-xl mx-auto text-right">
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg"><span className="text-white">1. التوجه للبوابة</span><CheckCircle className="text-green-500" /></div>
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg"><span className="text-white">2. حساب المدة تلقائياً</span><CheckCircle className="text-green-500" /></div>
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg"><span className="text-white">3. الدفع (نقدي/تطبيق)</span><CheckCircle className="text-green-500" /></div>
            </div>
        )
    },
    {
        id: '14-smart-billing',
        section: "5. رحلة المستخدم",
        title: "الفواتير الذكية",
        subtitle: "Receipt System",
        bg: "from-black to-slate-900",
        content: (
            <div className="flex items-center justify-around">
                <div className="text-right text-white space-y-4">
                    <h3 className="text-2xl font-bold">تذكرة ذكية QR</h3>
                    <p className="text-slate-400">تذكرة تحتوي على كافة البيانات مشفرة وآمنة.</p>
                </div>
                <ReceiptViz />
            </div>
        )
    },
    {
        id: '15-driver-app',
        section: "5. رحلة المستخدم",
        title: "تطبيق السائق",
        subtitle: "Mobile App",
        bg: "from-indigo-950 to-purple-950",
        content: (
            <div className="flex items-center justify-center gap-8">
                <div className="w-48 h-80 bg-black border-4 border-slate-700 rounded-3xl relative overflow-hidden flex items-center justify-center">
                    <span className="text-white font-bold">App UI Mockup</span>
                </div>
                <ul className="text-white text-right space-y-4">
                    <li className="flex gap-2 items-center justify-end">دفع إلكتروني <Smartphone size={16} /></li>
                    <li className="flex gap-2 items-center justify-end">تاريخ الوقوف <Clock size={16} /></li>
                    <li className="flex gap-2 items-center justify-end">حجز مسبق <MapPin size={16} /></li>
                </ul>
            </div>
        )
    },
    // SECTION 6: MANAGEMENT
    {
        id: '16-admin',
        section: "6. الإدارة والتحكم",
        title: "لوحة التحكم المركزية",
        subtitle: "Admin Dashboard",
        bg: "from-slate-900 to-blue-900",
        content: (
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-600 w-3/4 mx-auto">
                <div className="h-4 w-full bg-slate-700 rounded mb-2"></div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-20 bg-slate-600 rounded"></div>
                    <div className="h-20 bg-slate-600 rounded"></div>
                    <div className="h-20 bg-slate-600 rounded"></div>
                </div>
                <div className="mt-2 text-center text-slate-400 text-sm">تحكم كامل بالمستخدمين، الأسعار، والإعدادات.</div>
            </div>
        )
    },
    {
        id: '17-monitoring',
        section: "6. الإدارة والتحكم",
        title: "المراقبة الحية",
        subtitle: "Real-time Monitoring",
        bg: "from-black to-green-900",
        content: (
            <div className="w-full max-w-2xl mx-auto text-center">
                <p className="text-green-400 font-mono mb-4 text-sm animate-pulse">● SYSTEM LIVE</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black border border-green-500 p-4 rounded text-green-500 font-mono text-xs text-left">
                        > GATE_01: OPEN<br />> CAM_02: RECORDING<br />> SERVER: ONLINE
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="bg-slate-800 p-2 rounded text-white text-xs">CPU Usage: 12%</div>
                        <div className="bg-slate-800 p-2 rounded text-white text-xs">RAM Usage: 40%</div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: '18-financials',
        section: "6. الإدارة والتحكم",
        title: "التقارير المالية",
        subtitle: "Financial Reports",
        bg: "from-slate-900 to-slate-800",
        content: (
            <div className="flex flex-col gap-6 items-center">
                <AnalyticsViz />
                <p className="text-white text-center px-8">تقارير تفصيلية يومية، شهرية، وسنوية تساعد في اتخاذ القرارات الاستثمارية.</p>
            </div>
        )
    },
    {
        id: '19-security',
        section: "6. الإدارة والتحكم",
        title: "الأمن والحماية",
        subtitle: "Security & Auditing",
        bg: "from-slate-900 to-red-950",
        content: (
            <div className="grid grid-cols-2 gap-8 px-12 text-white">
                <div className="border border-red-500/50 p-6 rounded-xl">
                    <Lock className="text-red-500 mb-2" size={32} />
                    <h3 className="font-bold">تشفير البيانات</h3>
                    <p className="text-sm text-slate-400">تشفير AES-256 لكافة البيانات الحساسة.</p>
                </div>
                <div className="border border-red-500/50 p-6 rounded-xl">
                    <Briefcase className="text-red-500 mb-2" size={32} />
                    <h3 className="font-bold">سجلات التدقيق</h3>
                    <p className="text-sm text-slate-400">تسجيل كل حركة دخول للنظام لمنع التلاعب.</p>
                </div>
            </div>
        )
    },
    // SECTION 7: FUTURE & BUSINESS
    {
        id: '20-scalability',
        section: "7. الخطط المستقبلية",
        title: "قابلية التوسع",
        subtitle: "Scalability",
        bg: "from-blue-900 to-black",
        content: (
            <div className="flex items-center justify-center gap-8 text-white">
                <Globe size={64} className="text-blue-400" />
                <div className="text-right">
                    <h3 className="text-2xl font-bold">دعم متعدد المواقع</h3>
                    <p>إدارة عشرات المواقف من لوحة تحكم واحدة مركزية.</p>
                </div>
            </div>
        )
    },
    {
        id: '21-pricing',
        section: "7. الخطط المستقبلية",
        title: "نماذج التسعير",
        subtitle: "Business Models",
        bg: "from-slate-900 to-indigo-900",
        content: (
            <div className="flex justify-center gap-4 w-full px-8">
                <div className="bg-white/10 p-4 rounded-xl flex-1 text-center border hover:border-white">
                    <h4 className="text-white font-bold mb-2">SaaS Cloud</h4>
                    <p className="text-slate-400 text-xs">اشتراك شهري</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl flex-1 text-center border hover:border-white">
                    <h4 className="text-white font-bold mb-2">On-Premise</h4>
                    <p className="text-slate-400 text-xs">شراء ترخيص مدى الحياة</p>
                </div>
            </div>
        )
    },
    {
        id: '22-timeline',
        section: "8. التنفيذ",
        title: "الجدول الزمني",
        subtitle: "Implementation Timeline",
        bg: "from-slate-900 to-slate-800",
        content: (
            <div className="space-y-4 w-3/4">
                <div className="flex gap-4 items-center">
                    <div className="w-24 text-white text-xs text-right">أسبوع 1-2</div>
                    <div className="h-4 bg-blue-500 rounded flex-1"></div>
                    <div className="text-white text-xs">التجهيز والتركيب</div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="w-24 text-white text-xs text-right">أسبوع 3</div>
                    <div className="h-4 bg-green-500 rounded w-1/2"></div>
                    <div className="text-white text-xs">التشغيل التجريبي</div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="w-24 text-white text-xs text-right">أسبوع 4</div>
                    <div className="h-4 bg-purple-500 rounded w-full"></div>
                    <div className="text-white text-xs">الإطلاق الرسمي</div>
                </div>
            </div>
        )
    },
    {
        id: '23-roi',
        section: "8. التنفيذ",
        title: "العائد على الاستثمار",
        subtitle: "ROI Analysis",
        bg: "from-green-900 to-slate-900",
        content: (
            <div className="text-center space-y-4">
                <h3 className="text-3xl text-white font-bold">استرداد التكلفة في 6 أشهر</h3>
                <div className="grid grid-cols-2 gap-8 text-white mt-8">
                    <div>
                        <div className="text-4xl font-bold text-green-400">+25%</div>
                        <div>زيادة الإيرادات</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-red-400">-40%</div>
                        <div>تكاليف التشغيل</div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: '24-usp',
        section: "9. الخاتمة",
        title: "لماذا نحن؟",
        subtitle: "Why Choose Us?",
        bg: "from-blue-950 to-black",
        content: (
            <ul className="text-right space-y-4 text-white text-xl">
                <li className="flex items-center justify-end gap-2"><CheckCircle className="text-blue-500" /> فريق دعم تقني محلي</li>
                <li className="flex items-center justify-end gap-2"><CheckCircle className="text-blue-500" /> تحديثات مستمرة للنظام</li>
                <li className="flex items-center justify-end gap-2"><CheckCircle className="text-blue-500" /> ضمان صيانة شامل</li>
            </ul>
        )
    },
    {
        id: '25-contact',
        section: "9. الخاتمة",
        title: "تواصل معنا",
        subtitle: "للبدء في المشروع",
        bg: "from-black to-slate-900",
        content: (
            <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white">هل لديكم استفسارات؟</h2>
                <div className="flex justify-center gap-6">
                    <Link href="#" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-slate-200">info@smartpark.ai</Link>
                    <Link href="#" className="border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10">+964 780 000 0000</Link>
                </div>
            </div>
        )
    }
];

// --- MAIN PAGE COMPONENT ---

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

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
        <main className={cn("min-h-screen w-full relative overflow-hidden font-sans flex flex-col bg-gradient-to-br transition-colors duration-700", slide.bg)} dir="rtl">

            {/* BACKGROUND ANIMATION */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            {/* HEADER */}
            <header className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <Car className="text-white" size={20} />
                    <span className="text-white font-bold tracking-widest text-sm md:text-base">SMARTPARK.AI</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-blue-400 font-bold">{slide.section}</span>
                    <span className="text-slate-400 text-[10px] font-mono">
                        SLIDE {currentSlide + 1} / {SLIDES.length}
                    </span>
                </div>
            </header>

            {/* SLIDE CONTENT AREA */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, scale: 0.95, x: -50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.05, x: 50 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-5xl h-full flex flex-col"
                    >
                        {/* Slide Title */}
                        <div className="mb-6 md:mb-12 text-right">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-6xl font-black text-white mb-2"
                            >
                                {slide.title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg md:text-xl text-slate-400 font-light uppercase tracking-wider"
                            >
                                {slide.subtitle}
                            </motion.p>
                        </div>
                        {/* Slide Body */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl relative p-4 md:p-8 flex flex-col justify-center"
                        >
                            {slide.content}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* CONTROLS */}
            <footer className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50">
                <div className="w-24 md:w-48 text-left hidden md:block">
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 mx-auto md:mx-0" dir="ltr">
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

                <div className="text-right hidden md:block">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                        <Maximize size={16} /> خروج
                    </Link>
                </div>
            </footer>
        </main>
    );
}
