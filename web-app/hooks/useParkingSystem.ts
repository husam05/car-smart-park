import { useState, useEffect, useCallback, useRef } from 'react';
import { ParkingSpot, LogEntry } from '@/types';
import { generateLicensePlate } from '@/lib/utils';
import { GateControlRef } from '@/components/ControlPanel';
import { ParkingService } from '@/lib/db-service';

export function useParkingSystem() {
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
    const [mounted, setMounted] = useState(false);
    const [autoSimulate, setAutoSimulate] = useState(false);

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

    const initializeFirestoreGrid = useCallback(async () => {
        console.log("Initializing Firestore Grid...");
        const initialSpots: ParkingSpot[] = [];

        for (let f = 1; f <= 2; f++) {
            for (let i = 1; i <= 50; i++) {
                initialSpots.push({
                    id: `${f === 1 ? 'A' : 'B'}-${i.toString().padStart(2, '0')}`,
                    status: 'free',
                    floor: f as 1 | 2,
                    lastChanged: new Date(),
                });
            }
        }
        await ParkingService.initializeGrid(initialSpots);
    }, []);

    // Initialize & Subscribe to Firebase
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        // Subscribe to Spots
        const unsubscribeSpots = ParkingService.subscribeToSpots((newSpots) => {
            if (newSpots.length === 0) {
                // Initialize if empty
                initializeFirestoreGrid();
            } else {
                // Sort spots by ID to ensure consistency
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
    }, [initializeFirestoreGrid]);

    // Handlers
    const handleEntry = useCallback(async (plate: string, city: string) => {
        // Check if car already exists (locally synchronized state)
        if (spots.some(s => s.vehicle?.plateCode === plate)) {
            return;
        }

        setIncomingCar({ plate, city });
        await new Promise(r => setTimeout(r, 1000));

        setLastReceipt({
            type: 'ENTRY',
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            plate: plate,
            city: city,
            entryTime: new Date()
        });
    }, [spots]);

    const finalizeEntry = useCallback(async (confirmed: boolean = true) => {
        if (!confirmed) {
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        if (!lastReceipt || lastReceipt.type !== 'ENTRY') return;

        const { plate, city } = lastReceipt;

        // Find first free spot
        const freeSpot = spots.find(s => s.status === 'free');
        if (!freeSpot) {
            alert("No free spots available!");
            setIncomingCar(null);
            setLastReceipt(null);
            return;
        }

        const entryTime = new Date();

        // 1. Update Spot in Firestore
        await ParkingService.updateSpot(freeSpot.id, {
            status: 'occupied',
            lastChanged: entryTime,
            vehicle: {
                plateCode: plate,
                city: city,
                entryTime: entryTime
            }
        });

        // 2. Add Log to Firestore
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

    const handleExit = useCallback(async (plate?: string) => {
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

        // Calculate payment
        const exitTime = new Date();
        // Use stored entry time (convert from Firestore timestamp if needed handled in helper or assume date)
        // Note: In `setSpots` from subscription we might need to ensure Dates are Dates.
        const entryTime = new Date(vehicleData.entryTime);

        const durationMs = exitTime.getTime() - entryTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        const cost = Math.max(2000, Math.ceil(durationHours) * 2000);

        // Animation
        setOutgoingCar({ plate: vehicleData.plateCode, city: vehicleData.city });

        // 1. Update Spot in Firestore (Free it)
        await ParkingService.freeSpot(targetSpot.id);

        // 2. Log Exit
        await ParkingService.addLog({
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
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

    // Auto Simulation Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoSimulate) {
            interval = setInterval(() => {
                const randomAction = Math.random();
                if (randomAction > 0.45) {
                    const { code, city } = generateLicensePlate();
                    handleEntry(code, city);
                } else {
                    handleExit();
                }
            }, 10000); // Faster simulation for testing
        }
        return () => clearInterval(interval);
    }, [autoSimulate, handleEntry, handleExit]);

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
        gateControlRef
    };
}
