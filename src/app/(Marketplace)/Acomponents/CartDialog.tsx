"use client";

import { Minus, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BasketEmpty, TrashCan } from "../../../../public/svg/svg";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { formatCurrency } from "../../../../lib/utils";

interface CartDrawerProps {
  onClose: () => void;
  isOpen: boolean;
  products: CartItem[];
}

const Empty = () => {
  return (
    <div className="flex items-center text-black justify-center w-full h-full flex-col gap-5">
      <BasketEmpty />
      <h6 className="font-medium text-black">Empty cart</h6>
      <p className="body-medium text-regular text-grey-300">
        Add items from the market to get started
      </p>
      <Button as="button" size="sm" variant="primary">
        Shop now
      </Button>
    </div>
  );
};

const ItemRow = ({ img, productName, meta, price }: CartItem) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex border-b-2 items-center justify-between py-3 pb-5 border-b-[#E7E7E7] text-black">
      <div className="flex items-start gap-2">
        <div className="w-20 h-20 rounded-[6.1px] overflow-hidden border border-[#E7E7E7]">
          <Image
            src={img || "/assets/Untitled design.png"}
            alt={productName}
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col">
          <p className="body-medium text-medium capitalize">{productName}</p>
          <p className="body-xsmall text-grey-300 capitalize">{meta}</p>
          <p className="body-medium text-medium">
            {" "}
            {formatCurrency(price, "NGN")}{" "}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 bg-green-500 rounded-full p-2 text-white hover:bg-green-400">
          <Minus
            size={15}
            onClick={() => {
              if (quantity > 0) setQuantity((prev) => prev - 1);
            }}
          />
          {quantity}
          <Plus
            size={15}
            onClick={() => {
              if (quantity) setQuantity((prev) => prev + 1);
            }}
          />
        </div>

        <button className="bg-red-50 p-2 rounded-full flex items-center justify-center text-red-500">
          <TrashCan className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const CartDrawer = ({ onClose, isOpen, products }: CartDrawerProps) => {
  useEffect(() => {
    const handleEscClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscClick);

    return () => document.removeEventListener("keydown", handleEscClick);
  }, [isOpen, onClose]);

  const cartContent = (
    <>
      {products.length > 0 ? (
        <div
          className="flex flex-col gap-3 overflow-y-auto pb-10"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, i) => (
            <ItemRow
              productName={product.productName}
              meta={product.meta}
              img={product.img}
              quantity={product.quantity}
              key={i}
              price={product.price}
            />
          ))}

          <div className="flex items-center justify-between my-3">
            <p className="body-medium capitalize text-grey-400">
              Subtotal({products.length + " " + "items"})
            </p>
            <p className="text-black">
              {formatCurrency(
                products.reduce((prev, n) => prev + n.price, 0),
                "NGN"
              )}
            </p>
          </div>

          <Button
            as="link"
            to="/checkout"
            className="mb-5"
            variant="primary"
            size="sm"
            onClick={() => onClose()}
          >
            Go to checkout
          </Button>
        </div>
      ) : (
        <Empty />
      )}
    </>
  );

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-5 py-4 md:hidden ${isOpen ? "translate-y-0" : "translate-y-full"} transition-transform duration-300 ease-in-out`}
        style={{ maxHeight: "85vh" }}
      >
        <div
          className={`flex items-center text-black justify-between my-3 ${products.length > 0 && "border-b border-b-[#E7E7E7] py-3"}`}
        >
          <h6 className="font-medium">Cart</h6>
          <X className="text cursor-pointer" onClick={onClose} />
        </div>
        <div
          className="overflow-y-auto"
          style={{ scrollbarWidth: "none", maxHeight: "calc(85vh - 80px)" }}
        >
          {cartContent}
        </div>
      </div>

      <div
        className={`hidden md:block w-[550px] top-0 bottom-0 fixed z-50 right-0 bg-white py-4 px-6 ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
      >
        <div
          className={`flex items-center text-black justify-between my-3 ${products.length > 0 && "border-b border-b-[#E7E7E7] py-3"}`}
        >
          <h6 className="font-medium">Cart</h6>
          <X className="text cursor-pointer" onClick={onClose} />
        </div>
        <div
          className="flex flex-col h-full overflow-y-auto pb-10"
          style={{ scrollbarWidth: "none" }}
        >
          {cartContent}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
