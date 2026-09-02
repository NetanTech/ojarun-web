"use client";

import React, { useState } from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import { usePathname } from "next/navigation";
import { Home, SafeDelivery } from "../../../../public/svg/svg";
import DeliveryAddress from "./components/DeliveryAddress";
import DeliveryNote from "./components/DeliveryNote";
import PromoCode from "./components/PromoCode";
import BankTransfer from "./components/BankTransfer";
import OrderSummary from "./components/OrderSummary";

const Page = () => {
  const pathName = usePathname();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [note, setNote] = useState("");

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="lg:max-w-300 lg:w-full mx-3 lg:mx-auto flex flex-col items-start gap-2 py-5">
        <BreadCrumb
          item={[
            {
              icon: <Home size={18} className="text-grey-300" />,
              title: "Home",
              href: "/",
            },
            {
              title: "Market",
              href: "/marketplace",
            },
            {
              title: "Checkout",
              href: pathName,
            },
          ]}
        />
        <h6 className="font-medium">Checkout</h6>
        <div className="flex flex-col lg:flex-row items-start gap-2 w-full">
          <div className="flex-1 w-full bg-white rounded-xl p-5 flex flex-col gap-5">
            {/* Delivery address */}
            <DeliveryAddress />

            {/* Delivery note */}
            <DeliveryNote note={note} onSave={setNote} />

            {/* Payment method */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-medium">Payment</p>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                  <div
                    className={`flex items-center gap-3 flex-1 w-full justify-between border p-2 rounded-xl py-4 cursor-pointer ${
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5"
                        : "border-[#E7E7E7]"
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="flex items-center gap-2 md:gap-5">
                      <SafeDelivery />
                      <p className="body-medium">Pay on Delivery</p>
                    </div>
                  </div>
                  <BankTransfer
                    selected={paymentMethod === "card"}
                    onSelect={() => setPaymentMethod("card")}
                  />
                </div>
                <PromoCode />
              </div>
            </div>
          </div>

          <OrderSummary paymentMethod={paymentMethod} note={note} />
        </div>
      </div>
    </div>
  );
};

export default Page;
