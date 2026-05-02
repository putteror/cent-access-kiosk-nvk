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
  readSuccess?: boolean;
  isManualMode?: boolean;
  onSwitchToManual?: () => void;
}

export default function RegistrationForm({
  formData,
  handleChange,
  onNext,
  onSimulateReadCard,
  isReadingCard,
  readSuccess = false,
  isManualMode = false,
  onSwitchToManual,
}: RegistrationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const hasCardData = !!formData.idCardNumber;
  const isFormValid = !!(formData.title && formData.firstName && formData.lastName && formData.idCardNumber);

  return (
    <div className="flex-1 flex flex-col px-8 lg:px-12 pt-7 pb-6 overflow-hidden">
      <div className="flex-shrink-0 mb-5 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">ลงทะเบียนผู้มาติดต่อ</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {readSuccess
              ? "กรุณาตรวจสอบข้อมูลและระบุจุดประสงค์ (ถ้ามี)"
              : isManualMode
                ? "กรุณากรอกข้อมูลส่วนตัวของท่านเพื่อลงทะเบียน"
                : "กรุณาเสียบบัตรประชาชนเพื่อเริ่มลงทะเบียน"}
          </p>
        </div>
        {readSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <UserCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">อ่านบัตรสำเร็จ</span>
          </div>
        )}
      </div>

      {(!hasCardData && !isManualMode) ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50/50 border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
            <Scan size={48} />
          </div>
          <h2 className="text-xl font-bold text-zinc-800 mb-2">กรุณาเสียบบัตรประชาชน</h2>
          <p className="text-zinc-500 text-sm max-w-[280px] mb-8">
            ระบบกำลังรอการอ่านข้อมูลจากบัตรประชาชนของท่าน กรุณาเสียบบัตรเข้ากับเครื่องอ่าน
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "200ms" }} />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "400ms" }} />
            </div>

            <button
              type="button"
              onClick={onSwitchToManual}
              className="px-8 py-3 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-2xl shadow-sm hover:bg-zinc-50 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <FileText size={18} className="text-zinc-400" />
              ลงทะเบียนด้วยตนเอง
            </button>

            <button
              type="button"
              onClick={onSimulateReadCard}
              className="mt-4 text-xs text-blue-600 font-medium hover:underline opacity-50"
            >
              (กดที่นี่เพื่อทดสอบกรณีไม่มีบัตรจริง)
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            {/* Photo Section: แสดงเฉพาะเมื่ออ่านบัตรสำเร็จเท่านั้น */}
            {readSuccess && (
              <div className="md:col-span-3 lg:col-span-2">
                <label className={LABEL_CLASS}>รูปถ่ายหน้าบัตร</label>
                <div className="aspect-[3/4] w-full max-w-[140px] mx-auto md:mx-0 rounded-2xl overflow-hidden border-2 border-zinc-100 bg-zinc-50 shadow-inner relative group">
                  {formData.cardPhoto ? (
                    <img
                      src={`data:image/jpeg;base64,${formData.cardPhoto}`}
                      alt="ID Photo"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <User size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}

            {/* Information Section */}
            <div className={`${readSuccess ? "md:col-span-9 lg:col-span-10" : "md:col-span-12 lg:col-span-12"} grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4`}>
              {/* Title */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className={LABEL_CLASS}>คำนำหน้า <span className="text-red-400 font-bold">*</span></label>
                <div className="relative">
                  <div className={ICON_CLASS}><User size={18} /></div>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="นาย / นาง / นางสาว" className={FIELD_CLASS} />
                </div>
              </div>

              <div className="hidden lg:block"></div>

              {/* First Name */}
              <div>
                <label className={LABEL_CLASS}>ชื่อ <span className="text-red-400 font-bold">*</span></label>
                <div className="relative">
                  <div className={ICON_CLASS}><User size={18} /></div>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="ระบุชื่อภาษาไทย" className={FIELD_CLASS} />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className={LABEL_CLASS}>นามสกุล <span className="text-red-400 font-bold">*</span></label>
                <div className="relative">
                  <div className={ICON_CLASS}><User size={18} /></div>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="ระบุนามสกุลภาษาไทย" className={FIELD_CLASS} />
                </div>
              </div>

              {/* ID Number */}
              <div className="md:col-span-2">
                <label className={LABEL_CLASS}>เลขบัตรประชาชน <span className="text-red-400 font-bold">*</span></label>
                <div className="relative">
                  <div className={ICON_CLASS}><CreditCard size={18} /></div>
                  <input type="text" name="idCardNumber" value={formData.idCardNumber} onChange={handleChange} required placeholder="X-XXXX-XXXXX-XX-X" maxLength={13} className={FIELD_CLASS} />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className={LABEL_CLASS}>จุดประสงค์ในการเข้าพบ <span className="text-zinc-400 font-normal tracking-normal">(เลือกได้)</span></label>
                <div className="relative">
                  <div className={ICON_CLASS}><FileText size={18} /></div>
                  <select name="purpose" value={formData.purpose} onChange={handleChange} className={FIELD_CLASS + " appearance-none cursor-pointer"}>
                    <option value="">-- เลือกจุดประสงค์ --</option>
                    <option value="ประชุม">ประชุม / สัมมนา</option>
                    <option value="ติดต่องาน">ติดต่องาน / ส่งเอกสาร</option>
                    <option value="สัมภาษณ์งาน">สัมภาษณ์งาน</option>
                    <option value="ซ่อมบำรุง">ซ่อมบำรุง (Vendor)</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={LABEL_CLASS}>เบอร์โทรศัพท์ <span className="text-zinc-400 font-normal tracking-normal">(ถ้ามี)</span></label>
                <div className="relative">
                  <div className={ICON_CLASS}><Phone size={18} /></div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="08X-XXX-XXXX" className={FIELD_CLASS} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-5 border-t border-zinc-100 mt-auto">
        <p className="text-xs text-zinc-400">
          {readSuccess
            ? <><span className="text-red-400">*</span> ข้อมูลที่ดึงมาจากบัตรประชาชนเพื่อความปลอดภัย</>
            : isManualMode
              ? "กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน"
              : "กรุณาเสียบบัตรประชาชนเพื่อดำเนินการต่อ"}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-8 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
          ขั้นตอนถัดไป
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
