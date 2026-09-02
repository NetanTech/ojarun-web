"use client";

import { Bank, ChevronRight } from "../../../../../public/svg/svg";
import React from "react";

interface BankTransferProps {
  selected: boolean;
  onSelect: () => void;
}

const BankTransfer = ({ selected, onSelect }: BankTransferProps) => {
  return (
    <div
      className={`flex items-center gap-3 flex-1 w-full justify-between border p-2 rounded-xl py-4 cursor-pointer ${
        selected ? "border-primary bg-primary/5" : "border-[#E7E7E7]"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 md:gap-5">
        <Bank />
        <div>
          <p className="body-medium">Pay with card / bank transfer</p>
          <p className="text-xs text-grey-300">via Paystack — redirects to a secure checkout</p>
        </div>
      </div>

      <ChevronRight />
    </div>
  );
};

export default BankTransfer;
