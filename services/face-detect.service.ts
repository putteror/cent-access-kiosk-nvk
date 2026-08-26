export interface FaceBox {
  probability: number;
  xMax: number;
  yMax: number;
  xMin: number;
  yMin: number;
}

export interface FaceDetectionItem {
  box?: FaceBox;
  probability?: number;
  [key: string]: any;
}

export interface FaceDetectResult {
  hasFace: boolean;
  faceCount: number;
  probability?: number;
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
 * ฟังก์ชันตรวจสอบและตรวจจับใบหน้าจากภาพถ่าย (POST /api/v1/face/detect)
 * เพื่อเช็คว่ารูปภาพมีใบหน้าคนจริงและผ่านมาตรฐานก่อนนำไปใช้งาน
 * @param imageBase64 รูปถ่าย Base64
 */
export const detectFace = async (imageBase64: string): Promise<FaceDetectResult> => {
  const endpoint = `${AI_GATEWAY_URL}/api/v1/face/detect`;

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
        hasFace: false,
        faceCount: 0,
        error: `Face detection error (${response.status}): ${errorText}`,
      };
    }

    const data = await response.json();
    
    // โครงสร้างของ AI Gateway response: { result: [...] } หรือ array ตรงๆ
    const faces = data.result || data.faces || (Array.isArray(data) ? data : []);
    const faceCount = Array.isArray(faces) ? faces.length : 0;
    const firstFace = faceCount > 0 ? faces[0] : null;
    const probability = firstFace?.probability || (firstFace?.box ? firstFace.box.probability : 1.0);

    return {
      hasFace: faceCount > 0,
      faceCount,
      probability,
      raw: data,
    };
  } catch (error: any) {
    console.error('[FaceDetect] Error detecting face:', error);
    return {
      hasFace: false,
      faceCount: 0,
      error: error.message || 'ไม่สามารถเชื่อมต่อกับ AI Gateway ได้',
    };
  }
};
