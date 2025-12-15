'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Car, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SearchResult {
    found: boolean;
    floor?: number;
    spot?: string;
    entryTime?: Date;
    cost?: number;
    paid?: boolean;
}

function DriverAppContent() {
    const searchParams = useSearchParams();
    const [plate, setPlate] = useState(searchParams.get('plate') || '');
    const [ticketId, setTicketId] = useState(searchParams.get('ticket') || '');

    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-search if ticket is present
    useEffect(() => {
        if (ticketId && plate) {
            handleSearch(new Event('submit') as any);
        }
    }, [ticketId]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Integrate with Firebase Query using ticketId or plate
        // Simulating search delay
        setTimeout(() => {
            // Mock result
            if (plate.length > 2 || ticketId) {
                setSearchResult({
                    found: true,
                    floor: 1,
                    spot: 'A-12',
                    entryTime: new Date(Date.now() - 3600000), // 1 hour ago
                    cost: 5000,
                    paid: true // Pre-paid model
                });
            } else {
                setSearchResult({ found: false });
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans" dir="rtl">
            <header className="flex justify-between items-center mb-8 pt-4">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Car className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold">خدمات السائقين</h1>
                        {ticketId && <span className="text-[10px] text-slate-400 font-mono">ID: {ticketId}</span>}
                    </div>
                </div>
                <Link href="/" className="text-sm text-slate-400 hover:text-white">
                    لوحة التحكم
                </Link>
            </header>

            <main className="max-w-md mx-auto space-y-6">

                {/* Search Card */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Search className="text-blue-400" size={20} />
                        ابحث عن مركبتك
                    </h2>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1.5">رقم اللوحة</label>
                            <input
                                type="text"
                                value={plate}
                                onChange={(e) => setPlate(e.target.value)}
                                placeholder="أدخل رقم اللوحة..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 transition-colors text-center font-mono tracking-widest"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !plate}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                        >
                            {loading ? 'جاري البحث...' : 'عرض التفاصيل'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {searchResult && (
                    <div className={cn(
                        "p-6 rounded-2xl border transition-all animate-in slide-in-from-bottom-4 fade-in duration-500",
                        searchResult.found ? "bg-green-900/10 border-green-500/30" : "bg-red-900/10 border-red-500/30"
                    )}>
                        {searchResult.found ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <span className="text-slate-400">حالة التذكرة</span>
                                    <span className="text-green-400 font-bold flex items-center gap-1">
                                        <CheckCircle size={16} />
                                        مدفوعة مسبقاً
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><MapPin size={12} /> الموقع المقترح</div>
                                        <div className="text-xl font-black text-white">
                                            طـ {searchResult.floor} <span className="text-slate-600 mx-1">|</span> {searchResult.spot}
                                        </div>
                                    </div>
                                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Clock size={12} /> وقت الدخول</div>
                                        <div className="text-xl font-bold text-white">
                                            {searchResult.entryTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-center text-sm p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <span className="text-green-300">تم استلام المبلغ</span>
                                        <span className="text-xl font-bold text-green-400">{searchResult.cost} د.ع</span>
                                    </div>
                                </div>

                                <div className="text-center text-xs text-slate-500 mt-4">
                                    نتمنى لك يوماً سعيداً! البوابة ستفتح تلقائياً عند المغادرة.
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="text-red-400 font-bold mb-1">لم يتم العثور على التذكرة</div>
                                <p className="text-sm text-slate-500">تأكد من رقم اللوحة وحاول مرة أخرى</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-slate-800/30 hover:bg-slate-800/60 p-4 rounded-2xl border border-white/5 text-left transition-colors group">
                        <div className="bg-purple-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Clock className="text-purple-400" size={20} />
                        </div>
                        <div className="font-bold text-sm text-slate-200">حجز مسبق</div>
                        <div className="text-[10px] text-slate-500 mt-1">احجز موقفك قبل الوصول</div>
                    </button>
                    <button className="bg-slate-800/30 hover:bg-slate-800/60 p-4 rounded-2xl border border-white/5 text-left transition-colors group">
                        <div className="bg-orange-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Car className="text-orange-400" size={20} />
                        </div>
                        <div className="font-bold text-sm text-slate-200">الاشتراكات</div>
                        <div className="text-[10px] text-slate-500 mt-1">باقات شهرية مخفضة</div>
                    </button>
                </div>

            </main >
        </div >
    );
}

export default function DriverApp() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>}>
            <DriverAppContent />
        </Suspense>
    );
}


