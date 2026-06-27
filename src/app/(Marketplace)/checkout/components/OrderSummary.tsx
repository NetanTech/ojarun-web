"use client";

import Image from "next/image";
import React, { useState } from "react";
import { CARTPRODUCTS } from "../../../../../constants/data";
import { formatCurrency } from "../../../../../lib/utils";
import Button from "@/components/ui/Button";
import { SuccessIcon } from "../../../../../public/svg/AnimatedSvgs/fun-svg";
import Modal from "@/components/ui/Modal";

const OrderSummary = () => {
  const [placeOrder, setPlaceOrder] = useState(false);
  return (
    <>
      <div className="bg-white rounded-xl flex flex-col w-full md:w-[30%] gap-2 p-3">
        <p className="body-medium font-medium">Order summary</p>

        {CARTPRODUCTS.map((product, i) => (
          <div
            className="flex items-center justify-between  border-b border-[#E7E7E7] py-3"
            key={i}
          >
            <div className="flex items-center gap-2">
              <div className="w-12.5 h-12.5 rounded-xl overflow-hidden">
                <Image
                  src={product.img || "/assets/Untitled design.png"}
                  alt={product.productName}
                  className="object-cover w-full h-full"
                  width={50}
                  height={50}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="body-medium font-medium">{product.productName}</p>
                <p className="text-grey-300 body-small">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 body-medium text-white">
              x{product.quantity}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between text-grey-300">
          <p>Subtotal({CARTPRODUCTS.length} items)</p>
          <p>
            {" "}
            {formatCurrency(CARTPRODUCTS.reduce((a, b) => a + b.price, 0))}{" "}
          </p>
        </div>
        <div className="flex items-center justify-between text-grey-300">
          <p>Agent fee</p>
          <p> {formatCurrency(1200)} </p>
        </div>
        <div className="flex items-center justify-between text-grey-300">
          <p>Delivery fee</p>
          <p> {formatCurrency(700)} </p>
        </div>
        <div className="flex items-center justify-between font-medium">
          <p>Total</p>
          <p> {formatCurrency(6500)} </p>
        </div>

        <Button
          as="button"
          size="sm"
          variant="primary"
          onClick={() => setPlaceOrder(true)}
        >
          Place order
        </Button>
      </div>

      <Modal isOpen={placeOrder} onClose={() => setPlaceOrder(false)} className="w-[30%]">
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <SuccessIcon />
            <p className="body-large font-medium">Order placed successfully</p>
          </div>
        </Modal>
    </>
  );
};

export default OrderSummary;
