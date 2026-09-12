"use client";

import React from "react";
import { PartyPopper } from "lucide-react";
import type { RewardsSummary } from "@/lib/rewards";

const TIERS: Array<{ name: string; range: string }> = [
  { name: "Bronze", range: "0 - 999 pts" },
  { name: "Silver", range: "1,000 - 4,999 pts" },
  { name: "Gold", range: "5,000+ pts" },
];

const TIER_COPY: Record<RewardsSummary["tier"], string> = {
  Bronze: "Keep ordering to unlock Silver benefits.",
  Silver: "Keep ordering to unlock Gold benefits.",
  Gold: "You've reached the highest tier. Enjoy all your exclusive Gold benefits.",
};

const TierCard = ({ summary }: { summary: RewardsSummary }) => {
  const segmentIndex = summary.tierIndex - 1;
  const nextTierMin = summary.tierIndex === 3 ? null : summary.tierIndex === 1 ? 1000 : 5000;
  const progressWithinTier =
    summary.tierIndex === 3
      ? 1
      : Math.min(1, Math.max(0, (summary.points - summary.tierMin) / ((nextTierMin ?? 1) - summary.tierMin)));
  const percent = ((segmentIndex + progressWithinTier) / 3) * 100;

  const pointsToNext =
    nextTierMin !== null ? Math.max(0, nextTierMin - summary.points) : 0;

  return (
    <div className="border border-[#E7E7E7] rounded-[20px] p-6 flex flex-col gap-6 bg-white w-full">
      <div className="flex items-center justify-between w-full">
        <h6>Loyalty Tier</h6>
      </div>

      <div className="flex flex-col gap-1">
        <h5>Tier {summary.tierIndex}</h5>
        <p className="text-grey-400 body-medium">{TIER_COPY[summary.tier]}</p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <div className="relative w-full h-2 rounded-full bg-green-100 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center w-full">
          {TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className={`flex-1 flex flex-col items-center gap-1 ${i === summary.tierIndex - 1 ? "text-black" : "text-grey-300"}`}
            >
              <p className="body-medium font-medium text-center">{tier.name}</p>
              <p className="body-small text-grey-300 text-center">{tier.range}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 bg-green-50/50 rounded-2xl py-4 px-2.5 w-full">
        <PartyPopper size={20} className="text-green-600 shrink-0" />
        <p className="body-medium text-green-500 text-center">
          {summary.tierIndex === 3
            ? "Congratulations! You've reached the highest tier."
            : `${pointsToNext.toLocaleString()} points to reach the next tier.`}
        </p>
      </div>
    </div>
  );
};

export default TierCard;
