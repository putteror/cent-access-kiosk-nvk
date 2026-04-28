"use client";

import React from "react";
import { User, CreditCard, Phone, UserCheck, FileText, Clock, ArrowRight, Scan } from "lucide-react";
import { IdCardData } from "../../services/id-card.service";

const FIELD_CLASS =
  "w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200/70 text-zinc-900 rounded-2xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400 text-[15px] shadow-sm hover:border-zinc-300";

const LABEL_CLASS = "text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block";
const ICON_CLASS = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400";

interface RegistrationFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
  onSimulateReadCard: () => void;
  isReadingCard: boolean;
}

export default function RegistrationForm({
  formData,
  handleChange,
  onNext,
  onSimulateReadCard,
  isReadingCard,
}: RegistrationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col px-8 lg:px-12 pt-7 pb-6 min-h-0 overflow-hidden">
      <div className="flex-shrink-0 mb-5">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">ลงทะเบียนผู้มาติดต่อ</h1>
        <p className="text-zinc-500 text-sm mt-1">กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการถ่ายภาพ</p>
      </div>

      {/* ID Card Auto-Fill Button */}
      <div className="flex-shrink-0 mb-6">
        <button
          type="button"
          onClick={onSimulateReadCard}
          disabled={isReadingCard}
          className="w-full relative overflow-hidden group flex items-center gap-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200/50 p-4 rounded-[1.25rem] hover:border-blue-300 hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-wait"
        >
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden relative">
            {formData.cardPhoto ? (
              <img 
                src={`data:image/jpeg;base64,${formData.cardPhoto}`} 
                alt="ID Card" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Scan size={24} className="text-white" />
            )}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-bold text-blue-900 text-[15px] truncate">
              {formData.cardPhoto ? "อ่านข้อมูลสำเร็จ" : "อ่านข้อมูลจากบัตรประชาชน (Auto-fill)"}
            </p>
            <p className="text-blue-700/80 text-xs mt-0.5 font-medium truncate">
              {formData.cardPhoto ? `พบข้อมูลคุณ ${formData.fullName}` : "ทดสอบคลิกเพื่อดึงข้อมูลชื่อ-สกุล และเลขบัตรรวดเร็วทันใจ"}
            </p>
          </div>
          {isReadingCard ? (
            <div className="flex gap-1.5 px-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : (
            <div className="bg-white border border-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {formData.cardPhoto ? "อ่านใหม่" : "ทดสอบอ่านบัตร"}
            </div>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 content-start">
          {/* Full Name */}
          <div>
            <label className={LABEL_CLASS}>ชื่อ-นามสกุล <span className="text-red-400 normal-case tracking-normal font-bold">*</span></label>
            <div className="relative">
              <div className={ICON_CLASS}><User size={18} /></div>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="เช่น นายสมชาย ใจดี" className={FIELD_CLASS} />
            </div>
          </div>

          {/* ID Card */}
          <div>
            <label className={LABEL_CLASS}>หมายเลขบัตรประชาชน <span className="text-red-400 normal-case tracking-normal font-bold">*</span></label>
            <div className="relative">
              <div className={ICON_CLASS}><CreditCard size={18} /></div>
              <input type="text" name="idCardNumber" value={formData.idCardNumber} onChange={handleChange} required placeholder="X-XXXX-XXXXX-XX-X" maxLength={13} className={FIELD_CLASS} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={LABEL_CLASS}>เบอร์โทรศัพท์ <span className="text-red-400 normal-case tracking-normal font-bold">*</span></label>
            <div className="relative">
              <div className={ICON_CLASS}><Phone size={18} /></div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="08X-XXX-XXXX" className={FIELD_CLASS} />
            </div>
          </div>

          {/* Host */}
          <div>
            <label className={LABEL_CLASS}>บุคคล / แผนกที่เข้าพบ <span className="text-red-400 normal-case tracking-normal font-bold">*</span></label>
            <div className="relative">
              <div className={ICON_CLASS}><UserCheck size={18} /></div>
              <input type="text" name="hostName" value={formData.hostName} onChange={handleChange} required placeholder="ชื่อพนักงาน หรือ ฝ่ายที่ติดต่อ" className={FIELD_CLASS} />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className={LABEL_CLASS}>จุดประสงค์ <span className="text-red-400 normal-case tracking-normal font-bold">*</span></label>
            <div className="relative">
              <div className={ICON_CLASS}><FileText size={18} /></div>
              <select name="purpose" value={formData.purpose} onChange={handleChange} required className={FIELD_CLASS + " appearance-none cursor-pointer"}>
                <option value="" disabled>-- เลือกจุดประสงค์ --</option>
                <option value="ประชุม">ประชุม / สัมมนา</option>
                <option value="ติดต่องาน">ติดต่องาน / ส่งเอกสาร</option>
                <option value="สัมภาษณ์งาน">สัมภาษณ์งาน</option>
                <option value="ซ่อมบำรุง">ซ่อมบำรุง (Vendor)</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className={LABEL_CLASS}>ระยะเวลาที่คาดว่าจะอยู่ <span className="text-red-400 normal-case tracking-normal font-bold">*</span></label>
            <div className="relative">
              <div className={ICON_CLASS}><Clock size={18} /></div>
              <select name="duration" value={formData.duration} onChange={handleChange} className={FIELD_CLASS + " appearance-none cursor-pointer"}>
                <option value="1">1 ชั่วโมง</option>
                <option value="2">2 ชั่วโมง</option>
                <option value="4">ครึ่งวัน (4 ชั่วโมง)</option>
                <option value="8">เต็มวัน</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-5 border-t border-zinc-100 mt-4">
          <p className="text-xs text-zinc-400"><span className="text-red-400">*</span> จำเป็นต้องกรอก</p>
          <button
            type="submit"
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-8 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 active:scale-[0.98]">
            ถ่ายรูปใบหน้า
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
