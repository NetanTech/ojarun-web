"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  acceptTerms,
  fetchMe,
  getToken,
  useCustomerSession,
} from "@/lib/customerAuth";

/** Pages where the pop-up must not block the screen. */
const SKIP_PREFIXES = [
  "/login",
  "/register",
  "/verify-email",
  "/forget-password",
  "/sucess",
  "/terms-and-conditions",
  "/privacy-policy",
];

/**
 * Asks signed-in customers who haven't accepted the Terms & Conditions yet
 * (accounts created before the sign-up checkbox existed) to accept them.
 * It can't be dismissed: the only ways out are Accept or Log out.
 */
export default function TermsGate() {
  const { customer, ready, login, logout } = useCustomerSession();
  const pathname = usePathname();
  const router = useRouter();
  const [needsAcceptance, setNeedsAcceptance] = useState(false);
  const [checkedFor, setCheckedFor] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customerId = customer?.id ?? null;

  useEffect(() => {
    if (!ready || !customerId || checkedFor === customerId) return;
    const token = getToken();
    if (!token) return;
    let cancelled = false;
    fetchMe(token)
      .then((me) => {
        if (cancelled) return;
        setCheckedFor(customerId);
        // `null` means "not accepted". A missing field means an older API
        // that can't record acceptance yet, so don't block anyone.
        setNeedsAcceptance(me.termsAcceptedAt === null);
      })
      .catch(() => {
        // Network trouble: try again on the next sign-in or page load.
      });
    return () => {
      cancelled = true;
    };
  }, [ready, customerId, checkedFor]);

  if (!customer || !needsAcceptance) return null;
  if (SKIP_PREFIXES.some((p) => pathname?.startsWith(p))) return null;

  const handleAccept = async () => {
    const token = getToken();
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await acceptTerms(token);
      login(token, updated);
      setNeedsAcceptance(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setNeedsAcceptance(false);
    logout();
    router.push("/login");
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-gate-title"
    >
      <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-5 flex flex-col gap-4">
        <h2 id="terms-gate-title" className="text-lg font-semibold">
          Terms &amp; Conditions
        </h2>
        <p className="text-sm text-grey-400 leading-relaxed">
          To keep using Ojarun, please review and accept our Terms &amp;
          Conditions and Privacy Policy. They explain how orders, payments,
          deliveries and your data are handled.
        </p>
        <div className="flex flex-col gap-1 text-sm">
          <Link
            href="/terms-and-conditions"
            target="_blank"
            className="font-semibold text-primary underline w-fit"
          >
            Read the Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy-policy"
            target="_blank"
            className="font-semibold text-primary underline w-fit"
          >
            Read the Privacy Policy
          </Link>
        </div>
        <label className="flex items-start gap-3 text-sm text-neutral-700 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#004A19]"
          />
          <span>I have read and agree to the Terms &amp; Conditions and Privacy Policy.</span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleAccept}
          disabled={!agreed || saving}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Accept and continue"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={saving}
          className="w-full rounded-lg border border-[#E7E7E7] py-3 text-sm font-medium"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
