'use client';

import { ParkingSpot } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';
import React from 'react';




// Update SpotItem to use layoutId for the car
const SpotItem = React.memo(({ spot, onClick, onDoubleClick }: { spot: ParkingSpot, onClick: (s: ParkingSpot) => void, onDoubleClick?: (s: ParkingSpot) => void }) => {
    return (
        <motion.button
            layout
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={() => onClick(spot)}
            onDoubleClick={() => onDoubleClick?.(spot)}
            className={cn(
                "relative aspect-[3/4] rounded-lg border flex flex-col items-center justify-center p-1 transition-colors",
                spot.status === 'free'
                    ? "border-slate-700 bg-slate-800/30 hover:bg-slate-700/50"
                    : "border-red-500/30 bg-red-900/10"
            )}
        >
            <span className="text-[10px] font-mono text-slate-500 absolute top-1 right-2">{spot.id.split('-')[1]}</span>

            {spot.status === 'occupied' && spot.vehicle ? (
                <motion.div
                    layoutId={`car-${spot.vehicle.plateCode}`}
                    className="flex flex-col items-center"
                    transition={{ type: "spring", stiffness: 50, damping: 12 }} // Nice movement physics
                >
                    <Car className="w-8 h-8 text-red-400 mb-1 fill-red-400/20" />
                    <div className="text-[9px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded border border-white/10 truncate max-w-[60px]" dir="ltr">
                        {spot.vehicle.plateCode}
                    </div>
                </motion.div>
            ) : (
                <div className="w-4 h-4 rounded-full bg-green-500/20 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            )}
        </motion.button>
    );
}, (prev, next) => {
    return prev.spot.status === next.spot.status &&
        prev.spot.vehicle?.plateCode === next.spot.vehicle?.plateCode;
});

SpotItem.displayName = 'SpotItem';

interface ParkingMapProps {
    spots: ParkingSpot[];
    floor: 1 | 2;
    onSpotClick: (spot: ParkingSpot) => void;
    onSpotDoubleClick?: (spot: ParkingSpot) => void;
}

export default function ParkingMap({ spots, floor, onSpotClick, onSpotDoubleClick }: ParkingMapProps) {
    const floorSpots = spots.filter(s => s.floor === floor);

    return (
        <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-white/5 relative overflow-hidden">

            {/* Parking Grid */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    <AnimatePresence>
                        {floorSpots.map((spot) => (
                            <SpotItem
                                key={spot.id}
                                spot={spot}
                                onClick={onSpotClick}
                                onDoubleClick={onSpotDoubleClick}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Update SpotItem to use layoutId for the car

