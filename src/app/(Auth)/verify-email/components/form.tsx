"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  verifyOtp,
  resendOtp,
  saveSession,
  getPendingEmail,
  clearPendingEmail,
} from "@/lib/customerAuth";

const OTP_LENGTH = 6;

export default function VerifyForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(59);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const pending = getPendingEmail();
    if (!pending) {
      router.replace("/login");
      return;
    }
    setEmail(pending);
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setLoading(true);
    try {
      const { accessToken, customer } = await verifyOtp(email, otp.join(""));
      saveSession(accessToken, customer);
      clearPendingEmail();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || !email) return;
    setError(null);
    try {
      await resendOtp(email);
      setSeconds(59);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
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
          <span className="font-medium text-neutral-700">{email ?? "..."}</span>
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

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      {/* Verify button */}
      <button
        type="submit"
        disabled={!isComplete || loading}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
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
