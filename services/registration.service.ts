import hmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';

export interface RegistrationPayload {
  title?: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  idCardNumber: string;
  phone?: string;
  email?: string;
  company?: string;
  gender?: string;
  hostName?: string;
  purpose?: string;
  duration?: string;
  photoBase64: string | null;
  cardPhoto?: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  visitId?: string;
  data?: any;
}

// 📌 กำหนด API Endpoint สำหรับ Public Visits Upsert
const PUBLIC_VISITS_UPSERT_ENDPOINT = '/api/visitor/public/visits/upsert';
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "cent-access-secret-key-public-api";

/**
 * ฟังก์ชันสร้าง Header แบบเข้ารหัสเพื่อความปลอดภัยในการคุยกับ Public API ของ Tenant
 * ตามสเปก:
 * x-tenant-id: <TENANT_ID>
 * x-timestamp: <UNIX_TIMESTAMP>
 * x-signature: <HMAC_SHA256_HEX(tenantId:<TENANT_ID>;<TIMESTAMP>;)>
 */
const generatePublicHeadersForTenant = (tenantId: string) => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `tenantId:${tenantId};${timestamp};`;
  const signature = hmacSHA256(message, SECRET_KEY).toString(Hex);
  return {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
    'x-timestamp': timestamp,
    'x-signature': signature
  };
};

/**
 * ฟังก์ชันสำหรับการลงทะเบียน Visitor โดยเรียกไปยัง API Backend (Visits Upsert)
 */
export const registerVisitor = async (payload: RegistrationPayload): Promise<RegistrationResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  // รองรับทั้ง NEXT_PUBLIC_TENANT_ID และ NEXT_PUBLIC_SITE_ID (fallback)
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || process.env.NEXT_PUBLIC_SITE_ID || '';

  const apiPath = `${baseUrl}${PUBLIC_VISITS_UPSERT_ENDPOINT}`;

  console.log(`[API] Submitting Visits Upsert to ${apiPath}...`);

  try {
    // แยกชื่อและนามสกุลออกจาก fullName หรือ fallback
    const nameParts = payload.fullName.trim().split(/\s+/);
    const firstName = payload.firstName || nameParts[0] || '';
    const lastName = payload.lastName || nameParts.slice(1).join(' ') || '';

    const now = new Date();
    const startAt = now.toISOString();
    // ค่า default สิ้นสุดวันเดียวกัน หรือตามเวลาที่กำหนด (เช่น 1 วัน หรือ 9 ชม.)
    const endAt = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();

    // จัดเตรียม Payload ตาม docs /api/visitor/public/visits/upsert
    const requestData = {
      title: payload.purpose ? `ติดต่อเรื่อง: ${payload.purpose}` : "ลงทะเบียนผู้มาติดต่อ (Kiosk)",
      description: payload.purpose || "ติดต่อประสานงาน",
      startAt: startAt,
      endAt: endAt,
      status: "PENDING",
      visitType: "General",
      purposes: payload.purpose ? [payload.purpose] : ["ติดต่อประสานงาน"],
      contactPersons: payload.hostName ? [payload.hostName] : [],
      visitors: [
        {
          isPrimary: true,
          visitor: {
            title: payload.title || "",
            firstName: firstName,
            lastName: lastName,
            personCode: payload.idCardNumber,
            mobileNumber: payload.phone || "",
            email: payload.email || "",
            company: payload.company || "",
            gender: payload.gender || "",
            faceImagePath: payload.photoBase64 || payload.cardPhoto || ""
          }
        }
      ]
    };

    const headers = generatePublicHeadersForTenant(tenantId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(apiPath, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (สถานะ: ${response.status})`);
    }

    const responseData = await response.json();

    return {
      success: true,
      message: "ลงทะเบียนเรียบร้อยแล้ว",
      visitId: responseData?.data?.id || responseData?.id || `V${Date.now().toString().slice(-6)}`,
      data: responseData?.data || responseData
    };
  } catch (error: any) {
    console.error("[API Error] registerVisitor Failed:", error);

    const isTimeout = error.name === 'AbortError' || error.message.includes('abort');

    return {
      success: false,
      message: isTimeout ? "การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง" : (error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้"),
    };
  }
};
