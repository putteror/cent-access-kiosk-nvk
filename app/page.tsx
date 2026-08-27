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

            {/* Registration Card Section */}
            <div className="flex flex-col shrink-0 lg:w-1/2 min-h-0">
              <Link
                href="/register?mode=id-card"
                className="group relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-[2rem] transition-all hover:scale-[1.01] hover:shadow-2xl shadow-xl shadow-blue-500/20 h-full w-full text-center border border-white/20 overflow-hidden"
              >
                {/* Background decorative shine */}
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div className="absolute -left-12 -top-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-white/20 p-5 md:p-6 rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-inner border border-white/20">
                    <CreditCard className="w-10 h-10 md:w-14 md:h-14 text-white" />
                  </div>

                  <span className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-sm">
                    ลงทะเบียนผู้มาติดต่อ
                  </span>
                  
                  <p className="text-blue-100 text-sm md:text-base mt-2.5 max-w-[280px] font-medium leading-relaxed">
                    เสียบบัตรประชาชน หรือกรอกข้อมูล เพื่อลงทะเบียนเข้าอาคาร
                  </p>

                  <div className="mt-8 px-7 py-3 bg-white text-blue-700 font-bold rounded-2xl text-sm md:text-base shadow-lg group-hover:bg-blue-50 group-hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                    <span>เริ่มต้นลงทะเบียน</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}