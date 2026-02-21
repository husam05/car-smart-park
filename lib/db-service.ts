import { db } from './firebase';
import { collection, doc, updateDoc, addDoc, query, orderBy, limit, onSnapshot, setDoc, deleteField, Timestamp, writeBatch } from 'firebase/firestore';
import { ParkingSpot, LogEntry } from '@/types';

const SPOTS_COLLECTION = 'spots';
const LOGS_COLLECTION = 'logs';

const convertTimestamp = (ts: unknown): Date => {
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts instanceof Date) return ts;
    if (typeof ts === 'string' || typeof ts === 'number') return new Date(ts);
    return new Date();
};

export const ParkingService = {
    // Initialize grid in Firestore (batch write)
    async initializeGrid(spots: ParkingSpot[]) {
        try {
            const batch = writeBatch(db);
            for (const spot of spots) {
                batch.set(doc(db, SPOTS_COLLECTION, spot.id), spot);
            }
            await batch.commit();
        } catch (error) {
            console.error('Failed to initialize parking grid:', error);
            throw error;
        }
    },

    // Subscribe to spots changes (Real-time)
    subscribeToSpots(
        callback: (spots: ParkingSpot[]) => void,
        onError?: (error: Error) => void
    ) {
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
        }, (error) => {
            console.error('Firestore spots subscription error:', error);
            onError?.(error);
        });
    },

    // Subscribe to logs (Real-time, last 50)
    subscribeToLogs(
        callback: (logs: LogEntry[]) => void,
        onError?: (error: Error) => void
    ) {
        const q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'), limit(50));
        return onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({
                ...doc.data(),
                timestamp: convertTimestamp(doc.data().timestamp)
            } as LogEntry));
            callback(logs);
        }, (error) => {
            console.error('Firestore logs subscription error:', error);
            onError?.(error);
        });
    },

    // Update a spot status
    async updateSpot(spotId: string, updates: Partial<ParkingSpot>) {
        try {
            const spotRef = doc(db, SPOTS_COLLECTION, spotId);
            await updateDoc(spotRef, updates);
        } catch (error) {
            console.error(`Failed to update spot ${spotId}:`, error);
            throw error;
        }
    },

    // Clear vehicle from spot
    async freeSpot(spotId: string) {
        try {
            const spotRef = doc(db, SPOTS_COLLECTION, spotId);
            await updateDoc(spotRef, {
                status: 'free',
                lastChanged: new Date(),
                vehicle: deleteField()
            });
        } catch (error) {
            console.error(`Failed to free spot ${spotId}:`, error);
            throw error;
        }
    },

    // Add a log entry
    async addLog(log: LogEntry) {
        try {
            await addDoc(collection(db, LOGS_COLLECTION), log);
        } catch (error) {
            console.error('Failed to add log:', error);
            throw error;
        }
    }
};
