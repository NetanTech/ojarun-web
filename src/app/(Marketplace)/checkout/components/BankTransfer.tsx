"use client";

import Modal from "@/components/ui/Modal";
import { Bank, ChevronRight, Copy } from "../../../../../public/svg/svg";
import React, { useState } from "react";
import { formatCurrency } from "../../../../../lib/utils";
import Button from "@/components/ui/Button";

const BankTransfer = () => {
  const [showBankTrabsfer, setShowBankTransfer] = useState(false); // show Bank transfer modal
  return (
    <div className="flex items-center gap-3 flex-1 w-full justify-between border border-[#E7E7E7] p-2 rounded-xl py-4">
      <div className="flex items-center gap-5 ">
        <Bank />
        <p className="body-medium">Bank Transfer</p>
      </div>

      <button onClick={() => setShowBankTransfer(true)}>
        <ChevronRight />
      </button>

      <Modal
          isOpen={showBankTrabsfer}
          title="Bank transfer"
          className="w-[35%]"
          onClose={() => setShowBankTransfer(false)}
        >
          <div className="flex flex-col gap-2 w-full">
            <div className="w-full flex items-center justify-between gap-2 border rounded-lg p-3 border-[#E7E7E7]">
              <p className="text-grey-300">Bank</p>
              <p>Paystack-titan</p>
            </div>
            <div className="w-full flex items-center justify-between gap-2 border rounded-lg p-3 border-[#E7E7E7]">
              <p className="text-grey-300">Account number</p>
              <div className="flex items-center gap-2">
                2034568621
                <Copy size={20} />
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-2 border rounded-lg p-3 border-[#E7E7E7]">
              <p className="text-grey-300">Amount</p>
              <div className="flex items-center gap-2">
                {formatCurrency(5300)}
                <Copy size={20} />
              </div>
            </div>

            <Button as="button" size="lg" variant="primary">
              I have paid
            </Button>
          </div>
        </Modal>
    </div>
  );
};

export default BankTransfer;
