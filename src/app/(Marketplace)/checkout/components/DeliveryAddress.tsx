"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { MapPin, MapPin2, MapPin3 } from "../../../../../public/svg/svg";
import React, { useState } from "react";

const DeliveryAddress = () => {
  const [openDAModal, setOpenDAModal] = useState(false); // delivery address
  return (
   <>
    <div className="flex flex-col gap-2 items-start w-full">
      <p className="font-medium">Delivery address</p>
      <div className="border w-full flex items-center justify-between gap-3 border-[#E7E7E7] p-2 rounded-xl py-3" onClick={() => setOpenDAModal(true)}>
        <div className="flex items-center gap-2 md:gap-5">
          <MapPin2 />
          <p>John doe street, john doe</p>
        </div>

        <button
          className="bg-green-500 text-white p-2 px-4 rounded-full flex items-center justify-center"
          onClick={() => setOpenDAModal(true)}
        >
          change
        </button>

      </div>
        <Modal
            isOpen={openDAModal}
            onClose={() => setOpenDAModal(false)}
            title="Delivery address"
            className="w-[35%]"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2 w-full border border-[#E7E7E7] rounded-xl p-3">
                <MapPin3 />
                <input
                  type="text"
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
                Use current location
              </Button>
            </div>
          </Modal>
    </div>
   </>
  );
};

export default DeliveryAddress;
