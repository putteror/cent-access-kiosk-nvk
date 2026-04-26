"use client";

import React from "react";
import { CheckCircle2, Shield } from "lucide-react";

export default function SuccessScreen() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)" }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white/60 p-16 max-w-md w-full flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-400/30">
            <CheckCircle2 size={52} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <Shield size={16} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">ลงทะเบียนสำเร็จ</h2>
        <p className="text-zinc-500 text-base leading-relaxed">
          ระบบได้บันทึกข้อมูลและภาพถ่ายของคุณแล้ว
          <br />
          กรุณาติดต่อเจ้าหน้าที่เพื่อรับบัตรผ่านประตู
        </p>
        <div className="mt-8 h-1 w-32 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full animate-[shrink_5s_linear_forwards]"
            style={{ width: "100%", animation: "shrink 5s linear forwards" }}
          />
        </div>
      </div>
      <style>{`@keyframes shrink { from { width: 100% } to { width: 0% } }`}</style>
    </div>
  );
}
