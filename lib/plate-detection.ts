import { PARKING_CONFIG } from '@/lib/config';

// --- Types ---

export interface PlateDetectionResult {
    text: string;
    confidence: number;
    box: number[];
}

export interface DetectionResponse {
    plates: PlateDetectionResult[];
    inference_time_ms: number;
    model: string;
    device: string;
}

export type DetectionMode = 'simulation' | 'camera';
export type CameraSource = 'usb' | 'ip';

export interface CameraDevice {
    deviceId: string;
    label: string;
}

export interface CameraSettings {
    source: CameraSource;
    usbDeviceId: string; // '' = default
    ipUrl: string;       // e.g. rtsp://192.168.1.100:554/stream
}

// --- Constants ---

const DETECTION_API_URL = '/api/detect-plate';
const JPEG_QUALITY = 0.7;

export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
    source: 'usb',
    usbDeviceId: '',
    ipUrl: '',
};

// --- API Functions ---

/** Send a base64 image to the detection API and return results. */
export async function detectPlate(
    base64Image: string,
    confThreshold: number = 0.35
): Promise<DetectionResponse> {
    const response = await fetch(DETECTION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, conf_threshold: confThreshold }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Detection failed: ${response.status}`);
    }

    return response.json();
}

/** Capture a frame from an IP camera URL (server-side via Python backend). */
export async function detectFromIPCamera(
    cameraUrl: string,
    confThreshold: number = 0.35
): Promise<DetectionResponse> {
    const response = await fetch(DETECTION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_url: cameraUrl, conf_threshold: confThreshold }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `IP camera detection failed: ${response.status}`);
    }

    return response.json();
}

/** List available USB/webcam video input devices. */
export async function listCameraDevices(): Promise<CameraDevice[]> {
    try {
        // Must request permission first to get device labels
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(t => t.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices
            .filter(d => d.kind === 'videoinput')
            .map((d, i) => ({
                deviceId: d.deviceId,
                label: d.label || `كاميرا ${i + 1}`,
            }));
    } catch {
        return [];
    }
}

/** Check if the plate detection backend is available. */
export async function checkDetectionHealth(): Promise<boolean> {
    try {
        const response = await fetch(DETECTION_API_URL, { method: 'GET' });
        if (!response.ok) return false;
        const data = await response.json();
        return data.status === 'connected';
    } catch {
        return false;
    }
}

// --- Frame Capture ---

/** Capture a frame from a video element as base64 JPEG. */
export function captureFrame(
    videoElement: HTMLVideoElement,
    canvas: HTMLCanvasElement
): string | null {
    if (videoElement.readyState < 2) return null;

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

// --- Iraqi Plate Parsing ---

const PROVINCE_MAP: Record<string, string> = {
    '11': 'بغداد', '12': 'بغداد', '13': 'بغداد', '14': 'بغداد', '15': 'بغداد', '16': 'بغداد',
    '21': 'البصرة', '22': 'البصرة',
    '31': 'نينوى', '32': 'نينوى',
    '41': 'أربيل', '42': 'أربيل',
    '51': 'النجف', '52': 'النجف',
    '61': 'كربلاء', '62': 'كربلاء',
    '71': 'ديالى', '72': 'ديالى',
    '81': 'الأنبار', '82': 'الأنبار',
    '91': 'واسط', '92': 'واسط',
};

/**
 * Parse CRNN digit output into plate code and city.
 * The CRNN post-processing converts most letters to digits,
 * so we extract province code (first 2 digits) and map to city.
 */
export function parseIraqiPlate(rawText: string): { code: string; city: string } {
    const cleaned = rawText.replace(/[^0-9A-Za-z\u0600-\u06FF]/g, '');
    if (cleaned.length === 0) {
        return { code: rawText, city: 'بغداد' };
    }

    const digitsOnly = cleaned.replace(/\D/g, '');

    if (digitsOnly.length >= 5) {
        const provinceCode = digitsOnly.slice(0, 2);
        const plateNumber = digitsOnly.slice(2);
        const city = PROVINCE_MAP[provinceCode] || 'بغداد';
        return { code: `${provinceCode}-${plateNumber}`, city };
    }

    return { code: cleaned, city: 'بغداد' };
}

/** Determine if a detection should be auto-accepted based on confidence. */
export function shouldAutoAccept(confidence: number): boolean {
    return confidence >= PARKING_CONFIG.AI_AUTO_ACCEPT_CONFIDENCE;
}

/** Determine if a detection should be discarded (too low confidence). */
export function shouldDiscard(confidence: number): boolean {
    return confidence < PARKING_CONFIG.AI_MIN_CONFIDENCE;
}
