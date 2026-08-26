export interface FaceBox {
  probability: number;
  xMax: number;
  yMax: number;
  xMin: number;
  yMin: number;
}

export interface FaceCompareResultItem {
  sourceImageFace?: FaceBox;
  targetImageFace?: FaceBox;
  similarity: number;
  isMatch: boolean;
}

export interface FaceCompareResponse {
  result?: FaceCompareResultItem[];
  error?: string;
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
 * เปรียบเทียบใบหน้าระหว่างภาพถ่ายหน้าสด (Camera) และภาพบนบัตรประชาชน (Smart Card)
 * @param sourceImageBase64 รูปถ่ายหน้าสดจากกล้อง (Base64)
 * @param targetImageBase64 รูปภาพจากบัตรประชาชน (Base64)
 * @returns ผลลัพธ์การเปรียบเทียบใบหน้า พร้อม similarity และ isMatch
 */
export const compareFaces = async (
  sourceImageBase64: string,
  targetImageBase64: string
): Promise<{ isMatch: boolean; similarity: number; error?: string; raw?: FaceCompareResponse }> => {
  const endpoint = `${AI_GATEWAY_URL}/api/v1/face/compare`;

  const payload = {
    sourceImageBase64: cleanBase64(sourceImageBase64),
    targetImageBase64: cleanBase64(targetImageBase64),
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
        isMatch: false,
        similarity: 0,
        error: `Face comparison failed with status ${response.status}: ${errorText}`,
      };
    }

    const data: FaceCompareResponse = await response.json();
    const firstResult = data.result && data.result.length > 0 ? data.result[0] : null;

    if (!firstResult) {
      return {
        isMatch: false,
        similarity: 0,
        error: 'No face detected or comparison result is empty',
        raw: data,
      };
    }

    return {
      isMatch: firstResult.isMatch,
      similarity: firstResult.similarity,
      raw: data,
    };
  } catch (error: any) {
    console.error('[FaceCompare] Error comparing faces:', error);
    return {
      isMatch: false,
      similarity: 0,
      error: error.message || 'Failed to connect to AI Gateway',
    };
  }
};
