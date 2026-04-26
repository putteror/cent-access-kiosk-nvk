"use client";

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, ArrowLeft, RefreshCcw, CheckCircle2, Loader2 } from "lucide-react";

interface CameraCaptureProps {
  onBack: () => void;
  onConfirm: (photoBase64: string) => void;
  isSubmitting: boolean;
}

export default function CameraCapture({ onBack, onConfirm, isSubmitting }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhotoSrc(imageSrc);
    }
  }, []);

  const retakePhoto = () => setPhotoSrc(null);

  return (
    <div className="flex-1 flex flex-col px-8 lg:px-12 pt-7 pb-6 min-h-0 overflow-hidden">
      <div className="flex-shrink-0 flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">ถ่ายภาพใบหน้า</h1>
          <p className="text-zinc-500 text-sm mt-0.5">จัดวางใบหน้าของคุณให้อยู่ในกรอบแล้วกดถ่าย</p>
        </div>
      </div>

      <div className="flex-1 relative rounded-3xl overflow-hidden bg-zinc-900 shadow-inner min-h-0">
        {!isCameraOpen && !photoSrc && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 gap-6">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-dashed border-zinc-600 rounded-full flex items-center justify-center">
                <Camera size={44} className="text-zinc-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-zinc-400 text-sm mb-4">กดปุ่มเพื่อเปิดกล้องและอนุญาตสิทธิ์การเข้าถึง</p>
              <button
                onClick={() => setIsCameraOpen(true)}
                className="bg-white text-zinc-900 py-3 px-10 rounded-2xl font-bold text-base hover:bg-zinc-100 transition-all shadow-xl"
              >
                เปิดกล้อง
              </button>
            </div>
          </div>
        )}

        {isCameraOpen && !photoSrc && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
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
        )}

        {photoSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <img src={photoSrc} alt="Captured" className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl" />
            <div className="absolute bottom-4 inset-x-0 text-center">
              <span className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold py-1.5 px-4 rounded-full shadow-lg">
                <CheckCircle2 size={16} /> ถ่ายภาพสำเร็จ
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="flex-shrink-0 pt-5 flex items-center justify-center gap-4">
        {isCameraOpen && !photoSrc && (
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
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 py-3.5 px-8 rounded-2xl font-semibold text-base transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCcw size={18} />
              ถ่ายใหม่
            </button>
            <button
              onClick={() => onConfirm(photoSrc)}
              disabled={isSubmitting}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-10 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> กำลังส่งข้อมูล...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} /> ยืนยันและส่งข้อมูล
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
