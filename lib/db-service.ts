import { db } from './firebase';
import { collection, doc, updateDoc, addDoc, query, orderBy, limit, onSnapshot, setDoc, deleteField, Timestamp } from 'firebase/firestore';
import { ParkingSpot, LogEntry } from '@/types';

const SPOTS_COLLECTION = 'spots';
const LOGS_COLLECTION = 'logs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertTimestamp = (ts: Timestamp | Date | unknown) => (ts as any)?.toDate ? (ts as any).toDate() : ts;

export const ParkingService = {
    // Initialize grid in Firestore (run once)
    async initializeGrid(spots: ParkingSpot[]) {
        for (const spot of spots) {
            await setDoc(doc(db, SPOTS_COLLECTION, spot.id), spot);
        }
    },

    // Subscribe to spots changes (Real-time)
    subscribeToSpots(callback: (spots: ParkingSpot[]) => void) {
        const q = query(collection(db, SPOTS_COLLECTION));
        return onSnapshot(q, (snapshot) => {
            const spots = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    lastChanged: convertTimestamp(data.lastChanged),
                    vehicle: data.vehicle ? {
                        ...data.vehicle,
                        entryTime: convertTimestamp(data.vehicle.entryTime)
                    } : undefined
                } as ParkingSpot;
            });
            callback(spots);
        });
    },

    // Subscribe to logs (Real-time, last 50)
    subscribeToLogs(callback: (logs: LogEntry[]) => void) {
        const q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'), limit(50));
        return onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({
                ...doc.data(),
                timestamp: convertTimestamp(doc.data().timestamp)
            } as LogEntry));
            callback(logs);
        });
    },

    // Update a spot status
    async updateSpot(spotId: string, updates: Partial<ParkingSpot>) {
        const spotRef = doc(db, SPOTS_COLLECTION, spotId);
        await updateDoc(spotRef, updates);
    },

    // Clear vehicle from spot
    async freeSpot(spotId: string) {
        const spotRef = doc(db, SPOTS_COLLECTION, spotId);
        await updateDoc(spotRef, {
            status: 'free',
            lastChanged: new Date(),
            vehicle: deleteField()
        });
    },

    // Add a log entry
    async addLog(log: LogEntry) {
        await addDoc(collection(db, LOGS_COLLECTION), log);
    }
};
