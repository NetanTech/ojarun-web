"use client";

import React from "react";
import { Wallet, Coins, Gift } from "lucide-react";
import type { RewardsSummary } from "@/lib/rewards";

const SummaryCard = ({ summary }: { summary: RewardsSummary }) => {
  const rows = [
    { icon: Wallet, label: "Available Points", value: summary.points },
    { icon: Coins, label: "Points Earned", value: summary.totalEarned },
    { icon: Gift, label: "Points Redeemed", value: summary.totalRedeemed },
  ];

  return (
    <div className="border border-[#E7E7E7] rounded-[20px] p-6 flex flex-col gap-6 bg-white w-full">
      <h6>Summary</h6>
      <div className="flex flex-col gap-4 w-full">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="border border-[#E7E7E7] rounded-2xl p-2.5 flex items-center gap-3 w-full"
            >
              <div className="bg-green-50 p-3 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={22} className="text-green-600" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-grey-300 body-small">{row.label}</p>
                <p className="font-medium body-medium">{row.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryCard;
