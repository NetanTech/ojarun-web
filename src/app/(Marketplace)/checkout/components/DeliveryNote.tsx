"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ChevronRight, DeliveryBox } from "../../../../../public/svg/svg";
import React, { useState } from "react";

const DeliveryNote = () => {
  const [openDNModal, setOpenDNModal] = useState(false); // delivery note
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <p className="font-medium">Delivery note</p>
      <div className="border w-full flex items-center justify-between gap-3 border-[#E7E7E7] p-2 rounded-xl py-3" onClick={() => setOpenDNModal(true)}>
        <div className="flex items-center gap-5">
          <DeliveryBox />
          <div className="flex flex-col gap-2">
            <p className="body-medium font-medium">
              Leave a note for the agent
            </p>
            <p className="text-grey-300 body-small">
              Special requests, preferences, packaging instructions...
            </p>
          </div>
        </div>

        <button onClick={() => setOpenDNModal(true)}>
          <ChevronRight />
        </button>

        <Modal
            isOpen={openDNModal}
            onClose={() => setOpenDNModal(false)}
            title="Delivery note"
            className="w-[35%]"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2 w-full border border-[#E7E7E7] rounded-xl p-3">
                <textarea
                  rows={3}
                  className="focus-within:outline-0 flex-1"
                  placeholder="Enter a delivery address"
                />
              </div>

              <Button
                as="button"
                size="lg"
                variant="primary"
                className="w-full"
              >
                Add note
              </Button>
            </div>
          </Modal>
      </div>
    </div>
  );
};

export default DeliveryNote;
