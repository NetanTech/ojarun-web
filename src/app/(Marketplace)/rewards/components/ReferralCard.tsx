"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import type { RewardsSummary } from "@/lib/rewards";

const ReferralCard = ({ summary }: { summary: RewardsSummary }) => {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${origin}/register?ref=${summary.referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied — nothing to fall back to here
    }
  };

  return (
    <div className="border border-[#E7E7E7] rounded-[20px] p-6 flex flex-col gap-6 bg-white w-full">
      <div className="bg-green-500 rounded-2xl p-4 flex flex-col gap-6">
        <span className="bg-green-400 rounded-2xl px-2 py-1 body-small text-white w-fit">
          Earn 10+ points
        </span>
        <div className="flex flex-col gap-0.5">
          <h5 className="text-white">Refer & Earn</h5>
          <p className="text-grey-50 body-small">
            For each friend that you invite, you both earn points.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-black font-medium body-medium">How it works:</p>
        <p className="text-grey-400 body-medium">
          • Share your invite link
          <br />
          • Your friend gets 10 points when they sign up
          <br />• You receive 10 points for each referral
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-grey-400 body-small">Your invite link:</p>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 min-w-0 border border-[#E7E7E7] rounded-lg py-2.5 px-2.5">
            <p className="body-xsmall text-grey-300 truncate">{referralLink}</p>
          </div>
          <Button as="button" size="sm" variant="primary" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;
