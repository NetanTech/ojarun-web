"use client";

import React, { useRef, useState, useEffect } from "react";

const OTP_LENGTH = 6;

export default function VerifyForm({ phone = "**********80" }: { phone?: string }) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(59);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1); // keep last digit only
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    // TODO: call your verify endpoint with `code`
    console.log("Verifying:", code);
  };

  const handleResend = () => {
    if (seconds > 0) return;
    setSeconds(59);
    // TODO: trigger resend
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[480px] px-6 pt-10"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Verification</h1>
        <p className="mt-2 text-sm text-neutral-500">
          A verification code has been sent to{" "}
          <span className="font-medium text-neutral-700">{phone}</span>
        </p>
      </div>

      {/* OTP inputs */}
      <div className="mt-8 flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            className="h-14 w-12 rounded-lg border border-neutral-200 text-center text-lg font-semibold text-neutral-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        type="submit"
        disabled={!isComplete}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Verify
      </button>

      {/* Resend */}
      <p className="mt-4 text-center text-sm text-neutral-500">
        Did not receive the OTP?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={seconds > 0}
          className="font-semibold text-primary underline disabled:no-underline disabled:opacity-60"
        >
          Resend
        </button>{" "}
        {seconds > 0 && <span>in {seconds}s</span>}
      </p>
    </form>
  );
}