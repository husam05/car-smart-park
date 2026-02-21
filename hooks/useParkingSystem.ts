import { useState, useEffect, useCallback, useRef } from 'react';
import { ParkingSpot, LogEntry } from '@/types';
import { generateLicensePlate } from '@/lib/utils';
import { GateControlRef } from '@/components/ControlPanel';
import { PARKING_CONFIG, calculateParkingCost } from '@/lib/config';

const isFirebaseConfigured = () => {
    return !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
};

const generateInitialSpots = (): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    for (let f = 1; f <= PARKING_CONFIG.FLOORS; f++) {
        for (let i = 1; i <= PARKING_CONFIG.SPOTS_PER_FLOOR; i++) {
            spots.push({
                id: `${f === 1 ? 'A' : 'B'}-${i.toString().padStart(2, '0')}`,
                status: 'free',
                floor: f as 1 | 2,
                lastChanged: new Date(),
            });
        }
    }
    return spots;
};

export function useParkingSystem() {
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [autoSimulate, setAutoSimulate] = useState(false);
    const [isLocalMode, setIsLocalMode] = useState(false);

    const [lastReceipt, setLastReceipt] = useState<{
        type: 'ENTRY' | 'EXIT';
        id: string;
        plate: string;
        city: string;
        entryTime: Date;
        spotId?: string;
        exitTime?: Date;
        duration?: string;
        amount?: number;
        paymentMethod?: 'CASH';
    } | null>(null);

    const [incomingCar, setIncomingCar] = useState<{ plate: string, city: string } | null>(null);
    const [outgoingCar, setOutgoingCar] = useState<{ plate: string, city: string } | null>(null);

    const gateControlRef = useRef<GateControlRef>(null);
    const processingRef = useRef(false);
    const outgoingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const unsubscribeRef = useRef<(() => void)[]>([]);

    // Statistics
    const parkedCount = spots.filter(s => s.status === 'occupied').length;
    const occupiedCount = parkedCount + (outgoingCar ? 1 : 0);
    const totalRevenue = logs.reduce((acc, log) => acc + (log.amount || 0), 0);
    const todaysExits = logs.filter(l => l.type === 'exit').length;

    // Initialize
    useEffect(() => {
        setMounted(true);
        const useFirebase = isFirebaseConfigured();

        if (!useFirebase) {
            setIsLocalMode(true);
            setSpots(generateInitialSpots());
            setLoading(false);
        } else {
            import('@/lib/db-service').then(({ ParkingService }) => {
                const unsubSpots = ParkingService.subscribeToSpots(
                    (newSpots) => {
                        if (newSpots.length === 0) {
                            const initialSpots = generateInitialSpots();
                            ParkingService.initializeGrid(initialSpots);
                        } else {
                            setSpots(newSpots.sort((a, b) => a.id.localeCompare(b.id)));
                        }
                        setLoading(false);
                    },
                    (error) => {
                        console.error('Spots subscription failed, falling back to local:', error);
                        setIsLocalMode(true);
                        setSpots(generateInitialSpots());
                        setLoading(false);
                    }
                );

                const unsubLogs = ParkingService.subscribeToLogs(
                    (newLogs) => setLogs(newLogs),
                    (error) => console.error('Logs subscription failed:', error)
                );

                unsubscribeRef.current = [unsubSpots, unsubLogs];
            });
        }

        return () => {
            unsubscribeRef.current.forEach(unsub => unsub());
        };
    }, []);

    // Cleanup outgoing timer on unmount
    useEffect(() => {
        return () => {
            if (outgoingTimerRef.current) {
                clearTimeout(outgoingTimerRef.current);
            }
        };
    }, []);

    // Unified Entry Handler
    const handleEntry = useCallback(async (plate: string, city: string) => {
        if (processingRef.current) return;
        if (incomingCar?.plate === plate) return;
        if (spots.some(s => s.vehicle?.plateCode === plate)) return;

        if (lastReceipt?.type === 'ENTRY') {
            setLastReceipt(null);
        }

        processingRef.current = true;
        try {
            setIncomingCar({ plate, city });
            await new Promise(r => setTimeout(r, 1000));

            const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

            setLastReceipt({
                type: 'ENTRY',
                id: ticketId,
                plate,
                city,
                entryTime: new Date()
            });
        } finally {
            processingRef.current = false;
        }
    }, [spots, lastReceipt, incomingCar]);

    // Unified Finalize Entry
    const finalizeEntry = useCallback(async (confirmed: boolean = true) => {
        if (!confirmed) {
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        if (!lastReceipt || lastReceipt.type !== 'ENTRY') return;

        const { plate, city } = lastReceipt;
        const freeSpot = spots.find(s => s.status === 'free');
        if (!freeSpot) {
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        const entryTime = new Date();

        // Update local state
        setSpots(prev => prev.map(s =>
            s.id === freeSpot.id
                ? {
                    ...s,
                    status: 'occupied' as const,
                    lastChanged: entryTime,
                    vehicle: { plateCode: plate, city, entryTime }
                }
                : s
        ));

        const newLog: LogEntry = {
            id: lastReceipt.id,
            type: 'entry',
            timestamp: entryTime,
            plate,
            gateId: 'MAIN-ENTRY',
            receiptPrinted: true
        };

        if (isLocalMode) {
            setLogs(prev => [newLog, ...prev].slice(0, 50));
        } else {
            try {
                const { ParkingService } = await import('@/lib/db-service');
                await ParkingService.updateSpot(freeSpot.id, {
                    status: 'occupied',
                    lastChanged: entryTime,
                    vehicle: { plateCode: plate, city, entryTime }
                });
                await ParkingService.addLog(newLog);
            } catch (error) {
                console.error('Failed to persist entry to Firebase:', error);
            }
        }

        setIncomingCar(null);
        setLastReceipt(null);
        gateControlRef.current?.openEntryGate();
    }, [lastReceipt, spots, isLocalMode]);

    // Unified Exit Handler
    const handleExit = useCallback(async (plate?: string) => {
        if (processingRef.current) return;

        let targetSpot: ParkingSpot | undefined;
        if (plate) {
            targetSpot = spots.find(s => s.status === 'occupied' && s.vehicle?.plateCode === plate);
        } else {
            const now = Date.now();
            const eligible = spots.filter(s => {
                if (s.status !== 'occupied' || !s.vehicle) return false;
                const entry = new Date(s.vehicle.entryTime).getTime();
                return (now - entry) > PARKING_CONFIG.MIN_STAY_MINUTES * 60 * 1000;
            });
            if (eligible.length > 0) {
                targetSpot = eligible[Math.floor(Math.random() * eligible.length)];
            }
        }

        if (!targetSpot || !targetSpot.vehicle) return;

        processingRef.current = true;
        try {
            const vehicleData = targetSpot.vehicle;
            const targetSpotId = targetSpot.id;
            const exitTime = new Date();
            const entryTime = new Date(vehicleData.entryTime);
            const cost = calculateParkingCost(entryTime, exitTime);

            // Clear previous outgoing timer
            if (outgoingTimerRef.current) {
                clearTimeout(outgoingTimerRef.current);
            }

            setOutgoingCar({ plate: vehicleData.plateCode, city: vehicleData.city });

            // Update local state
            setSpots(prev => prev.map(s =>
                s.id === targetSpotId
                    ? { ...s, status: 'free' as const, lastChanged: exitTime, vehicle: undefined }
                    : s
            ));

            const newLog: LogEntry = {
                id: `EXIT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                type: 'exit',
                timestamp: exitTime,
                plate: vehicleData.plateCode,
                gateId: 'MAIN-EXIT',
                amount: cost
            };

            if (isLocalMode) {
                setLogs(prev => [newLog, ...prev].slice(0, 50));
            } else {
                try {
                    const { ParkingService } = await import('@/lib/db-service');
                    await ParkingService.freeSpot(targetSpotId);
                    await ParkingService.addLog(newLog);
                } catch (error) {
                    console.error('Failed to persist exit to Firebase:', error);
                }
            }

            gateControlRef.current?.openExitGate();

            outgoingTimerRef.current = setTimeout(() => {
                setOutgoingCar(null);
                outgoingTimerRef.current = null;
            }, PARKING_CONFIG.OUTGOING_CAR_DISPLAY_MS);
        } finally {
            processingRef.current = false;
        }
    }, [spots, isLocalMode]);

    // Ref-based handlers for intervals
    const handleEntryRef = useRef(handleEntry);
    const handleExitRef = useRef(handleExit);

    useEffect(() => {
        handleEntryRef.current = handleEntry;
        handleExitRef.current = handleExit;
    }, [handleEntry, handleExit]);

    // Auto Simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoSimulate) {
            const { code, city } = generateLicensePlate();
            handleEntryRef.current(code, city);

            interval = setInterval(() => {
                const randomAction = Math.random();
                if (randomAction > 0.45) {
                    const { code, city } = generateLicensePlate();
                    handleEntryRef.current(code, city);
                } else {
                    handleExitRef.current();
                }
            }, PARKING_CONFIG.SIMULATION_INTERVAL_MS);
        }
        return () => clearInterval(interval);
    }, [autoSimulate]);

    // Auto-confirm entry receipts in simulation mode - DISABLED
    useEffect(() => {
        if (autoSimulate && lastReceipt?.type === 'ENTRY') {
            // Manual confirmation required
        }
    }, [autoSimulate, lastReceipt]);

    return {
        spots,
        logs,
        activeFloor,
        setActiveFloor,
        stats: { parkedCount, occupiedCount, totalRevenue, todaysExits },
        incomingCar,
        outgoingCar,
        lastReceipt,
        autoSimulate,
        setAutoSimulate,
        mounted,
        loading,
        handleEntry,
        handleExit,
        finalizeEntry,
        gateControlRef,
        isLocalMode
    };
}
