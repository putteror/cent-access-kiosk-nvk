# Kiosk Visitor Web

**Kiosk Visitor Web** เป็นระบบ UI สำหรับตู้ลงทะเบียนผู้มาติดต่อ (Kiosk) ที่ออกแบบมาเพื่อความทันสมัย ใช้งานง่าย และรองรับการทำขั้นตอนลงทะเบียนให้รวดเร็วที่สุด ด้วยเทคโนโลยี Next.js และการเชื่อมต่อกับอุปกรณ์ภายนอกอย่างเครื่องอ่านบัตรประชาชน

## 🚀 คุณสมบัติหลัก (Key Features)

- **QR Code Landing Page**: หน้าแรกสำหรับให้ผู้มาติดต่อเลือกแสกนเพื่อลงทะเบียนผ่านมือถือตนเอง หรือเลือกใช้งานผ่านตู้ Kiosk
- **ID Card Integration**: รองรับการอ่านข้อมูลจากบัตรประชาชนผ่านเครื่องอ่านบัตร (Smart Card Reader)
- **Face Capture**: ระบบถ่ายภาพใบหน้าผู้มาติดต่อด้วย Webcam พร้อมไกด์ไลน์สำหรับการวางใบหน้า
- **Multi-step Registration**: ขั้นตอนการลงทะเบียนที่แบ่งเป็นสัดส่วน (ข้อมูลผู้ติดต่อ -> ถ่ายภาพ -> ยืนยัน)
- **API Connectivity**: เชื่อมต่อข้อมูลกับระบบ CentAccess Main Service พร้อมระะบบจัดการ Error และ Timeout
- **Premium Design**: ใช้ CSS ระดับสูงเพื่อให้ UI ดูหรูหรา และสอดคล้องกับภาพลักษณ์องค์กร

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS + [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Heroicons](https://heroicons.com/)
- **Utility**: [Crypto-JS](https://www.npmjs.com/package/crypto-js) (สำหรับการทำ API Signature)

## 📦 การติดตั้งและการรันโปรเจค (Getting Started)

1. **ติดตั้ง Dependencies**:
   ```bash
   npm install
   ```

2. **ตั้งค่า Environment Variables**:
   สร้างไฟล์ `.env.local` ไว้ที่ Root ของโปรเจค และกำหนดค่าดังนี้:
   ```env
   # API สำหรับการเชื่อมต่อเครื่องอ่านบัตรประชาชน (Local Service)
   NEXT_PUBLIC_IDCARD_API_URL=http://localhost:8080/api/smartcard/read

   # API สำหรับระบบหลัก CentAccess
   NEXT_PUBLIC_API_BASE_URL=https://api.centaccess.demo
   NEXT_PUBLIC_FRONTEND_BASE_URL=https://portal.centaccess.demo
   NEXT_PUBLIC_SITE_ID=your-site-id
   NEXT_PUBLIC_FORM_ID=your-form-id
   NEXT_PUBLIC_SECRET_KEY=your-secret-key
   ```

3. **รันโปรเจคในโหมด Development**:
   ```bash
   npm run dev
   ```
   ระบบจะรันอยู่ที่ [http://localhost:3001](http://localhost:3001)

## 📡 API Integration

ระบบนี้มีการส่งข้อมูลไปยัง Backend ในรูปแบบ `RegistrantRequestsData` โดยส่งข้อมูลผ่านฟิลด์ `answers` ตามมาตรฐานของระบบ CentAccess:

- **Endpoint**: `/api/public/registrants/`
- **Method**: `POST`
- **Security**: ใช้การสร้าง Header `X-Signature` ด้วย HmacSHA256 เพื่อความปลอดภัยของ Public API

## 📂 โครงสร้างโฟลเดอร์

- `app/`: โครงสร้างหน้าเว็บ (Landing Page) และหน้าลงทะเบียน (`/register`)
- `app/components/`: คอมโพเนนต์ UI ต่างๆ เช่น ฟอร์ม, กล้อง, หน้าความสำเร็จ
- `services/`: ส่วนจัดการ Logic การเรียก API ทั้งเครื่องอ่านบัตรและการลงทะเบียน
- `public/`: เก็บไฟล์ Static ต่างๆ

---
© 2026 CentAccess Team. All rights reserved.
