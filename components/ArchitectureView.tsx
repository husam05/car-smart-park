import React from 'react';
import { Server, Monitor, Database, Cpu, Camera, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ArchitectureView() {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="min-h-[850px] relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl flex flex-col">

                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>

                {/* Animated Grid Floor */}
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent perspective-1000 transform-style-3d opacity-30">
                    <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                </div>

                {/* Header Content */}
                <div className="relative z-10 p-8 border-b border-white/5 bg-white/5 backdrop-blur-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 flex items-center gap-3">
                            <Server className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            الهيكلية التقنية المتقدمة (Neural Topology)
                        </h2>
                        <p className="text-slate-400 text-sm mt-1 font-mono tracking-wider ml-11">LIVE SYSTEM DIAGNOSTICS /// V2.0.4-STABLE</p>
                    </div>
                </div>

                {/* Main Diagram Area */}
                <div className="flex-1 relative p-12 flex flex-col items-center justify-center gap-16">

                    {/* Level 1: Cloud/Application */}
                    <div className="relative z-20 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative w-[500px] h-24 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                            {/* Reflection Effect */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 rounded-t-2xl pointer-events-none"></div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                    <Monitor className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Control Dashboard</h3>
                                    <p className="text-xs text-indigo-300 font-mono">React 19 / OneVercel</p>
                                </div>
                            </div>

                            {/* Animated Data Dots */}
                            <div className="flex-1 mx-8 h-[1px] bg-slate-700 relative overflow-hidden">
                                <div className="absolute top-1/2 -translate-y-1/2 w-20 h-1 bg-indigo-500 blur-[2px] animate-[shimmer_2s_infinite]"></div>
                            </div>

                            <div className="flex items-center gap-4 text-right">
                                <div>
                                    <h3 className="text-white font-bold">Cloud Database</h3>
                                    <p className="text-xs text-orange-300 font-mono">PostgreSQL (Supabase)</p>
                                </div>
                                <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                                    <Database className="w-8 h-8 text-orange-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Bus */}
                    <div className="h-24 w-[2px] bg-gradient-to-b from-indigo-500/50 via-blue-500/50 to-transparent relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-blue-400 to-transparent animate-[drop_1.5s_infinite]"></div>
                    </div>

                    {/* Level 2: The Core (Edge AI) */}
                    <div className="relative z-20">
                        <div className="relative bg-black/60 border border-green-500/30 p-1 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                            {/* Glowing Border Animation */}
                            <div className="absolute inset-0 border-2 border-transparent rounded-3xl [mask:linear-gradient(white,white)] content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-green-500/50 before:to-transparent before:animate-[border-rotate_4s_linear_infinite]"></div>

                            <div className="bg-slate-900/90 backdrop-blur-xl rounded-[20px] p-8 flex items-center gap-8 min-w-[600px] relative overflow-hidden">
                                {/* Background Tech Pattern */}
                                <div className="absolute inset-0 opacity-5 bg-[legacy-pattern] pointer-events-none"></div>

                                <div className="p-4 bg-green-900/20 rounded-2xl border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                    <Cpu className="w-12 h-12 text-green-400 animate-pulse" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold text-white">NVIDIA Jetson Orin NX</h3>
                                        <span className="text-xs font-mono text-green-400 border border-green-500/30 px-2 py-1 rounded bg-green-500/10">AI CORE ACTIVE</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-xs font-mono text-slate-400 mt-4">
                                        <div className="bg-slate-800/50 p-2 rounded border border-white/5">
                                            <span className="block text-slate-500 mb-1">NPU LOAD</span>
                                            <span className="text-white">42%</span>
                                        </div>
                                        <div className="bg-slate-800/50 p-2 rounded border border-white/5">
                                            <span className="block text-slate-500 mb-1">TEMP</span>
                                            <span className="text-white">56°C</span>
                                        </div>
                                        <div className="bg-slate-800/50 p-2 rounded border border-white/5">
                                            <span className="block text-slate-500 mb-1">FPS</span>
                                            <span className="text-white">32.4</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Mirror Reflection beneath the card */}
                        <div className="h-12 w-full mx-auto bg-gradient-to-b from-green-500/10 to-transparent scale-y-[-1] opacity-30 transform blur-sm rounded-t-3xl mt-1"></div>
                    </div>

                    {/* Branching Connectors */}
                    <div className="w-[600px] h-[2px] bg-slate-800 relative flex justify-between">
                        {/* Connection Dots */}
                        <div className="absolute -top-[3px] -left-[3px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_blue]"></div>
                        <div className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_blue]"></div>

                        {/* Vertical drops */}
                        <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-slate-800 to-blue-500/30"></div>
                        <div className="absolute top-0 right-0 w-[2px] h-16 bg-gradient-to-b from-slate-800 to-red-500/30"></div>
                    </div>

                    {/* Level 3: Field Devices (Entry/Exit) */}
                    <div className="w-full flex justify-between px-12 pb-12">

                        {/* ENTRY NODE */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative w-72 bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Camera size={20} /></div>
                                    <h4 className="font-bold text-white">Entry Lane</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs p-2 bg-slate-800 rounded border border-white/5">
                                        <span className="text-slate-400">LPR Cam</span>
                                        <span className="text-green-400 font-mono">ONLINE</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs p-2 bg-slate-800 rounded border border-white/5">
                                        <span className="text-slate-400">Loop Sensor</span>
                                        <span className="text-green-400 font-mono">ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EXIT NODE */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-red-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative w-72 bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><Zap size={20} /></div>
                                    <h4 className="font-bold text-white">Exit Lane</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs p-2 bg-slate-800 rounded border border-white/5">
                                        <span className="text-slate-400">LPR Cam</span>
                                        <span className="text-green-400 font-mono">ONLINE</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs p-2 bg-slate-800 rounded border border-white/5">
                                        <span className="text-slate-400">Payment Kiosk</span>
                                        <span className="text-yellow-400 font-mono">STANDBY</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
