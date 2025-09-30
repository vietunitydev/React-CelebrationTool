export interface ProjectData {
    id: string;
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

export interface VNPayParams {
    vnp_TxnRef?: string;
    vnp_Amount?: string;
    vnp_ResponseCode?: string;
    vnp_TransactionStatus?: string;
    vnp_BankCode?: string;
    vnp_PayDate?: string;
    [key: string]: string | undefined;
}

export interface KeyStatus {
    status: string;
    key: string;
    uses: number;
    message: string;
}