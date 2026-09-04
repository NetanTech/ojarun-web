"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { registerCustomer, setPendingEmail } from "@/lib/customerAuth";

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { email: normalizedEmail } = await registerCustomer({
        name,
        phone,
        email,
        password,
        deliveryArea,
      });
      setPendingEmail(normalizedEmail);
      router.push("/verify-email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[500px] px-6 pt-10 mb-[-64px] relative z-100"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your details to begin shopping
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {/* Full name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-neutral-900"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Phone number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-neutral-900"
          >
            Phone number
          </label>
          <div className="mt-2 flex gap-3">
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-3">
              <span className="flex h-4 w-6 overflow-hidden rounded-sm">
                <span className="h-full w-1/3 bg-green-700" />
                <span className="h-full w-1/3 bg-white" />
                <span className="h-full w-1/3 bg-green-700" />
              </span>
              <span className="text-sm text-neutral-900">+234</span>
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-neutral-900"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Example@gmail.com"
            className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-neutral-900"
          >
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 pr-12 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Delivery area */}
        <div>
          <label
            htmlFor="deliveryArea"
            className="block text-sm font-semibold text-neutral-900"
          >
            Delivery area
          </label>
          <input
            id="deliveryArea"
            name="deliveryArea"
            type="text"
            required
            value={deliveryArea}
            onChange={(e) => setDeliveryArea(e.target.value)}
            placeholder="e.g. Bodija, Ibadan"
            className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      {/* Terms */}
      <p className="mt-6 text-center text-sm text-neutral-500">
        By clicking continue, you acknowledge that you have read and agreed to
        our{" "}
        <Link href="/terms" className="font-semibold text-neutral-900 underline">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-semibold text-neutral-900 underline">
          Privacy Policy
        </Link>
        .
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Continue"}
      </button>

      {/* Sign in link */}
      <p className="mt-4 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-neutral-900 underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
