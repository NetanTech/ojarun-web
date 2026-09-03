"use client";

import Image from "next/image";
import React, { useState } from "react";
import { formatCurrency } from "../../../../../lib/utils";
import Button from "@/components/ui/Button";
import { SuccessIcon } from "../../../../../public/svg/AnimatedSvgs/fun-svg";
import Modal from "@/components/ui/Modal";
import { useCart } from "@/lib/cart";
import { useCustomerSession } from "@/lib/customerAuth";
import { createOrder, PromoValidation } from "@/lib/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AGENT_FEE = 1200;
const DELIVERY_FEE = 700;

interface OrderSummaryProps {
  paymentMethod: "cash" | "card";
  note?: string;
  promo?: PromoValidation | null;
  deliveryAddress: string;
}

const OrderSummary = ({ paymentMethod, note, promo, deliveryAddress }: OrderSummaryProps) => {
  const cart = useCart();
  const router = useRouter();
  const { customer, ready } = useCustomerSession();
  const [placeOrder, setPlaceOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasItems = cart.lines.length > 0;
  const discount = hasItems ? promo?.discountAmount || 0 : 0;
  const total = Math.max(
    cart.subtotal + (hasItems ? AGENT_FEE + DELIVERY_FEE : 0) - discount,
    0,
  );
  const loggedOut = ready && !customer;

  const handlePlaceOrder = async () => {
    if (!hasItems || !customer) return;
    if (!deliveryAddress.trim()) {
      setError("Add a delivery address before placing your order.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await createOrder({
        items: cart.lines.map((line) => ({
          name: line.name,
          unit: line.unit,
          price: line.price,
          quantity: line.quantity,
        })),
        deliveryAddress,
        paymentMethod,
        note: note?.trim() || undefined,
        promoCode: promo?.code,
      });

      if (result.paymentError) {
        setError(result.paymentError);
        return;
      }

      cart.clear();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      setPlaceOrder(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl flex flex-col w-full md:w-[30%] gap-2 p-3">
        <p className="body-medium font-medium">Order summary</p>

        {hasItems ? (
          cart.lines.map((line) => (
            <div
              className="flex items-center justify-between  border-b border-[#E7E7E7] py-3"
              key={line.id}
            >
              <div className="flex items-center gap-2">
                <div className="w-12.5 h-12.5 rounded-xl overflow-hidden">
                  <Image
                    src={line.image || "/assets/Untitled design.png"}
                    alt={line.name}
                    className="object-cover w-full h-full"
                    width={50}
                    height={50}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="body-medium font-medium">{line.name}</p>
                  <p className="text-grey-300 body-small">
                    {formatCurrency(line.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 body-medium text-white">
                x{line.quantity}
              </div>
            </div>
          ))
        ) : (
          <p className="text-grey-300 body-small py-3">Your cart is empty.</p>
        )}

        <div className="flex items-center justify-between text-grey-300">
          <p>Subtotal({cart.totalItems} items)</p>
          <p> {formatCurrency(cart.subtotal)} </p>
        </div>
        <div className="flex items-center justify-between text-grey-300">
          <p>Agent fee</p>
          <p> {formatCurrency(hasItems ? AGENT_FEE : 0)} </p>
        </div>
        <div className="flex items-center justify-between text-grey-300">
          <p>Delivery fee</p>
          <p> {formatCurrency(hasItems ? DELIVERY_FEE : 0)} </p>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <p>Discount ({promo?.code})</p>
            <p>-{formatCurrency(discount)}</p>
          </div>
        )}
        <div className="flex items-center justify-between font-medium">
          <p>Total</p>
          <p> {formatCurrency(total)} </p>
        </div>

        {loggedOut && (
          <p className="text-sm text-red-600">
            <Link href="/login" className="underline font-medium">
              Log in
            </Link>{" "}
            to place your order.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          as="button"
          size="sm"
          variant="primary"
          isDisabled={!hasItems || loggedOut || loading || !deliveryAddress.trim()}
          onClick={handlePlaceOrder}
        >
          {loading ? "Placing order..." : "Place order"}
        </Button>
      </div>

      <Modal
        isOpen={placeOrder}
        onClose={() => {
          setPlaceOrder(false);
          router.push("/marketplace");
        }}
        className="w-[30%]"
      >
        <div className="flex flex-col gap-2 w-full items-center justify-center">
          <SuccessIcon />
          <p className="body-large font-medium">Order placed successfully</p>
        </div>
      </Modal>
    </>
  );
};

export default OrderSummary;
