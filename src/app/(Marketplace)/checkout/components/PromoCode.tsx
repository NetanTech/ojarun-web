"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ChevronRight, Tag } from "../../../../../public/svg/svg";
import React, { useState } from "react";

const PromoCode = () => {
  const [openPCModal, setOpenPCModal] = useState(false); // promo code
  return (
    <div className="flex items-center gap-3 flex-1 w-full justify-between border border-[#E7E7E7] p-2 rounded-xl py-4" onClick={() => setOpenPCModal(true)}>
      <div className="flex items-center gap-5 ">
        <Tag className="-rotate-90" />
        <p className="body-medium">Use promo code</p>
      </div>

      <button onClick={() => setOpenPCModal(true)}>
        <ChevronRight />
      </button>

      <Modal
          isOpen={openPCModal}
          onClose={() => setOpenPCModal(false)}
          title="Promo code"
          className="w-[35%]"
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2 w-full border border-[#E7E7E7] rounded-xl p-3">
              <Tag />
              <input
                type="text"
                className="focus-within:outline-0 flex-1"
                placeholder="Add promo code"
              />
            </div>

            <Button as="button" size="lg" variant="primary" className="w-full">
              Use code
            </Button>
          </div>
        </Modal>
    </div>
  );
};

export default PromoCode;
