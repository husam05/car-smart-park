'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParkingSpot, LogEntry } from '@/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

interface ParkingContextType {
    spots: ParkingSpot[];
    logs: LogEntry[];
    isConnected: boolean;
    loading: boolean;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: ReactNode }) {
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize with local data if Firebase is not connected
    useEffect(() => {
        // Check if we have valid firebase config
        const hasConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

        if (!hasConfig) {
            console.log("Running in Local Simulation Mode (No Firebase Config)");
            const localSpots = localStorage.getItem('smartpark_spots_v1');
            if (localSpots) {
                setSpots(JSON.parse(localSpots));
            }
            setLoading(false);
            return;
        }

        setIsConnected(true);

        // Subscribe to Spots
        const unsubscribeSpots = onSnapshot(collection(db, 'spots'), (snapshot) => {
            const liveSpots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParkingSpot));
            setSpots(liveSpots.length > 0 ? liveSpots : []); // If empty, keep empty or init?
            setLoading(false);
        }, (err) => {
            console.error("Firebase Spots Error:", err);
            setIsConnected(false);
        });

        // Subscribe to Logs
        const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(50));
        const unsubscribeLogs = onSnapshot(q, (snapshot) => {
            const liveLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
            setLogs(liveLogs);
        });

        return () => {
            unsubscribeSpots();
            unsubscribeLogs();
        };
    }, []);

    return (
        <ParkingContext.Provider value={{ spots, logs, isConnected, loading }}>
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
