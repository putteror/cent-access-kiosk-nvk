"use client";

import React from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { Smartphone, MonitorPlay } from 'lucide-react';
import { CubeIcon } from '@heroicons/react/24/solid';

export default function LandingPage() {
  // สมมติ URL ของ Mobile สำหรับสแกน QR Code (ดึงค่าจาก ENV หรือใช้ค่าปริยาย)
  const mobileUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL + "/public/information/register-form/" + process.env.NEXT_PUBLIC_FORM_ID

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(140deg, #f0f4ff 0%, #f8faff 50%, #f0f3fb 100%)" }}
    >
      {/* Subtle decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container (No Frame) */}
      <div className="relative w-full max-w-2xl mx-4 flex flex-col items-center p-10 lg:p-14">

        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-700/30 mb-4">
            <CubeIcon className="text-white h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-800 tracking-tight">CENT ACCESS</h1>
          <p className="text-zinc-500 font-medium mt-1">ยินดีต้อนรับสู่ระบบผู้มาติดต่อ</p>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 w-full mb-8">
          <div className="flex items-center gap-3 text-blue-600 font-semibold mb-6 bg-blue-50 px-4 py-2 rounded-full">
            <Smartphone className="w-5 h-5" />
            <span>สแกนเพื่อลงทะเบียนผ่านมือถือ</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-zinc-100 shadow-inner">
            <QRCode value={mobileUrl} size={220} level="H" fgColor="#1e3a8a" />
          </div>

          <p className="text-center text-zinc-400 text-sm max-w-xs mt-6 leading-relaxed">
            ไม่อยากพิมพ์ข้อมูลที่ตู้ใช่หรือไม่?
            <br />
            สแกน QR Code เพื่อกรอกข้อมูลผ่านมือถือของคุณแทน
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center w-full gap-4 opacity-60 mb-8">
          <div className="h-px bg-zinc-300 flex-1" />
          <span className="text-zinc-400 font-medium text-sm">หรือ</span>
          <div className="h-px bg-zinc-300 flex-1" />
        </div>

        {/* Kiosk Button */}
        <Link
          href="/register"
          className="w-full relative group overflow-hidden bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-3 font-semibold py-5 rounded-2xl transition-all shadow-lg shadow-zinc-900/20 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-300 ease-out" />
          <MonitorPlay className="w-6 h-6" />
          <span>ลงทะเบียนด้วยตู้นี้ (Kiosk)</span>
        </Link>
      </div>
    </div>
  );
}
