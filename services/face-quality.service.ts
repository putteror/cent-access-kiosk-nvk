export interface FaceQualityMetrics {
  faceWidth?: number;
  faceHeight?: number;
  probability?: number;
  yaw?: number;
  pitch?: number;
  roll?: number;
  mask?: string;
  [key: string]: any;
}

export interface FaceQualityResponse {
  isSuitable?: boolean;
  metrics?: FaceQualityMetrics;
  error?: string;
  [key: string]: any;
}

export interface FaceQualityResult {
  isQualityPassed: boolean;
  metrics?: FaceQualityMetrics;
  error?: string;
  raw?: any;
}

// 📌 URL ของ AI Gateway Service
const AI_GATEWAY_URL = process.env.NEXT_PUBLIC_AI_GATEWAY_URL || 'http://100.105.252.61:8080';

/**
 * ฟังก์ชันตัด prefix data:image/...;base64, ออกเพื่อให้เหลือ Base64 string ล้วน
 */
const cleanBase64 = (base64Str: string): string => {
  if (!base64Str) return '';
  return base64Str.replace(/^data:image\/[a-zA-Z]+;base64,/, '').trim();
};

/**
 * ฟังก์ชันตรวจสอบคุณภาพของภาพถ่ายใบหน้า (Face Quality Check)
 * @param imageBase64 รูปถ่าย Base64
 */
export const checkFaceQuality = async (imageBase64: string): Promise<FaceQualityResult> => {
  const endpoint = `${AI_GATEWAY_URL}/api/v1/face/check-quality`;

  const payload = {
    imageBase64: cleanBase64(imageBase64),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        isQualityPassed: false,
        error: `Face Quality Check failed (${response.status}): ${errorText}`,
      };
    }

    const data: FaceQualityResponse = await response.json();

    // เช็ค isSuitable จาก API ตรงๆ
    const isQualityPassed = data.isSuitable === true;

    return {
      isQualityPassed,
      metrics: data.metrics,
      error: !isQualityPassed ? (data.error || 'ภาพถ่ายไม่ผ่านเกณฑ์คุณภาพ (ความคมชัด/มุมหน้า/ขนาดใบหน้า)') : undefined,
      raw: data,
    };
  } catch (error: any) {
    console.error('[FaceQuality] Error checking quality:', error);
    return {
      isQualityPassed: false,
      error: error.message || 'ไม่สามารถเชื่อมต่อกับ AI Gateway ได้',
    };
  }
};
