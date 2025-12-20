import { useState, useEffect, useCallback, useRef } from 'react';
import { ParkingSpot, LogEntry } from '@/types';
import { generateLicensePlate } from '@/lib/utils';
import { GateControlRef } from '@/components/ControlPanel';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
    return !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
};

// Generate initial parking spots
const generateInitialSpots = (): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    for (let f = 1; f <= 2; f++) {
        for (let i = 1; i <= 50; i++) {
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
    const [autoSimulate, setAutoSimulate] = useState(false);
    const [isLocalMode, setIsLocalMode] = useState(false);

    /* Payment & Reporting State */
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

    /* State for Animation */
    const [incomingCar, setIncomingCar] = useState<{ plate: string, city: string } | null>(null);
    const [outgoingCar, setOutgoingCar] = useState<{ plate: string, city: string } | null>(null);

    /* Gate Control Ref */
    const gateControlRef = useRef<GateControlRef>(null);

    // Statistics
    const parkedCount = spots.filter(s => s.status === 'occupied').length;
    const occupiedCount = parkedCount + (outgoingCar ? 1 : 0);
    const totalRevenue = logs.reduce((acc, log) => acc + (log.amount || 0), 0);
    const todaysExits = logs.filter(l => l.type === 'exit').length;

    // Initialize - Check for Firebase or use local mode
    useEffect(() => {
        setMounted(true);

        const useFirebase = isFirebaseConfigured();

        if (!useFirebase) {
            console.log('🚗 Smart Parking: Running in LOCAL SIMULATION MODE');
            setIsLocalMode(true);

            // Initialize with local spots
            const initialSpots = generateInitialSpots();
            setSpots(initialSpots);
        } else {
            console.log('🚗 Smart Parking: Connecting to Firebase...');
            // Dynamic import Firebase service only if configured
            import('@/lib/db-service').then(({ ParkingService }) => {
                // Subscribe to Spots
                const unsubscribeSpots = ParkingService.subscribeToSpots((newSpots) => {
                    if (newSpots.length === 0) {
                        // Initialize grid in Firebase if empty
                        const initialSpots = generateInitialSpots();
                        ParkingService.initializeGrid(initialSpots);
                    } else {
                        const sorted = newSpots.sort((a, b) => a.id.localeCompare(b.id));
                        setSpots(sorted);
                    }
                });

                // Subscribe to Logs
                const unsubscribeLogs = ParkingService.subscribeToLogs((newLogs) => {
                    setLogs(newLogs);
                });

                return () => {
                    unsubscribeSpots();
                    unsubscribeLogs();
                };
            });
        }
    }, []);

    // LOCAL MODE: Handle Entry
    const handleEntryLocal = useCallback(async (plate: string, city: string) => {
        if (spots.some(s => s.vehicle?.plateCode === plate)) {
            return;
        }

        // Auto-cancel any pending receipt from previous car
        if (lastReceipt?.type === 'ENTRY') {
            console.log('🔄 [AUTO-CANCEL] Previous entry cancelled - new car arriving');
            setLastReceipt(null);
        }

        setIncomingCar({ plate, city });
        await new Promise(r => setTimeout(r, 1000));

        // Generate a stable ticket ID using timestamp + random string
        const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        setLastReceipt({
            type: 'ENTRY',
            id: ticketId,
            plate: plate,
            city: city,
            entryTime: new Date()
        });
    }, [spots, lastReceipt]);

    // LOCAL MODE: Finalize Entry
    const finalizeEntryLocal = useCallback(async (confirmed: boolean = true) => {
        console.log('🔔 [FINALIZE ENTRY LOCAL] Confirmed:', confirmed);
        if (!confirmed) {
            console.log('❌ [ENTRY CANCELLED]');
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        if (!lastReceipt || lastReceipt.type !== 'ENTRY') {
            console.log('⚠️ [NO RECEIPT] Cannot finalize');
            return;
        }

        const { plate, city } = lastReceipt;

        // Find first free spot
        const freeSpot = spots.find(s => s.status === 'free');
        if (!freeSpot) {
            console.log("⚠️ No free spots available!");
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        const entryTime = new Date();

        // Update spot locally
        setSpots(prev => prev.map(s =>
            s.id === freeSpot.id
                ? {
                    ...s,
                    status: 'occupied' as const,
                    lastChanged: entryTime,
                    vehicle: {
                        plateCode: plate,
                        city: city,
                        entryTime: entryTime
                    }
                }
                : s
        ));

        // Add log locally
        const newLog: LogEntry = {
            id: lastReceipt.id,
            type: 'entry',
            timestamp: entryTime,
            plate: plate,
            gateId: 'MAIN-ENTRY',
            receiptPrinted: true
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));

        setIncomingCar(null);
        setLastReceipt(null);
        gateControlRef.current?.openEntryGate();
    }, [lastReceipt, spots]);

    // LOCAL MODE: Handle Exit
    const handleExitLocal = useCallback(async (plate?: string) => {
        let targetSpot: ParkingSpot | undefined;

        if (plate) {
            targetSpot = spots.find(s => s.status === 'occupied' && s.vehicle?.plateCode === plate);
        } else {
            // Random exit logic
            const occupiedSpots = spots.filter(s => s.status === 'occupied');
            if (occupiedSpots.length > 0) {
                targetSpot = occupiedSpots[Math.floor(Math.random() * occupiedSpots.length)];
            }
        }

        if (!targetSpot || !targetSpot.vehicle) return;

        const vehicleData = targetSpot.vehicle;
        const targetSpotId = targetSpot.id;

        // Calculate payment
        const exitTime = new Date();
        const entryTime = new Date(vehicleData.entryTime);
        const durationMs = exitTime.getTime() - entryTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        const cost = Math.max(2000, Math.ceil(durationHours) * 2000);

        // Animation
        setOutgoingCar({ plate: vehicleData.plateCode, city: vehicleData.city });

        // Update spot locally (Free it)
        setSpots(prev => prev.map(s =>
            s.id === targetSpotId
                ? {
                    ...s,
                    status: 'free' as const,
                    lastChanged: exitTime,
                    vehicle: undefined
                }
                : s
        ));

        // Log Exit locally
        const newLog: LogEntry = {
            id: `EXIT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            type: 'exit',
            timestamp: exitTime,
            plate: vehicleData.plateCode,
            gateId: 'MAIN-EXIT',
            amount: cost
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));

        gateControlRef.current?.openExitGate();

        setTimeout(() => {
            setOutgoingCar(null);
        }, 3000);
    }, [spots]);

    // FIREBASE MODE: Handlers (imported dynamically)
    const handleEntryFirebase = useCallback(async (plate: string, city: string) => {
        if (spots.some(s => s.vehicle?.plateCode === plate)) {
            return;
        }

        // Auto-cancel any pending receipt from previous car
        if (lastReceipt?.type === 'ENTRY') {
            console.log('🔄 [AUTO-CANCEL] Previous entry cancelled - new car arriving');
            setLastReceipt(null);
        }

        console.log('🚗 [ENTRY START] Plate:', plate, 'City:', city);
        setIncomingCar({ plate, city });
        await new Promise(r => setTimeout(r, 1000));

        // Generate a stable ticket ID using timestamp + random string
        const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        console.log('📋 [TICKET GENERATED]', ticketId);

        setLastReceipt({
            type: 'ENTRY',
            id: ticketId,
            plate: plate,
            city: city,
            entryTime: new Date()
        });
    }, [spots, lastReceipt]);

    const finalizeEntryFirebase = useCallback(async (confirmed: boolean = true) => {
        console.log('🔔 [FINALIZE ENTRY FIREBASE] Confirmed:', confirmed);
        if (!confirmed) {
            console.log('❌ [ENTRY CANCELLED]');
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        if (!lastReceipt || lastReceipt.type !== 'ENTRY') {
            console.log('⚠️ [NO RECEIPT] Cannot finalize');
            return;
        }

        const { plate, city } = lastReceipt;
        const freeSpot = spots.find(s => s.status === 'free');
        if (!freeSpot) {
            alert("No free spots available!");
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        const entryTime = new Date();

        const { ParkingService } = await import('@/lib/db-service');

        await ParkingService.updateSpot(freeSpot.id, {
            status: 'occupied',
            lastChanged: entryTime,
            vehicle: {
                plateCode: plate,
                city: city,
                entryTime: entryTime
            }
        });

        await ParkingService.addLog({
            id: lastReceipt.id,
            type: 'entry',
            timestamp: entryTime,
            plate: plate,
            gateId: 'MAIN-ENTRY',
            receiptPrinted: true
        });

        setIncomingCar(null);
        setLastReceipt(null);
        gateControlRef.current?.openEntryGate();
    }, [lastReceipt, spots]);

    const handleExitFirebase = useCallback(async (plate?: string) => {
        let targetSpot: ParkingSpot | undefined;

        if (plate) {
            targetSpot = spots.find(s => s.status === 'occupied' && s.vehicle?.plateCode === plate);
        } else {
            const occupiedSpots = spots.filter(s => s.status === 'occupied');
            if (occupiedSpots.length > 0) {
                targetSpot = occupiedSpots[Math.floor(Math.random() * occupiedSpots.length)];
            }
        }

        if (!targetSpot || !targetSpot.vehicle) return;

        const vehicleData = targetSpot.vehicle;
        const exitTime = new Date();
        const entryTime = new Date(vehicleData.entryTime);
        const durationMs = exitTime.getTime() - entryTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        const cost = Math.max(2000, Math.ceil(durationHours) * 2000);

        setOutgoingCar({ plate: vehicleData.plateCode, city: vehicleData.city });

        const { ParkingService } = await import('@/lib/db-service');

        await ParkingService.freeSpot(targetSpot.id);

        await ParkingService.addLog({
            id: `EXIT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            type: 'exit',
            timestamp: exitTime,
            plate: vehicleData.plateCode,
            gateId: 'MAIN-EXIT',
            amount: cost
        });

        gateControlRef.current?.openExitGate();

        setTimeout(() => {
            setOutgoingCar(null);
        }, 3000);
    }, [spots]);

    // Select handler based on mode
    const handleEntry = isLocalMode ? handleEntryLocal : handleEntryFirebase;
    const finalizeEntry = isLocalMode ? finalizeEntryLocal : finalizeEntryFirebase;
    const handleExit = isLocalMode ? handleExitLocal : handleExitFirebase;

    // Use refs to avoid recreating interval when handlers change
    const handleEntryRef = useRef(handleEntry);
    const handleExitRef = useRef(handleExit);

    useEffect(() => {
        handleEntryRef.current = handleEntry;
        handleExitRef.current = handleExit;
    }, [handleEntry, handleExit]);

    // Auto Simulation Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoSimulate) {
            interval = setInterval(() => {
                const randomAction = Math.random();
                if (randomAction > 0.45) {
                    const { code, city } = generateLicensePlate();
                    handleEntryRef.current(code, city);
                } else {
                    handleExitRef.current();
                }
            }, 15000); // 15 second intervals - gives time to manually print and control gate
        }
        return () => clearInterval(interval);
    }, [autoSimulate]); // Only restart interval when autoSimulate changes

    // Auto-confirm entry receipts in simulation mode - DISABLED
    // Cars must be manually confirmed by clicking "Print and Open Gate"
    // This ensures proper workflow: detect -> show receipt -> print -> open gate -> enter
    useEffect(() => {
        // Log to console to prove this is disabled
        if (autoSimulate && lastReceipt?.type === 'ENTRY') {
            console.log('🚗 CAR WAITING AT GATE - Manual print required!');
            console.log('📋 Receipt ID:', lastReceipt.id);
            console.log('🚫 AUTO-ENTRY IS DISABLED - Click "طباعة وفتح البوابة" to proceed');
        }

        // Disabled auto-confirmation to require manual print
        // if (autoSimulate && lastReceipt?.type === 'ENTRY') {
        //     const timer = setTimeout(() => {
        //         finalizeEntry(true);
        //     }, 5000);
        //     return () => clearTimeout(timer);
        // }
    }, [autoSimulate, lastReceipt, finalizeEntry]);

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
        handleEntry,
        handleExit,
        finalizeEntry,
        gateControlRef,
        isLocalMode
    };
}
