"use client";

import React from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { Smartphone, CreditCard, UserPlus } from 'lucide-react';
import { CubeIcon } from '@heroicons/react/24/solid';

export default function LandingPage() {
  const mobileUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL + "/public/information/register-form/" + process.env.NEXT_PUBLIC_FORM_ID;

  return (
    // เปลี่ยนจาก justify-center เป็นการใช้ padding แทนเพื่อให้ตอนซูมไม่โดนตัดหัวท้าย
    <div className="h-screen w-full flex flex-col items-center p-4 relative bg-[#f8fafc] overflow-x-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-blue-300/30 to-indigo-200/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-sky-300/20 to-transparent blur-[100px]" />
      </div>

      {/* Main Container: นำ flex-1 ออกเพื่อให้สูงตามคอนเทนต์จริงเมื่อซูม */}
      <div className="relative w-full h-full z-10">
        <div className="flex flex-col justify-between h-full bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.04)] rounded-[2rem] md:rounded-[3rem] p-6 py-14 sm:p-8 md:p-10 lg:p-12">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6 shrink-0">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-b from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <CubeIcon className="text-white h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              CENT ACCESS
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-2">
              ระบบลงทะเบียนผู้มาติดต่อ (Visitor Management System)
            </p>
          </div>

          {/* Content Section: ปรับให้เป็น flex เพื่อจัดการการย่อขยายเมื่อหน้าจอโดนบีบ */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-4 lg:gap-8 w-full items-stretch justify-center">
            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center bg-white drop-shadow-md p-8 rounded-[2rem] border border-slate-100/60 flex-1 min-h-0 lg:w-1/2">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-4 bg-indigo-50/80 px-4 py-2 rounded-xl text-md md:text-sm shrink-0">
                <Smartphone className="w-4 h-4" />
                <span>สแกนเพื่อลงทะเบียนผ่านมือถือ</span>
              </div>

              <div className="p-3 md:p-4 bg-white rounded-2xl flex items-center justify-center min-h-0 flex-1 w-full">
                <QRCode
                  value={mobileUrl}
                  style={{ height: "100%", width: "100%", maxHeight: "100%", maxWidth: "100%" }}
                  level="H"
                  fgColor="#0f172a"
                />
              </div>
              <p className="text-center text-slate-500 text-xs mt-4 font-medium shrink-0">
                สแกน QR Code ด้วยกล้องมือถือ
              </p>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col gap-4 shrink-0 lg:w-1/2 justify-center">
              <Link
                href="/register?mode=id-card"
                className="group relative flex items-center p-5 md:p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl md:rounded-3xl transition-transform hover:-translate-y-1 shadow-lg shadow-blue-200"
              >
                <div className="bg-white/20 p-3 md:p-4 rounded-xl mr-4">
                  <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-bold">ลงทะเบียนผู้มาติดต่อ</span>
                  <span className="text-blue-100 text-xs md:text-sm">ด้วยบัตรประชาชน/กรอกข้อมูล</span>
                </div>
              </Link>

              <Link
                href="/register?mode=manual"
                className="group relative flex items-center p-5 md:p-6 bg-white text-slate-800 rounded-2xl md:rounded-3xl border border-slate-200 transition-transform hover:-translate-y-1 shadow-sm"
              >
                <div className="bg-slate-100 p-3 md:p-4 rounded-xl mr-4 group-hover:bg-slate-200">
                  <UserPlus className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-bold">ตรวจสอบสถานะ</span>
                  <span className="text-slate-500 text-xs md:text-sm">เช็คข้อมูลการลงทะเบียน</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}