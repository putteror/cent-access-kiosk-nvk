"use client";

import React, { useState } from "react";
import { Shield, XCircle } from "lucide-react";
import { fetchIdCardData } from "../../services/id-card.service";
import { registerVisitor } from "../../services/registration.service";
import { CubeIcon } from "@heroicons/react/24/solid"

// Components
import RegistrationForm from "../components/RegistrationForm";
import CameraCapture from "../components/CameraCapture";
import SuccessScreen from "../components/SuccessScreen";

export default function KioskRegistration() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isReadingCard, setIsReadingCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    idCardNumber: "",
    phone: "",
    hostName: "",
    purpose: "",
    duration: "1",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulateReadCard = async () => {
    setIsReadingCard(true);
    try {
      const data = await fetchIdCardData();
      setFormData((prev) => ({
        ...prev,
        fullName: data.fullName,
        idCardNumber: data.idCardNumber,
      }));
    } catch (error) {
      console.error("Failed to read ID card", error);
    } finally {
      setIsReadingCard(false);
    }
  };

  const handleSubmitFinal = async (photoBase64: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await registerVisitor({ ...formData, photoBase64 });
      if (response.success) {
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setStep(1);
          setFormData({ fullName: "", idCardNumber: "", phone: "", hostName: "", purpose: "", duration: "1" });
        }, 5000);
      } else {
        setIsSubmitting(false);
        setSubmitError(response.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error: any) {
      console.error("Error registering:", error);
      setIsSubmitting(false);
      setSubmitError(error.message || "เไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(140deg, #f0f4ff 0%, #f8faff 50%, #f0f3fb 100%)" }}
    >
      {/* Error Popup */}
      {submitError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner shadow-red-200/50">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-800 mb-2">ลงทะเบียนไม่สำเร็จ</h3>
            <p className="text-zinc-500 text-sm mb-8 px-2 leading-relaxed">{submitError}</p>
            <button
              onClick={() => setSubmitError(null)}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-2xl transition-all shadow-lg shadow-zinc-900/20 active:scale-[0.98]"
            >
              ปิดหน้าต่าง และลองอีกครั้ง
            </button>
          </div>
        </div>
      )}

      {/* Subtle decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-4xl mx-4 lg:mx-8 h-full max-h-[900px] flex flex-col bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white/80 overflow-hidden">
        {/* Top Brand Bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white/60 border-b border-zinc-100/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-700/30">
              <CubeIcon className="text-white h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-zinc-800 text-sm leading-none tracking-tight">CENT ACCESS</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Visitor Management System</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-zinc-100 text-zinc-400 line-through"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">1</span>
              ข้อมูลผู้ติดต่อ
            </div>
            <div className="w-6 h-px bg-zinc-300" />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 2 ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-zinc-100 text-zinc-400"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">2</span>
              ถ่ายภาพใบหน้า
            </div>
          </div>
        </div>

        {/* Steps */}
        {step === 1 && (
          <RegistrationForm
            formData={formData}
            handleChange={handleChange}
            onNext={() => setStep(2)}
            onSimulateReadCard={handleSimulateReadCard}
            isReadingCard={isReadingCard}
          />
        )}
        {step === 2 && (
          <CameraCapture
            onBack={() => setStep(1)}
            onConfirm={handleSubmitFinal}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
