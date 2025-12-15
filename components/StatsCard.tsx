'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color = "text-blue-400" }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl flex items-center justify-between relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={64} />
            </div>

            <div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                <div className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</div>
                {trend && (
                    <div className={cn("text-xs mt-2 font-medium", trendUp ? "text-green-400" : "text-red-400")}>
                        {trend}
                    </div>
                )}
            </div>

            <div className={cn("p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10", color)}>
                <Icon size={24} />
            </div>
        </motion.div>
    );
}
