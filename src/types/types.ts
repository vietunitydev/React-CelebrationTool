export interface ProjectData {
    title?: string;
    texts: string[];
    imageUrls: string[];
    musicUrl?: string;
    theme: string;
}

export interface FallingItem {
    id: number;
    type: 'heart' | 'text' | 'image';
    content: string;
    x: number;
    y: number;
    speed: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
    lastFrameTime: number;
    targetY: number;
}