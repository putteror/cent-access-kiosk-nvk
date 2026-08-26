"use client";

import React, { useState } from "react";
import { Shield, XCircle, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { fetchIdCardData } from "../../services/id-card.service";
import { registerVisitor } from "../../services/registration.service";
import { CubeIcon } from "@heroicons/react/24/solid"

// Components
import RegistrationForm from "../components/RegistrationForm";
import CameraCapture from "../components/CameraCapture";
import FaceVerification from "../components/FaceVerification";
import SuccessScreen from "../components/SuccessScreen";

export default function KioskRegistration() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-zinc-50">กำลังโหลด...</div>}>
      <RegistrationContent />
    </Suspense>
  );
}

function RegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  
  const [isManualMode, setIsManualMode] = useState(mode === "manual");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isReadingCard, setIsReadingCard] = useState(false);
  const [readSuccess, setReadSuccess] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    fullName: "",
    idCardNumber: "",
    phone: "",
    purpose: "",
    cardPhoto: "",
  });

  // Polling for ID Card
  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === 1 && !formData.idCardNumber) {
      interval = setInterval(async () => {
        if (isReadingCard) return;

        try {
          setIsReadingCard(true);
          const data = await fetchIdCardData();
          if (data && data.idCardNumber) {
            setFormData((prev) => ({
              ...prev,
              title: data.title || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              fullName: data.fullName,
              idCardNumber: data.idCardNumber,
              cardPhoto: data.photo || "",
            }));
            setReadSuccess(true);
            // หยุดอ่านเมื่อได้ข้อมูลแล้ว หรืออาจจะปล่อยให้โชว์ "อ่านสำเร็จ"
          }
        } catch (error) {
          // Ignore error during polling (no card inserted)
        } finally {
          setIsReadingCard(false);
        }
      }, 3000); // Polling every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, formData.idCardNumber, isReadingCard]);

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
      if (data) {
        setFormData((prev) => ({
          ...prev,
          title: data.title || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          fullName: data.fullName,
          idCardNumber: data.idCardNumber,
          cardPhoto: data.photo || "",
        }));
        setReadSuccess(true);
      } else {
        // หาก return null ให้แจ้งเตือน หรืออาจจะไม่ทำอะไรก็ได้ เพราะจริงๆ แล้วเครื่องอาจจะแค่ยังไม่อ่าน
        // console.warn("No card data found.");
      }
    } catch (error) {
      console.error("Unexpected error during card read:", error);
    } finally {
      setIsReadingCard(false);
    }
  };

  // เมื่อถ่ายรูปเสร็จ ให้จำรูปไว้แล้วขยับไป Step 3 (เทียบใบหน้า)
  const handlePhotoCaptured = (photoBase64: string) => {
    setCapturedPhoto(photoBase64);
    setStep(3);
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Mapping back to what backend expects if needed
      const payload = {
        fullName: formData.fullName || `${formData.title}${formData.firstName} ${formData.lastName}`,
        idCardNumber: formData.idCardNumber,
        phone: formData.phone,
        purpose: formData.purpose,
        photoBase64: capturedPhoto,
        cardPhoto: formData.cardPhoto,
      };
      const response = await registerVisitor(payload);
      if (response.success) {
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        setIsSubmitting(false);
        setSubmitError(response.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error: any) {
      console.error("Error registering:", error);
      setIsSubmitting(false);
      setSubmitError(error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden relative p-4 md:p-8"
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
      <div className="relative w-full h-full flex flex-col bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white/80 overflow-hidden">
        {/* Top Brand Bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white/60 border-b border-zinc-100/80">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="text-xs font-semibold">กลับหน้าหลัก</span>
            </button>
            <div className="w-px h-8 bg-zinc-200" />
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-700/30">
                <CubeIcon className="text-white h-5 w-5 text-blue-600" />
              </div>
              <div className='hidden sm:flex flex-col'>
                <p className="font-bold text-zinc-800 text-sm leading-none tracking-tight">CENT ACCESS</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Visitor Management System</p>
              </div>

            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                step === 1
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : step > 1
                  ? "bg-zinc-100 text-zinc-400 line-through"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">1</span>
              ข้อมูลผู้ติดต่อ
            </div>
            <div className="w-6 h-px bg-zinc-300" />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                step === 2
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : step > 2
                  ? "bg-zinc-100 text-zinc-400 line-through"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">2</span>
              ถ่ายภาพใบหน้า
            </div>
            <div className="w-6 h-px bg-zinc-300" />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                step === 3
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">3</span>
              ตรวจสอบใบหน้า
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
            readSuccess={readSuccess}
            isManualMode={isManualMode}
            onSwitchToManual={() => setIsManualMode(true)}
          />
        )}
        {step === 2 && (
          <CameraCapture
            onBack={() => setStep(1)}
            onConfirm={handlePhotoCaptured}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 3 && (
          <FaceVerification
            cameraPhoto={capturedPhoto}
            cardPhoto={formData.cardPhoto}
            onRetake={() => setStep(2)}
            onConfirm={handleSubmitFinal}
            onCancel={() => router.push("/")}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
