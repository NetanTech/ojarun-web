"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SuccessCard() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[480px] px-6 pt-10 text-center">
      {/* Check icon */}
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

      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Successful</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-neutral-500">
        Your account has been created. Proceed to explore the market on Ojarun
      </p>

      <button
        type="button"
        onClick={() => router.push("/market")}
        className="mt-6 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
      >
        Proceed to market
      </button>
    </div>
  );
}