export interface ParkingSpot {
    id: string; // e.g., "A-01"
    status: 'free' | 'occupied' | 'reserved';
    floor: 1 | 2;
    lastChanged: Date;
    vehicle?: {
        plateCode: string; // e.g., "5521 A"
        city: string; // "Baghdad"
        entryTime: Date;
        image?: string; // Placeholder URL
        aiModelInfo?: {
            confidence: number; // 0.0 - 1.0
            inferenceTime: number; // ms
            model: string; // e.g., "YOLOv8n"
        };
    };
}

export interface LogEntry {
    id: string;
    type: 'entry' | 'exit';
    timestamp: Date;
    plate: string;
    gateId: string;
    image?: string;
    amount?: number; // Only for exit
    receiptPrinted?: boolean; // Track if receipt was printed
}

export interface Stats {
    totalSpots: number;
    occupiedSpots: number;
    todayRevenue: number;
    todayTraffic: number;
}
