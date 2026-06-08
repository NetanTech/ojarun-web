"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="mx-auto w-full max-w-[500px] px-6 pt-10 relative z-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your details to login
        </p>
      </div>

      <div className="mt-8 space-y-5">
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
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-neutral-500"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-neutral-900"
            >
              Password
            </label>

            <Link
              href="/forget-password"
              className="font-semibold text-neutral-900 underline font-sm" 
            >
             Forgot password?
            </Link>
          </div>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
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
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
      >
        Log in
      </button>

      {/* Sign in link */}
      <p className="mt-4 text-center text-sm text-neutral-500">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-neutral-900 underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
