'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useParkingSystem } from '@/hooks/useParkingSystem';

type ParkingContextType = ReturnType<typeof useParkingSystem>;

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: ReactNode }) {
    const parking = useParkingSystem();
    return (
        <ParkingContext.Provider value={parking}>
            {children}
        </ParkingContext.Provider>
    );
}

export function useParking() {
    const context = useContext(ParkingContext);
    if (context === undefined) {
        throw new Error('useParking must be used within a ParkingProvider');
    }
    return context;
}
