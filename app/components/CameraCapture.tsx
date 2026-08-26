"use client";

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, ArrowLeft, RefreshCcw, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { checkFaceQuality } from "../../services/face-quality.service";

interface CameraCaptureProps {
  onBack: () => void;
  onConfirm: (photoBase64: string) => void;
  isSubmitting: boolean;
}

export default function CameraCapture({ onBack, onConfirm, isSubmitting }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isCheckingFace, setIsCheckingFace] = useState(false);
  const [faceCheckPassed, setFaceCheckPassed] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const capturePhoto = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      setPhotoSrc(imageSrc);
      setFaceCheckPassed(null);
      setErrorMessage(null);
      setIsCheckingFace(true);

      try {
        const result = await checkFaceQuality(imageSrc);
        if (result.isQualityPassed) {
          setFaceCheckPassed(true);
        } else {
          setFaceCheckPassed(false);
          setErrorMessage(result.error || "ภาพถ่ายไม่ผ่านเกณฑ์คุณภาพ (ความคมชัด/แสงสว่าง/ตำแหน่งหน้า) กรุณาถ่ายใหม่อีกครั้ง");
        }
      } catch (err: any) {
        console.error("Face quality error:", err);
        setFaceCheckPassed(false);
        setErrorMessage(err.message || "เกิดข้อผิดพลาดในการตรวจสอบคุณภาพภาพถ่าย");
      } finally {
        setIsCheckingFace(false);
      }
    }
  }, []);

  const retakePhoto = () => {
    setPhotoSrc(null);
    setFaceCheckPassed(null);
    setErrorMessage(null);
    setIsCheckingFace(false);
  };

  const handleProceed = () => {
    if (!photoSrc || !faceCheckPassed) return;
    onConfirm(photoSrc);
  };

  return (
    <div className="flex-1 flex flex-col px-8 lg:px-12 pt-7 pb-6 min-h-0 overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            disabled={isSubmitting || isCheckingFace}
            className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors disabled:opacity-50"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">ถ่ายภาพใบหน้า</h1>
            <p className="text-zinc-500 text-sm mt-0.5">จัดวางใบหน้าของคุณให้อยู่ในกรอบแล้วกดถ่าย</p>
          </div>
        </div>

        {!photoSrc && (
          <button
            onClick={() => setIsMirrored((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium text-xs transition-colors shadow-sm"
          >
            <RefreshCcw size={14} />
            {isMirrored ? "สลับกระจกเงา (เปิดอยู่)" : "สลับกระจกเงา (ปิดอยู่)"}
          </button>
        )}
      </div>

      <div className="flex-1 relative rounded-3xl overflow-hidden bg-zinc-900 shadow-inner min-h-0">
        {!photoSrc ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              mirrored={isMirrored}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="oval-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <ellipse cx="50%" cy="47%" rx="18%" ry="30%" fill="black" />
                  </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#oval-mask)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "6%" }}>
                <div
                  className="border-[3px] border-dashed border-white/70 rounded-full shadow-xl"
                  style={{ width: "36%", aspectRatio: "0.6", animation: "pulse 2.5s ease-in-out infinite" }}
                />
              </div>
              <div className="absolute top-4 left-4 right-4 bottom-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400/80 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400/80 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400/80 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400/80 rounded-br-xl" />
              </div>
              <p className="absolute bottom-6 inset-x-0 text-center text-white/70 text-sm font-medium">
                จัดวางใบหน้าให้อยู่ในกรอบรูปไข่
              </p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <img src={photoSrc} alt="Captured" className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl" />

            {/* Verification Status Banner Overlay */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center px-4">
              {isCheckingFace ? (
                <span className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-md text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-xl animate-pulse">
                  <Loader2 size={18} className="animate-spin" /> กำลังส่งตรวจสอบใบหน้า...
                </span>
              ) : faceCheckPassed === true ? (
                <span className="inline-flex items-center gap-2 bg-emerald-600/95 backdrop-blur-md text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-xl">
                  <CheckCircle2 size={18} /> ภาพถ่ายผ่านเกณฑ์ (ตรวจพบใบหน้า)
                </span>
              ) : faceCheckPassed === false ? (
                <span className="inline-flex items-center gap-2 bg-rose-600/95 backdrop-blur-md text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-xl text-center max-w-md">
                  <AlertCircle size={18} className="flex-shrink-0" /> {errorMessage}
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="flex-shrink-0 pt-5 flex items-center justify-center gap-4">
        {!photoSrc && (
          <button
            onClick={capturePhoto}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-10 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
          >
            <Camera size={20} />
            ถ่ายภาพ
          </button>
        )}

        {photoSrc && (
          <>
            <button
              onClick={retakePhoto}
              disabled={isSubmitting || isCheckingFace}
              className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 py-3.5 px-8 rounded-2xl font-semibold text-base transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCcw size={18} />
              ถ่ายใหม่
            </button>
            <button
              onClick={handleProceed}
              disabled={isSubmitting || isCheckingFace || faceCheckPassed !== true}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-10 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={20} /> ใช้รูปนี้และตรวจสอบใบหน้า
            </button>
          </>
        )}
      </div>
    </div>
  );
}
