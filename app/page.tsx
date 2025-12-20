'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, cn } from '@/lib/utils';
import StatsCard from '@/components/StatsCard';
import ParkingMap from '@/components/ParkingMap';
import CameraFeed from '@/components/CameraFeed';
import LogList from '@/components/LogList';
import ControlPanel from '@/components/ControlPanel';
import FinancialReport from '@/components/FinancialReport';
import PaymentReceiptModal from '@/components/PaymentReceiptModal';
import { useParkingSystem } from '@/hooks/useParkingSystem';
import { Car, Activity, Users, Play, Square, ArrowLeftRight, FileText, Printer } from 'lucide-react';

export default function Dashboard() {
  const {
    spots,
    logs,
    activeFloor,
    setActiveFloor,
    stats,
    incomingCar,
    outgoingCar,
    lastReceipt,
    autoSimulate,
    setAutoSimulate,
    mounted,
    handleEntry,
    handleExit,
    finalizeEntry,
    gateControlRef
  } = useParkingSystem();

  const [showReport, setShowReport] = useState(false);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans selection:bg-blue-500/30 overflow-x-hidden" dir="rtl">

      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md sticky top-4 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Car className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              نظام <span className="text-blue-500">المواقف</span> الذكي
            </h1>
            <p className="text-xs text-slate-500 font-mono">v2024.12.20-DEBUG | Build: {Date.now()}</p>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">نظام إدارة المواقف بالذكاء الاصطناعي</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 bg-slate-800/50 px-6 py-2 rounded-full border border-white/5">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">الإشغال</span>
              <span className="text-2xl font-black text-white leading-none">{stats.occupiedCount}<span className="text-sm text-slate-500 font-normal">/100</span></span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">الإيرادات</span>
              <span className="text-2xl font-black text-green-400 leading-none">{formatCurrency(stats.totalRevenue)}</span>
            </div>

            {/* Reports Button */}
            <button
              onClick={() => setShowReport(true)}
              className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="التقارير المالية"
            >
              <FileText size={20} />
            </button>

            {/* Separator */}
            <div className="w-px h-8 bg-white/10"></div>

            {/* System Status Link */}
            <Link
              href="/status"
              className="flex flex-col items-center group cursor-pointer"
              title="حالة النظام"
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold group-hover:text-blue-400 transition-colors">الحالة</span>
              <Activity size={20} className="text-slate-200 group-hover:text-blue-400 transition-colors" />
            </Link>


            {/* Driver App Link */}
            <div className="w-px h-8 bg-white/10"></div>

            <Link
              href="/driver"
              className="flex flex-col items-center group cursor-pointer"
              title="تطبيق السائقين"
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold group-hover:text-blue-400 transition-colors">السائقين</span>
              <Car size={20} className="text-slate-200 group-hover:text-blue-400 transition-colors" />
            </Link>
          </div>

          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95",
              autoSimulate
                ? "bg-red-500/10 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                : "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400"
            )}
          >
            {autoSimulate ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {autoSimulate ? 'إيقاف المحاكاة' : 'تشغيل المحاكاة'}
          </button>
        </div>
      </header>

      {/* SECTION 1: DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 min-h-[850px] mb-8">
        {/* Left Column: Map & Controls */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <StatsCard title="مواقف متاحة" value={100 - stats.occupiedCount} icon={Square} color="blue" />
            <StatsCard title="مستخدمين حاليين" value={12} icon={Users} color="purple" />
            <StatsCard title="مغادرات اليوم" value={stats.todaysExits} icon={ArrowLeftRight} color="orange" />
            <StatsCard title="حالة النظام" value="متصل" icon={Activity} color="green" />
          </div>

          {/* Gates Visualization - Moved to top */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-green-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              {/* Entry Gate */}
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-24 h-24 border-2 rounded-xl flex flex-col items-center justify-center relative transition-all",
                  lastReceipt?.type === 'ENTRY'
                    ? "border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                    : incomingCar
                      ? "border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                      : "border-green-500/30 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                )}>
                  <div className="absolute -top-3 bg-green-900 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/50 font-bold">بوابة الدخول</div>

                  {lastReceipt?.type === 'ENTRY' ? (
                    <div className="flex flex-col items-center">
                      <Car className="w-8 h-8 text-yellow-400 fill-current animate-bounce" />
                      <div className="text-[9px] bg-black text-white px-1 rounded mt-1" dir="ltr">{lastReceipt.plate}</div>
                    </div>
                  ) : incomingCar ? (
                    <div className="flex flex-col items-center animate-pulse">
                      <Car className="w-8 h-8 text-green-400 fill-current" />
                      <div className="text-[9px] bg-black text-white px-1 rounded mt-1" dir="ltr">{incomingCar.plate}</div>
                    </div>
                  ) : (
                    <div className="text-green-400/50">
                      <Car className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <div className="text-white font-bold text-sm">مدخل المركبات</div>
                    <div className="text-slate-400 text-xs">كاميرا LPR نشطة</div>
                  </div>

                  {/* Entry Confirmation Button - Shows when waiting */}
                  {lastReceipt?.type === 'ENTRY' && (
                    <button
                      onClick={() => {
                        finalizeEntry();
                        gateControlRef.current?.openEntryGate();
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg animate-pulse hover:animate-none transition-all"
                    >
                      <Printer size={16} />
                      طباعة الوصل وفتح البوابة
                    </button>
                  )}
                </div>
              </div>

              {/* Road Animation */}
              <div className="flex-1 mx-8 relative h-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-[2px] bg-gradient-to-l from-green-500/30 via-slate-700 to-blue-500/30"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-slate-900 px-4 py-1 rounded-full border border-white/10 text-slate-400 text-xs font-mono">
                    ← الشارع الرئيسي →
                  </div>
                </div>
              </div>

              {/* Exit Gate */}
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <div className="text-white font-bold text-sm">مخرج المركبات</div>
                  <div className="text-slate-400 text-xs">نظام الخروج التلقائي</div>
                </div>

                <div className={cn(
                  "w-24 h-24 border-2 rounded-xl flex flex-col items-center justify-center relative transition-all",
                  outgoingCar
                    ? "border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                    : "border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                )}>
                  <div className="absolute -top-3 bg-blue-900 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/50 font-bold">بوابة الخروج</div>

                  {outgoingCar ? (
                    <div className="flex flex-col items-center">
                      <Car className="w-8 h-8 text-green-400 fill-current animate-pulse" />
                      <div className="text-[9px] bg-black text-white px-1 rounded mt-1" dir="ltr">{outgoingCar.plate}</div>
                      <div className="text-[8px] text-green-400 mt-1 font-bold">جاري الخروج...</div>
                    </div>
                  ) : (
                    <div className="text-blue-400/50">
                      <Car className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Parking Map Area */}
          <div className="glass-card flex-1 p-1 rounded-2xl relative overflow-hidden flex flex-col shadow-2xl border border-white/10 group min-h-[500px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 z-10"></div>

            {/* Floor Tabs */}
            <div className="flex border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
              <button
                onClick={() => setActiveFloor(1)}
                className={cn(
                  "flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden",
                  activeFloor === 1 ? "text-white bg-white/5" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                الطابق ١ - الأرضي
                {activeFloor === 1 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
              </button>
              <button
                onClick={() => setActiveFloor(2)}
                className={cn(
                  "flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden",
                  activeFloor === 2 ? "text-white bg-white/5" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                الطابق ٢ - العلوي
                {activeFloor === 2 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
              </button>
            </div>

            {/* Map Content */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <ParkingMap
                spots={spots}
                floor={activeFloor}
                onSpotClick={(spot) => {
                  if (spot.status === 'occupied' && spot.vehicle) {
                    if (confirm(`هل تريد اخراج المركبة ${spot.vehicle.plateCode} يدوياً؟`)) {
                      handleExit(spot.vehicle.plateCode);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Controls & feeds */}
        <div className="space-y-6 flex flex-col h-full overflow-y-auto pr-2 pl-2">
          <div className="grid grid-cols-2 gap-4">
            <CameraFeed
              type="entry"
              onVehicleDetected={(plate, city) => handleEntry(plate, city)}
              activeVehicle={incomingCar}
              shouldReset={!lastReceipt && !incomingCar}
            />
            <CameraFeed
              type="exit"
              onVehicleDetected={() => handleExit()}
              activeVehicle={outgoingCar}
              shouldReset={!outgoingCar}
            />
          </div>
          <ControlPanel ref={gateControlRef} />
          <LogList logs={logs} />
        </div>
      </div>


      {
        showReport && (
          <FinancialReport
            logs={logs}
            onClose={() => setShowReport(false)}
          />
        )
      }

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        isOpen={!!lastReceipt}
        onClose={() => {
          // Just close without printing (cancel)
          finalizeEntry(false);
        }}
        onPrint={() => {
          // Confirm print and open gate
          finalizeEntry(true);
          gateControlRef.current?.openEntryGate();

          // Trigger browser print for the receipt part
          setTimeout(() => {
            const printContent = document.getElementById('receipt-preview');
            if (printContent) {
              const win = window.open('', '', 'height=600,width=400');
              win?.document.write('<html><head><title>Receipt</title>');
              win?.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">');
              win?.document.write('</head><body class="p-4">');
              win?.document.write(printContent.innerHTML);
              win?.document.write('</body></html>');
              win?.document.close();
              win?.print();
            }
          }, 500);
        }}
        vehicleDetails={lastReceipt ? {
          plate: lastReceipt.plate,
          entryTime: lastReceipt.entryTime,
          amount: 5000, // Standard Entry Fee
          spotId: lastReceipt.spotId,
          ticketId: lastReceipt.id
        } : null}
      />
    </main >
  );
}
