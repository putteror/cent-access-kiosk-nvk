export interface IdCardData {
  title?: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  fullNameEn?: string;
  idCardNumber: string;
  birthDate?: string;
  gender?: string;
  photo?: string; // base64
}

// 📌 API Endpoint สำหรับเครื่องอ่านบัตรประชาชนตัวเครื่อง
const ID_CARD_API_URL = process.env.NEXT_PUBLIC_IDCARD_API_URL || 'http://localhost:1300/api/read';

/**
 * ฟังก์ชันดึงข้อมูลจากการอ่านบัตรประชาชนผ่าน Local Service
 * จะ return null หากไม่มีการเสียบบัตรหรืออ่านไม่สำเร็จ เพื่อไม่ให้ Error spam
 */
export const fetchIdCardData = async (): Promise<IdCardData | null> => {
  console.log(`[ID Card] Requesting smartcard data from: ${ID_CARD_API_URL}`);

  try {
    const response = await fetch(ID_CARD_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // ไม่ต้อง log หรือ throw error หากเป็น 500/400 (เช่น ไม่มีบัตร) ให้คืนค่า null ไปเลย
      return null;
    }

    const json = await response.json();
    const data = json.data;

    if (!data) {
      return null;
    }

    // Mapping ข้อมูลจากรูปแบบใหม่ และจัดการกรณีที่ต้องตัดแบ่งชื่อเอง
    const fullNameTH = data.FullNameTH || "";
    let title = data.TitleTH;
    let firstName = data.FirstNameTH;
    let lastName = data.LastNameTH;

    // ถ้าไม่มีฟิลด์แยกมาให้ ให้พยายามตัดแบ่งจาก FullNameTH
    if (!title && !firstName && !lastName && fullNameTH) {
      const parts = fullNameTH.trim().split(/\s+/);
      if (parts.length >= 3) {
        title = parts[0];
        firstName = parts[1];
        lastName = parts.slice(2).join(" ");
      } else if (parts.length === 2) {
        // กรณีมี 2 ส่วน อาจจะเป็น [ชื่อ นามสกุล] หรือ [คำนำหน้า+ชื่อ นามสกุล]
        // แต่ตามตัวอย่าง "นาย นฤภัทร นิรัติศยางกูร" มี 3 ส่วน
        firstName = parts[0];
        lastName = parts[1];
      } else {
        firstName = fullNameTH;
      }
    }

    return {
      title: title || "",
      firstName: firstName || "",
      lastName: lastName || "",
      fullName: fullNameTH || "ไม่พบชื่อภาษาไทย",
      fullNameEn: data.FullNameEN,
      idCardNumber: data.CitizenID || "ไม่พบหมายเลขบัตร",
      birthDate: data.BirthDate,
      gender: data.Gender,
      photo: data.Photo,
    };
  } catch (error) {
    // ซ่อน console.error ไว้เพื่อไม่ให้รกตอน Auto Polling
    return null;
  }
};
