import hmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';

export interface RegistrationPayload {
  fullName: string;
  idCardNumber: string;
  phone?: string;
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

// 📌 กำหนด API Endpoint สำหรับ Public Registrants (แบบเดียวกับ registrantService ของ ACM)
const PUBLIC_API_ENDPOINT = '/api/public/registrants/';
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "cent-access-secret-key-public-api"; // ควรใช้จาก env

/**
 * ฟังก์ชันสร้าง Header แบบเข้ารหัสเพื่อความปลอดภัยในการคุยกับ Public API
 * (ถอดแบบมาจาก requestAPI.ts ใน ACM Frontend)
 */
const generatePublicHeadersFormSiteId = (siteId: string) => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `siteId:${siteId};${timestamp};`;
  const signature = hmacSHA256(message, SECRET_KEY).toString(Hex);
  return {
    'Content-Type': 'application/json',
    'X-Site-ID': siteId,
    'X-Timestamp': timestamp,
    'X-Signature': signature
  };
};

/**
 * ฟังก์ชันสำหรับการลงทะเบียน Visitor โดยเรียกไปยัง API Backend
 */
export const registerVisitor = async (payload: RegistrationPayload): Promise<RegistrationResponse> => {
  // ดึงค่า URL หลัก และ Site ID จากตัวแปร Environment
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || '';
  const formId = process.env.NEXT_PUBLIC_FORM_ID || '';

  const apiPath = `${baseUrl}${PUBLIC_API_ENDPOINT}`;

  console.log(`[API] Submitting Registration to ${apiPath}...`);

  try {
    // แยกชื่อและนามสกุลออกจาก fullName เพื่อให้สอดคล้องกับมาตรฐานของ Registrant
    const nameParts = payload.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // จัดเตรียมข้อมูลให้อยู่ในโครงสร้าง RegistrantRequestsData และ RegistrantAnswerRequest[]
    // เพื่อให้เข้ากันได้กับ Backend Endpoint ที่รอรับ answers array
    const requestData = {
      registerFormId: formId,
      answers: [
        { inputType: "TEXT", key: "FIRST_NAME", label: "First Name", answer: firstName },
        { inputType: "TEXT", key: "LAST_NAME", label: "Last Name", answer: lastName },
        { inputType: "TEXT", key: "PERSON_CODE", label: "ID Card Number", answer: payload.idCardNumber },
        { inputType: "TEXT", key: "MOBILE_NUMBER", label: "Phone Number", answer: payload.phone || "-" },
        { inputType: "TEXT", key: "CONTACT_PERSON", label: "Contact Person", answer: payload.hostName || "-" },
        { inputType: "TEXT", key: "VISIT_PURPOSE", label: "Visit Purpose", answer: payload.purpose || "-" },
        { inputType: "TEXT", key: "DURATION", label: "Duration", answer: payload.duration || "1" },
        ...(payload.photoBase64 ? [{
          inputType: "IMAGE",
          key: "FACE_IMAGE",
          label: "Face Image",
          answer: payload.photoBase64,
        }] : []),
        ...(payload.cardPhoto ? [{
          inputType: "IMAGE",
          key: "CARD_IMAGE",
          label: "ID Card Photo",
          answer: payload.cardPhoto,
        }] : [])
      ],
      status: "PENDING" // หรือสถานะที่ Backend คาดหวัง
    };

    const headers = generatePublicHeadersFormSiteId(siteId);

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
      visitId: responseData?.data?.id || `V${Date.now().toString().slice(-6)}`,
      data: responseData?.data
    };
  } catch (error: any) {
    console.error("[API Error] registerVisitor Failed:", error);

    // Check if it's a timeout error
    const isTimeout = error.name === 'AbortError' || error.message.includes('abort');

    return {
      success: false,
      message: isTimeout ? "การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง" : (error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้"),
    };
  }
};
