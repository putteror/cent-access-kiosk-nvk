export interface IdCardData {
  fullName: string;
  fullNameEn?: string;
  idCardNumber: string;
  birthDate?: string;
  gender?: string;
  photo?: string; // base64
}

// 📌 API Endpoint สำหรับเครื่องอ่านบัตรประชาชนตัวเครื่อง
const ID_CARD_API_URL = process.env.NEXT_PUBLIC_IDCARD_API_URL || 'http://localhost:8080/api/smartcard/read';

/**
 * ฟังก์ชันดึงข้อมูลจากการอ่านบัตรประชาชนผ่าน Local Service
 */
export const fetchIdCardData = async (): Promise<IdCardData> => {
  console.log(`[ID Card] Requesting smartcard data from: ${ID_CARD_API_URL}`);
  
  try {
    const response = await fetch(ID_CARD_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to read ID Card (status: ${response.status})`);
    }

    const json = await response.json();
    const data = json.data; // เข้าถึงฟิลด์ data ตามรูปแบบใหม่
    
    if (!data) {
      throw new Error("ไม่พบข้อมูลใน Response (data is null)");
    }

    // Mapping ข้อมูลจากรูปแบบใหม่
    return {
      fullName: data.FullNameTH || "ไม่พบชื่อภาษาไทย",
      fullNameEn: data.FullNameEN,
      idCardNumber: data.CitizenID || "ไม่พบหมายเลขบัตร",
      birthDate: data.BirthDate,
      gender: data.Gender,
      photo: data.Photo,
    };
  } catch (error) {
    console.error("[ID Card Error] fetchIdCardData failed:", error);
    
    // 💡 การจำลอง (Mock) เมื่อเชื่อมต่อไม่ได้หรือกำลังพัฒนา
    console.warn("⚠️ Using mocked ID card data due to connection failure.");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      fullName: "นาย สมชาย เยี่ยมยอด",
      fullNameEn: "Mr. Somchai Yeamyod",
      idCardNumber: "1234567890123",
      birthDate: "25330101",
      gender: "1",
      photo: ""
    };
  }
};
