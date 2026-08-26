"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Send,
  Loader2,
  ArrowLeft,
  Percent,
  AlertCircle
} from "lucide-react";
import { compareFaces } from "../../services/face-compare.service";

interface FaceVerificationProps {
  cameraPhoto: string;
  cardPhoto?: string;
  onRetake: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function FaceVerification({
  cameraPhoto,
  cardPhoto,
  onRetake,
  onConfirm,
  onCancel,
  isSubmitting,
}: FaceVerificationProps) {
  const [isComparing, setIsComparing] = useState(true);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [similarity, setSimilarity] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const runComparison = async () => {
      // หากไม่มีรูปจากบัตรประชาชน (เช่น กรอกฟอร์มแบบ manual) ให้ข้ามการเทียบ AI หรือถือว่าผ่าน
      if (!cardPhoto) {
        setIsComparing(false);
        setIsMatch(true);
        setSimilarity(1.0);
        return;
      }

      setIsComparing(true);
      setErrorMessage(null);

      const result = await compareFaces(cameraPhoto, cardPhoto);

      if (!isMounted) return;

      setIsComparing(false);
      if (result.error) {
        setErrorMessage(result.error);
        setIsMatch(false);
      } else {
        setIsMatch(result.isMatch);
        setSimilarity(result.similarity);
      }
    };

    runComparison();

    return () => {
      isMounted = false;
    };
  }, [cameraPhoto, cardPhoto]);

  const similarityPercent = Math.round(similarity * 100);

  return (
    <div className="flex-1 flex flex-col px-8 lg:px-12 pt-7 pb-6 min-h-0 overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            ตรวจสอบความถูกต้องของใบหน้า
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            ระบบกำลังเปรียบเทียบภาพถ่ายของคุณกับภาพบนบัตรประชาชน
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-0">
        {/* Images Compare Cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Card 1: ID Card Photo */}
          <div className="flex flex-col items-center bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm">
            <div className="w-full aspect-[3/4] max-h-64 rounded-2xl overflow-hidden bg-zinc-100 flex items-center justify-center mb-3 shadow-inner">
              {cardPhoto ? (
                <img
                  src={cardPhoto.startsWith("data:") ? cardPhoto : `data:image/jpeg;base64,${cardPhoto}`}
                  alt="บัตรประชาชน"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-zinc-400 text-sm text-center px-4">
                  ไม่มีรูปบัตรประชาชน (โหมดกรอกเอง)
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
              รูปภาพจากบัตรประชาชน
            </span>
          </div>

          {/* Card 2: Live Camera Photo */}
          <div className="flex flex-col items-center bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm">
            <div className="w-full aspect-[3/4] max-h-64 rounded-2xl overflow-hidden bg-zinc-100 flex items-center justify-center mb-3 shadow-inner">
              <img
                src={cameraPhoto}
                alt="ภาพถ่ายจากกล้อง"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
              ภาพถ่ายปัจจุบัน (หน้าสด)
            </span>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="w-full max-w-2xl bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {isComparing ? (
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
            ) : isMatch ? (
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
                <XCircle className="w-7 h-7" />
              </div>
            )}

            <div>
              {isComparing ? (
                <>
                  <h3 className="text-lg font-bold text-zinc-800">กำลังประมวลผลเปรียบเทียบใบหน้า...</h3>
                  <p className="text-sm text-zinc-400">กรุณารอสักครู่ AI กำลังวิเคราะห์ความถูกต้อง</p>
                </>
              ) : isMatch ? (
                <>
                  <h3 className="text-lg font-bold text-emerald-700">ตรวจสอบผ่าน: ใบหน้าตรงกัน</h3>
                  <p className="text-sm text-zinc-500">
                    ความแม่นยำในการจับคู่: <strong className="text-emerald-600">{similarityPercent}%</strong>
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-rose-600">ตรวจสอบไม่ผ่าน: ใบหน้าไม่ตรงกัน</h3>
                  <p className="text-sm text-zinc-500">
                    {errorMessage ? errorMessage : `ความเหมือนเพียง ${similarityPercent}% (ไม่ถึงเกณฑ์ที่กำหนด)`}
                  </p>
                </>
              )}
            </div>
          </div>

          {!isComparing && (
            <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
              <Percent className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-700">
                Similarity: {similarityPercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex-shrink-0 pt-6 flex items-center justify-center gap-4">
        {/* เมื่อกำลังประมวลผล */}
        {isComparing && (
          <button
            disabled
            className="flex items-center gap-2 bg-zinc-100 text-zinc-400 py-3.5 px-8 rounded-2xl font-semibold text-base cursor-not-allowed"
          >
            <Loader2 size={18} className="animate-spin" /> กำลังตรวจสอบ...
          </button>
        )}

        {/* เมื่อผลลัพธ์คือ Match (ผ่าน) */}
        {!isComparing && isMatch && (
          <>
            <button
              onClick={onRetake}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 py-3.5 px-6 rounded-2xl font-semibold text-base transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCcw size={18} />
              ถ่ายภาพใหม่
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3.5 px-10 rounded-2xl font-bold text-base shadow-xl shadow-emerald-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> กำลังส่งข้อมูลไปยังระบบ...
                </>
              ) : (
                <>
                  <Send size={20} /> ยืนยันและส่งข้อมูล
                </>
              )}
            </button>
          </>
        )}

        {/* เมื่อผลลัพธ์คือ ไม่ Match (ไม่ผ่าน) */}
        {!isComparing && !isMatch && (
          <>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 py-3.5 px-8 rounded-2xl font-semibold text-base transition-all shadow-sm"
            >
              ยกเลิก
            </button>
            <button
              onClick={onRetake}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-10 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
            >
              <RefreshCcw size={20} />
              ถ่ายใหม่อีกครั้ง
            </button>
          </>
        )}
      </div>
    </div>
  );
}
