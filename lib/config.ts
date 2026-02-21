// Centralized parking system configuration
export const PARKING_CONFIG = {
    // Pricing (IQD)
    HOURLY_RATE: 2000,
    MINIMUM_CHARGE: 2000,
    ENTRY_FEE: 5000,
    LOST_TICKET_FEE: 50000,

    // Capacity
    TOTAL_SPOTS: 100,
    FLOORS: 2,
    SPOTS_PER_FLOOR: 50,

    // Timing
    GATE_AUTO_CLOSE_SECONDS: 5,
    MIN_STAY_MINUTES: 3,
    SIMULATION_INTERVAL_MS: 15000,
    OUTGOING_CAR_DISPLAY_MS: 3000,

    // AI Detection
    AI_DETECTION_INTERVAL_MS: 2000,
    AI_AUTO_ACCEPT_CONFIDENCE: 0.75,
    AI_MIN_CONFIDENCE: 0.40,
} as const;

// Calculate parking cost based on duration
export function calculateParkingCost(entryTime: Date, exitTime: Date = new Date()): number {
    const durationMs = exitTime.getTime() - entryTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return Math.max(
        PARKING_CONFIG.MINIMUM_CHARGE,
        Math.ceil(durationHours) * PARKING_CONFIG.HOURLY_RATE
    );
}
