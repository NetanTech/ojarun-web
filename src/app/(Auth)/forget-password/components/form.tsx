"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { forgotPassword, verifyResetOtp, resetPassword } from "@/lib/customerAuth";

type Step = "email" | "verify" | "newPassword" | "success";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  return (
    <div className="mx-auto w-full max-w-[480px] px-6 pt-10">
      {step === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onNext={() => setStep("verify")}
        />
      )}
      {step === "verify" && (
        <VerifyStep
          email={email}
          onNext={(token) => {
            setResetToken(token);
            setStep("newPassword");
          }}
        />
      )}
      {step === "newPassword" && (
        <NewPasswordStep resetToken={resetToken} onNext={() => setStep("success")} />
      )}
      {step === "success" && <SuccessStep />}
    </div>
  );
}

/* ---------- Step 1: Email ---------- */
function EmailStep({
  email,
  setEmail,
  onNext,
}: {
  email: string;
  setEmail: (v: string) => void;
  onNext: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Reset password</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Let&apos;s verify it&apos;s you. Kindly enter your email
        </p>
      </div>

      <div className="mt-8">
        <label htmlFor="email" className="block text-sm font-semibold text-neutral-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Example@gmail.com"
          required
          className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending code..." : "Continue"}
      </button>
    </form>
  );
}

/* ---------- Step 2: Verify OTP ---------- */
const OTP_LENGTH = 6;

function VerifyStep({
  email,
  onNext,
}: {
  email: string;
  onNext: (resetToken: string) => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(59);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
    setError(null);
    setLoading(true);
    try {
      const { resetToken } = await verifyResetOtp(email, otp.join(""));
      onNext(resetToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0) return;
    setError(null);
    try {
      await forgotPassword(email);
      setSeconds(59);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Email verification</h1>
        <p className="mt-2 text-sm text-neutral-500">
          A verification code has been sent to{" "}
          <span className="font-semibold text-neutral-700">{email || "your email"}</span>.
          <br />
          Kindly input the code to reset your password.
        </p>
      </div>

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

      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!isComplete || loading}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

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

/* ---------- Step 3: New password ---------- */
function NewPasswordStep({
  resetToken,
  onNext,
}: {
  resetToken: string;
  onNext: () => void;
}) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mismatch || !password) return;
    setError(null);
    setLoading(true);
    try {
      await resetPassword(resetToken, password);
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">New password</h1>
        <p className="mt-2 text-sm text-neutral-500">Kindly enter your new password</p>
      </div>

      <div className="mt-8 space-y-5">
        <PasswordField
          id="new"
          label="New password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          show={showNew}
          toggle={() => setShowNew((v) => !v)}
        />
        <div>
          <PasswordField
            id="confirm"
            label="Confirm password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={setConfirm}
            show={showConfirm}
            toggle={() => setShowConfirm((v) => !v)}
          />
          {mismatch && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={mismatch || !password || loading}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Updating..." : "Continue"}
      </button>
    </form>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  show,
  toggle,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggle: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-900">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-neutral-200 px-4 py-3 pr-12 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  );
}

/* ---------- Step 4: Success ---------- */
function SuccessStep() {
  const router = useRouter();
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Password changed</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-neutral-500">
        Your password was changed successfully. You can now log in with your new password.
      </p>
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
      >
        Back to login
      </button>
    </div>
  );
}
