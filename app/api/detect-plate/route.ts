import { NextRequest, NextResponse } from 'next/server';

const PLATE_API_URL = process.env.PLATE_API_URL || 'http://localhost:8000';
const DETECT_TIMEOUT_MS = 10_000;

interface PlateDetection {
    text: string;
    confidence: number;
    box: number[];
}

interface DetectAPIResponse {
    plates: PlateDetection[];
    inference_time_ms: number;
    model: string;
    device: string;
}

async function proxyToBackend(endpoint: string, body: Record<string, unknown>): Promise<NextResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DETECT_TIMEOUT_MS);

    let apiResponse: Response;
    try {
        apiResponse = await fetch(`${PLATE_API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
    } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Detection timed out', plates: [], inference_time_ms: 0 },
                { status: 504 }
            );
        }
        return NextResponse.json(
            { error: 'Plate detection service unavailable', plates: [], inference_time_ms: 0 },
            { status: 503 }
        );
    } finally {
        clearTimeout(timeoutId);
    }

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        return NextResponse.json(
            { error: `Detection API error: ${apiResponse.status}`, detail: errorBody, plates: [] },
            { status: apiResponse.status }
        );
    }

    const data: DetectAPIResponse = await apiResponse.json();
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { image, camera_url, conf_threshold = 0.35 } = body;

        // IP Camera mode: capture frame server-side
        if (camera_url && typeof camera_url === 'string') {
            return proxyToBackend('/api/detect-ip', {
                url: camera_url,
                conf_threshold: Number(conf_threshold),
            });
        }

        // USB/Webcam mode: base64 image from browser
        if (!image || typeof image !== 'string') {
            return NextResponse.json(
                { error: 'Missing "image" or "camera_url" field', plates: [], inference_time_ms: 0 },
                { status: 400 }
            );
        }

        if (image.length > 14_000_000) {
            return NextResponse.json(
                { error: 'Image too large. Maximum ~10MB.', plates: [], inference_time_ms: 0 },
                { status: 413 }
            );
        }

        return proxyToBackend('/api/detect', {
            image,
            conf_threshold: Number(conf_threshold),
        });
    } catch (error: unknown) {
        console.error('[detect-plate] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error', plates: [], inference_time_ms: 0 },
            { status: 500 }
        );
    }
}

// Health check: GET /api/detect-plate
export async function GET() {
    try {
        const res = await fetch(`${PLATE_API_URL}/health`, {
            signal: AbortSignal.timeout(3000),
        });
        const data = await res.json();
        return NextResponse.json({ status: 'connected', backend: data });
    } catch {
        return NextResponse.json(
            { status: 'disconnected', error: 'Cannot reach plate detection backend' },
            { status: 503 }
        );
    }
}
