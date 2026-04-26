export interface IdCardData {
  fullName: string;
  idCardNumber: string;
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

    const data = await response.json();
    
    // คาดหวังรูปแบบข้อมูลที่คืนมาจากตัวอ่านบัตร (สามารถแก้ไข Mapping ให้ตรงกับ Service จริง)
    return {
      fullName: data.fullName || data.name || "ไม่พบชื่อภาษาไทย",
      idCardNumber: data.idCardNumber || data.cid || "ไม่พบหมายเลขบัตร",
    };
  } catch (error) {
    console.error("[ID Card Error] fetchIdCardData failed:", error);
    
    // 💡 การจำลอง (Mock) เมื่อเชื่อมต่อไม่ได้หรือกำลังพัฒนา
    console.warn("⚠️ Using mocked ID card data due to connection failure.");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      fullName: "นาย สมชาย เยี่ยมยอด",
      idCardNumber: "1234567890123"
    };
  }
};
